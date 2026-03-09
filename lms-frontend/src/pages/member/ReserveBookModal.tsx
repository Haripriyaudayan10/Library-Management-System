import { useEffect, useMemo, useState } from 'react';
import { BookOpen, Clock3, Search, X } from 'lucide-react';
import ModalShell from '../../components/common/ModalShell';
import {
  reserveMemberBook,
  searchMemberBooks,
  type MemberBookSearchItem,
} from '../../services/memberPortalService';

interface ReserveBookModalProps {
  onClose: () => void;
  onReserved?: () => void;
}

export default function ReserveBookModal({ onClose, onReserved }: ReserveBookModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MemberBookSearchItem[]>([]);
  const [selectedBook, setSelectedBook] = useState<MemberBookSearchItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const keyword = query.trim();
    if (!keyword) {
      setResults([]);
      return;
    }

    const handle = setTimeout(async () => {
      try {
        const books = await searchMemberBooks(keyword);
        setResults(books);
      } catch (error) {
        console.error('Failed to search books', error);
        setResults([]);
      }
    }, 250);

    return () => clearTimeout(handle);
  }, [query]);

  const queueText = useMemo(() => {
    if (!selectedBook) return 'Auto';
    return selectedBook.availableCopies > 0 ? 'Not Needed' : 'Auto';
  }, [selectedBook]);

  const statusText = useMemo(() => {
    if (!selectedBook) return 'Select a book from search results.';
    if (selectedBook.availableCopies > 0) return 'Book currently available in library.';
    return 'All copies currently borrowed.';
  }, [selectedBook]);

  const handleReserve = async () => {
    if (!selectedBook) {
      setMessage('Please select a book first.');
      return;
    }
    setSubmitting(true);
    setMessage('');
    try {
      const response = await reserveMemberBook(selectedBook.bookId);
      setMessage(response);
      onReserved?.();
    } catch (error) {
      console.error('Failed to reserve book', error);
      setMessage('Unable to reserve this book right now.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalShell cardClassName="max-w-3xl" overlayClassName="bg-slate-900/45" zIndexClassName="z-50">
        <div className="flex items-center justify-between border-b border-slate-200 bg-emerald-50 px-4 py-3.5">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-emerald-700 p-2.5 text-white">
              <BookOpen size={16} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">Reserve New Book</h2>
          </div>
          <button type="button" className="text-slate-600" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3 p-4">
          <div>
            <p className="mb-2 text-lg font-bold text-slate-800 sm:text-xl">Search Book</p>
            <label className="relative block">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                className="h-10 w-full rounded-xl border border-emerald-200 bg-emerald-50/60 pl-12 pr-4 text-base text-slate-700 sm:h-11 sm:text-xl"
                placeholder="Search by title or author"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            {results.length > 0 ? (
              <div className="mt-2 max-h-32 overflow-auto rounded-lg border border-slate-200 bg-white">
                {results.map((book) => (
                  <button
                    key={book.bookId}
                    type="button"
                    className="block w-full border-b border-slate-100 px-3 py-2 text-left text-sm hover:bg-slate-50"
                    onClick={() => {
                      setSelectedBook(book);
                      setQuery(book.title);
                      setResults([]);
                    }}
                  >
                    {book.title} - {book.author}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div>
            <p className="mb-2 text-lg font-bold text-slate-800 sm:text-xl">Selected Book</p>
            <div className="rounded-xl border border-slate-200 bg-slate-50/70">
              <div className="flex flex-col gap-3 border-b border-slate-200 p-3.5 sm:flex-row">
                <div className="h-28 w-20 rounded-lg border border-slate-300 bg-[linear-gradient(180deg,#f3efe4,#dfd8c8)]" />
                <div>
                  <p className="text-xl font-bold text-slate-800 sm:text-2xl">{selectedBook?.title ?? 'No book selected'}</p>
                  <p className="mt-0.5 text-lg text-slate-600 sm:text-xl">{selectedBook?.author ?? '-'}</p>
                  <p className="mt-2 text-lg text-slate-700 sm:text-xl">
                  </p>
                  <p className="mt-1.5 text-lg sm:text-xl">
                    <span className="font-semibold text-rose-500">Status:</span>{' '}
                    <span className="text-slate-700">{statusText}</span>
                  </p>
                </div>
              </div>

              <div className="p-3">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                  <p className="inline-flex items-center gap-2 text-lg font-bold text-emerald-900 sm:text-xl">
                    <Clock3 size={18} />
                    Estimated Queue Position: {queueText}
                  </p>
                  <p className="mt-1.5 pl-7 text-lg text-slate-600 sm:text-xl">You&apos;ll be added to the waiting list.</p>
                </div>
              </div>
            </div>
          </div>

          {message ? <p className="text-sm font-semibold text-slate-700">{message}</p> : null}

          <div className="flex flex-col justify-end gap-2 sm:flex-row sm:gap-3">
            <button
              type="button"
              className="h-11 rounded-xl border border-slate-300 bg-white px-6 text-lg font-semibold text-slate-700 sm:h-12 sm:px-7 sm:text-xl"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="h-11 rounded-xl bg-emerald-700 px-6 text-lg font-semibold text-white sm:h-12 sm:px-7 sm:text-xl disabled:opacity-50"
              onClick={() => void handleReserve()}
              disabled={submitting}
            >
              {submitting ? 'Reserving...' : 'Reserve Book'}
            </button>
          </div>
        </div>
    </ModalShell>
  );
}
