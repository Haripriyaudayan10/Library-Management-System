import { useEffect, useMemo, useState } from 'react';
import { BookOpen, Search, X } from 'lucide-react';
import ModalShell from '../../components/common/ModalShell';
import { createLoan } from '../../services/loanService';
import api from '../../services/api';

interface NewLoanModalProps {
  onClose: () => void;
  onCreated?: () => void;
}

interface MemberOption {
  userid: string;
  name: string;
  email: string;
}

interface BookOption {
  bookId: number;
  title: string;
  authorName: string;
}

interface CopyOption {
  copyid: number;
  status: string;
}

interface PagedResponse<T> {
  content: T[];
}

export default function NewLoanModal({ onClose, onCreated }: NewLoanModalProps) {
  const [memberQuery, setMemberQuery] = useState('');
  const [memberOptions, setMemberOptions] = useState<MemberOption[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState('');

  const [bookQuery, setBookQuery] = useState('');
  const [allBooks, setAllBooks] = useState<BookOption[]>([]);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);

  const [availableCopies, setAvailableCopies] = useState<CopyOption[]>([]);
  const [selectedCopyId, setSelectedCopyId] = useState('');

  const filteredBooks = useMemo(() => {
    const q = bookQuery.trim().toLowerCase();
    if (!q) return [];

    return allBooks
      .filter((book) => {
        const title = book.title?.toLowerCase() ?? '';
        const author = book.authorName?.toLowerCase() ?? '';
        const id = String(book.bookId);
        return title.includes(q) || author.includes(q) || id.includes(q);
      })
      .slice(0, 10);
  }, [allBooks, bookQuery]);

  useEffect(() => {
    const loadAllBooks = async () => {
      try {
        const { data } = await api.get<PagedResponse<BookOption>>('/api/admin/books', {
          params: { page: 0, size: 200 },
        });
        setAllBooks(Array.isArray(data?.content) ? data.content : []);
      } catch (error) {
        console.error('Failed to load books for loan modal', error);
      }
    };

    void loadAllBooks();
  }, []);

  useEffect(() => {
    if (!selectedBookId) {
      setAvailableCopies([]);
      setSelectedCopyId('');
      return;
    }

    const loadCopies = async () => {
      try {
        const { data } = await api.get<CopyOption[]>(`/api/admin/copies/book/${selectedBookId}`);
        const options = (Array.isArray(data) ? data : []).filter(
          (copy) => String(copy.status).toUpperCase() === 'AVAILABLE',
        );
        setAvailableCopies(options);
        setSelectedCopyId('');
      } catch (error) {
        console.error('Failed to load available copies', error);
        setAvailableCopies([]);
      }
    };

    void loadCopies();
  }, [selectedBookId]);

  useEffect(() => {
    const query = memberQuery.trim();
    if (!query) {
      setMemberOptions([]);
      return;
    }

    const timer = window.setTimeout(async () => {
      try {
        const { data } = await api.get<PagedResponse<MemberOption>>('/api/admin/users', {
          params: { name: query, role: 'MEMBER', page: 0, size: 20 },
        });
        setMemberOptions(Array.isArray(data?.content) ? data.content : []);
      } catch (error) {
        console.error('Failed to search members', error);
        setMemberOptions([]);
      }
    }, 250);

    return () => window.clearTimeout(timer);
  }, [memberQuery]);

  const handleCreateLoan = async () => {
    const parsedCopyId = Number(selectedCopyId);
    if (!selectedMemberId || !parsedCopyId) return;

    try {
      await createLoan(parsedCopyId, selectedMemberId);
      onCreated?.();
      onClose();
    } catch (error) {
      console.error('Failed to create loan', error);
    }
  };

  return (
    <ModalShell cardClassName="max-w-3xl" zIndexClassName="z-50">
        <div className="flex items-center justify-between border-b border-slate-200 bg-emerald-50 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-700 p-2 text-white">
              <BookOpen size={16} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">New Loan Details</h2>
          </div>
          <button type="button" className="text-slate-600" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Loan Information</p>

          <div className="space-y-5 text-sm">
            <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[140px_1fr] sm:gap-4">
              <p className="text-slate-800">Select Member:</p>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                <input
                  className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs"
                  placeholder="Search by member name."
                  value={memberQuery}
                  onChange={(e) => {
                    setMemberQuery(e.target.value);
                    setSelectedMemberId('');
                  }}
                />
                {memberOptions.length > 0 ? (
                  <div className="absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded-lg border border-slate-200 bg-white p-1 shadow">
                    {memberOptions.map((member) => (
                      <button
                        key={member.userid}
                        type="button"
                        className="block w-full rounded px-2 py-1 text-left text-xs hover:bg-slate-50"
                        onClick={() => {
                          setMemberQuery(member.name);
                          setSelectedMemberId(member.userid);
                          setMemberOptions([]);
                        }}
                      >
                        {member.name} ({member.email})
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[140px_1fr] sm:gap-4">
              <p className="text-slate-800">Select Book:</p>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                <input
                  className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs"
                  placeholder="Search by Book name, Author or Book ID."
                  value={bookQuery}
                  onChange={(e) => {
                    setBookQuery(e.target.value);
                    setSelectedBookId(null);
                    setSelectedCopyId('');
                  }}
                />
                {filteredBooks.length > 0 ? (
                  <div className="absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded-lg border border-slate-200 bg-white p-1 shadow">
                    {filteredBooks.map((book) => (
                      <button
                        key={book.bookId}
                        type="button"
                        className="block w-full rounded px-2 py-1 text-left text-xs hover:bg-slate-50"
                        onClick={() => {
                          setBookQuery(`${book.title} - ${book.authorName}`);
                          setSelectedBookId(book.bookId);
                        }}
                      >
                        {book.title} ({book.authorName})
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[140px_1fr] sm:gap-4">
              <p className="text-slate-800">Available Copies:</p>
              <select
                className="h-9 w-40 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs text-slate-700"
                value={selectedCopyId}
                onChange={(e) => setSelectedCopyId(e.target.value)}
              >
                <option value="">Select Copy ID</option>
                {availableCopies.map((copy) => (
                  <option key={copy.copyid} value={String(copy.copyid)}>
                    {copy.copyid}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[140px_1fr] sm:gap-4">
              <p className="text-slate-800">Enter Book Copy ID:</p>
              <input
                className="h-9 w-24 rounded-lg border border-slate-200 bg-slate-100 px-3 text-xs"
                value={selectedCopyId}
                onChange={(e) => setSelectedCopyId(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-2 sm:mt-14 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              className="h-12 w-full rounded border border-slate-200 bg-white text-sm font-semibold text-slate-700 sm:h-20 sm:w-36"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="button"
              className="h-12 w-full rounded bg-emerald-700 text-sm font-semibold text-white sm:h-20 sm:w-36"
              onClick={() => void handleCreateLoan()}
            >
              Create
            </button>
          </div>
          </div>
    </ModalShell>
  );
}
