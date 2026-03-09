import api from './api';

export interface BookCategory {
  categoryid?: number;
  name?: string;
}

export interface BookItem {
  bookId: number;
  title: string;
  authorName: string;
  category?: BookCategory;
}

interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface BookPageResult {
  content: BookItem[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export async function getBooks(page = 0, size = 10, author?: string): Promise<BookPageResult> {
  const { data } = await api.get<PagedResponse<BookItem>>('/api/admin/books', {
    params: { page, size, ...(author ? { author } : {}) },
  });

  return {
    content: data?.content ?? [],
    totalElements: data?.totalElements ?? 0,
    totalPages: data?.totalPages ?? 0,
    page: data?.number ?? page,
    size: data?.size ?? size,
  };
}

export async function deleteBook(bookId: number): Promise<void> {
  await api.delete('/api/admin/books', { params: { bookId } });
}
