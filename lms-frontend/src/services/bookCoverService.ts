interface CoverLookupItem {
  id: string;
  title: string;
  author?: string;
  existingUrl?: string;
}

const FALLBACK_COVER = '/default-book.svg';
const STORAGE_KEY = 'lms_book_cover_cache_v1';
const memoryCache = new Map<string, string>();
const inFlightRequests = new Map<string, Promise<string>>();

function normalizeUrl(url?: string | null): string {
  if (!url || !url.trim()) return '';
  if (url.startsWith('http://')) return `https://${url.slice(7)}`;
  return url;
}

function cacheKey(title: string, author?: string): string {
  return `${title.trim().toLowerCase()}::${(author ?? '').trim().toLowerCase()}`;
}

function readStorage(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, string>;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeStorage(next: Record<string, string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage failures in private mode or quota limits.
  }
}

async function fetchGoogleBooksCover(title: string, author?: string): Promise<string> {
  const titlePart = encodeURIComponent(title.trim());
  const authorPart = author?.trim() ? `+inauthor:${encodeURIComponent(author.trim())}` : '';
  const query = `intitle:${titlePart}${authorPart}`;
  const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1&printType=books`;

  try {
    const response = await fetch(url);
    if (!response.ok) return '';
    const data = (await response.json()) as {
      items?: Array<{
        volumeInfo?: {
          imageLinks?: {
            extraLarge?: string;
            large?: string;
            medium?: string;
            small?: string;
            thumbnail?: string;
            smallThumbnail?: string;
          };
        };
      }>;
    };

    const imageLinks = data?.items?.[0]?.volumeInfo?.imageLinks;
    const best = normalizeUrl(
      imageLinks?.extraLarge ??
        imageLinks?.large ??
        imageLinks?.medium ??
        imageLinks?.small ??
        imageLinks?.thumbnail ??
        imageLinks?.smallThumbnail,
    );
    return best;
  } catch {
    return '';
  }
}

export async function resolveSingleBookCover(title: string, author?: string, existingUrl?: string): Promise<string> {
  const existing = normalizeUrl(existingUrl);
  if (existing) return existing;

  const key = cacheKey(title, author);
  const fromMemory = memoryCache.get(key);
  if (fromMemory) return fromMemory;

  const storage = readStorage();
  if (storage[key]) {
    memoryCache.set(key, storage[key]);
    return storage[key];
  }

  if (inFlightRequests.has(key)) {
    return inFlightRequests.get(key) as Promise<string>;
  }

  const request = (async () => {
    const resolved = (await fetchGoogleBooksCover(title, author)) || FALLBACK_COVER;
    memoryCache.set(key, resolved);
    writeStorage({ ...storage, [key]: resolved });
    inFlightRequests.delete(key);
    return resolved;
  })();

  inFlightRequests.set(key, request);
  return request;
}

export async function resolveBookCoverMap(items: CoverLookupItem[]): Promise<Record<string, string>> {
  const unique = new Map<string, CoverLookupItem>();
  for (const item of items) {
    if (!item.id || !item.title?.trim()) continue;
    unique.set(item.id, item);
  }

  const entries = await Promise.all(
    Array.from(unique.values()).map(async (item) => [
      item.id,
      await resolveSingleBookCover(item.title, item.author, item.existingUrl),
    ] as const),
  );

  return Object.fromEntries(entries);
}
