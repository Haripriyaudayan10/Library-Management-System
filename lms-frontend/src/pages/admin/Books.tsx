import { useEffect, useMemo, useState } from 'react';
import {
  ChevronRight,
  Plus,
  Trash2,
  Book,
  BookOpen,
  CircleAlert
} from 'lucide-react';

import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal';
import ModalShell from '../../components/common/ModalShell';
import api from '../../services/api';
import { deleteBook, type BookItem } from '../../services/bookService';
import { getLoans } from '../../services/loanService';
import SearchSuggestInput, { type SearchSuggestionItem } from '../../components/common/SearchSuggestInput';
import { resolveBookCoverMap } from '../../services/bookCoverService';
import { useDebouncedValue } from '../../lib/useDebouncedValue';
import Pagination from '../../components/common/Pagination';

interface BookRow {
  bookId: number;
  title: string;
  author: string;
  genre: string;
  status: string;
  coverImageUrl?: string;
}

interface BooksProps {
  searchQuery?: string;
}

interface AddBookForm {
  title: string;
  authorName: string;
  category: string;
  numberOfCopies: number;
}

interface CategoryResponse {
  categoryid: number;
  name?: string;
}

interface CreatedBookResponse {
  bookId: number;
  title: string;
  authorName: string;
  category?: {
    categoryid?: number;
    name?: string;
  };
}

const initialAddBookForm: AddBookForm = {
  title: '',
  authorName: '',
  category: '',
  numberOfCopies: 1,
};

function extractBooksData(data: unknown): BookItem[] {
  if (Array.isArray(data)) return data as BookItem[];

  const maybePage = data as { content?: BookItem[] } | undefined;
  return maybePage?.content ?? [];
}

function extractTotalCount(data: unknown, fallback: number): number {
  const maybePage = data as { totalElements?: number } | undefined;
  return typeof maybePage?.totalElements === 'number' ? maybePage.totalElements : fallback;
}

async function resolveCategoryId(categoryName: string, existingBooks: BookItem[]): Promise<number> {
  const match = existingBooks.find(
    (book) => book.category?.name?.toLowerCase() === categoryName.toLowerCase(),
  );

  if (match?.category?.categoryid) {
    return match.category.categoryid;
  }

  const existingCategoryResponse = await api.get('/api/admin/books', {
    params: { category: categoryName, page: 0, size: 1 },
  });
  const existingCategoryBooks = extractBooksData(existingCategoryResponse.data);
  const existingCategoryId = existingCategoryBooks[0]?.category?.categoryid;
  if (existingCategoryId) {
    return existingCategoryId;
  }

  const { data } = await api.post<CategoryResponse>('/api/admin/books', null, {
    params: { categoryName },
  });

  return data.categoryid;
}

export default function Books({ searchQuery = '' }: BooksProps) {

  const [books, setBooks] = useState<BookItem[]>([]);
  const [localSearch, setLocalSearch] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState('');
  const debouncedLocalSearch = useDebouncedValue(localSearch, 425);
  const effectiveLocalSearch = localSearch.trim() === '' ? '' : debouncedLocalSearch;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [activeLoans, setActiveLoans] = useState(0);
  const [overdueItems, setOverdueItems] = useState(0);
  const [showAddBookPage, setShowAddBookPage] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<BookRow | null>(null);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string | null>(null);
  const [addBookForm, setAddBookForm] = useState<AddBookForm>(initialAddBookForm);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [bookCoverMap, setBookCoverMap] = useState<Record<string, string>>({});
  const [expandedBookIds, setExpandedBookIds] = useState<Record<string, boolean>>({});
  const [categoryOptions, setCategoryOptions] = useState<string[]>([
    'Fiction',
    'Sci-Fi',
    'Self-Help',
    'Literary Fiction',
  ]);

  const bookRows = useMemo<BookRow[]>(
    () =>
      books.map((book) => ({
        bookId: book.bookId,
        title: book.title,
        author: book.authorName,
        genre: book.category?.name ?? 'General',
        status: 'Available',
        coverImageUrl: book.coverImageUrl,
      })),
    [books],
  );

  const bookSuggestions = useMemo<SearchSuggestionItem[]>(() => {
    const q = effectiveLocalSearch.trim().toLowerCase();
    if (!q) return [];
    return bookRows
      .filter((book) =>
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        book.genre.toLowerCase().includes(q),
      )
      .slice(0, 10)
      .map((book) => ({
        id: String(book.bookId),
        label: `${book.title} (${book.author})`,
        value: book.title,
      }));
  }, [bookRows, effectiveLocalSearch]);

  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(bookRows.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedBookRows = useMemo(
    () => bookRows.slice(startIndex, endIndex),
    [bookRows, startIndex, endIndex],
  );

  const toggleBookId = (bookId: number) => {
    const key = String(bookId);
    setExpandedBookIds((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    let active = true;
    const applyCovers = async () => {
      if (bookRows.length === 0) return;
      const map = await resolveBookCoverMap(
        bookRows.map((book) => ({
          id: String(book.bookId),
          title: book.title,
          author: book.author,
          existingUrl: book.coverImageUrl,
        })),
      );
      if (!active) return;
      setBookCoverMap((prev) => ({ ...prev, ...map }));
    };

    void applyCovers();
    return () => {
      active = false;
    };
  }, [bookRows]);

  const loadLoanStats = async () => {
    const loans = await getLoans();

    setActiveLoans(loans.filter((loan) => String(loan.status).toUpperCase() === 'ACTIVE').length);
    setOverdueItems(
      loans.filter((loan) => {
        if (String(loan.status).toUpperCase() !== 'ACTIVE' || !loan.dueDate) return false;
        return new Date(loan.dueDate).getTime() < Date.now();
      }).length,
    );
  };

  const loadAllBooks = async () => {
    const response = await api.get('/api/admin/books', { params: { page: 0, size: 50 } });
    const booksData = extractBooksData(response.data);

    setBooks(booksData);
    setTotalBooks(extractTotalCount(response.data, booksData.length));
    const fetchedCategories = booksData
      .map((book) => book.category?.name?.trim())
      .filter((name): name is string => Boolean(name));
    setCategoryOptions((prev) => Array.from(new Set([...prev, ...fetchedCategories])));
  };

  const searchBooks = async (query: string) => {
    if (!query.trim()) {
      await loadAllBooks();
      return;
    }

    const normalizedQuery = query.trim().toLowerCase();

    const authorResponse = await api.get('/api/admin/books', {
      params: { author: query, page: 0, size: 50 },
    });

    const authorBooksData = extractBooksData(authorResponse.data);

    if (authorBooksData.length > 0) {
      setBooks(authorBooksData);
      return;
    }

    const categoryResponse = await api.get('/api/admin/books', {
      params: { category: query, page: 0, size: 50 },
    });

    const categoryBooksData = extractBooksData(categoryResponse.data);
    if (categoryBooksData.length > 0) {
      setBooks(categoryBooksData);
      return;
    }

    const allBooksResponse = await api.get('/api/admin/books', { params: { page: 0, size: 50 } });
    const allBooksData = extractBooksData(allBooksResponse.data);
    const localMatches = allBooksData.filter((book) => {
      const title = (book.title ?? '').toLowerCase();
      const author = (book.authorName ?? '').toLowerCase();
      const category = (book.category?.name ?? '').toLowerCase();
      return title.includes(normalizedQuery) || author.includes(normalizedQuery) || category.includes(normalizedQuery);
    });
    setBooks(localMatches);
  };

  const refreshPageData = async (query = '') => {
    try {
      await Promise.all([loadLoanStats(), loadAllBooks()]);

      if (query.trim()) {
        await searchBooks(query);
      }
      setCurrentPage(1);
    } catch (error) {
      console.error('Failed to load books', error);
    }
  };

  useEffect(() => {
    void refreshPageData();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) return;

    const query = searchQuery.trim();
    setLocalSearch(query);
    setSubmittedSearch(query);
    void refreshPageData(query);
  }, [searchQuery]);

  useEffect(() => {
    const nextQuery = effectiveLocalSearch.trim();
    if (nextQuery === submittedSearch.trim()) {
      return;
    }
    setSubmittedSearch(nextQuery);
    void refreshPageData(nextQuery);
  }, [effectiveLocalSearch, submittedSearch]);

  const handleDelete = async () => {
    if (!bookToDelete) return;

    try {
      await deleteBook(bookToDelete.bookId);
      await refreshPageData(submittedSearch);
    } catch (error) {
      console.error('Failed to delete book', error);
      const maybeAxios = error as {
        response?: { data?: { message?: string; error?: string } | string; status?: number };
      };
      const responseData = maybeAxios?.response?.data;
      const statusCode = maybeAxios?.response?.status;
      const asString = typeof responseData === 'string' ? responseData.trim() : '';
      const apiMessage =
        typeof responseData === 'string'
          ? asString
          : responseData?.message?.trim() || responseData?.error?.trim() || '';
      const deleteBlockedReason = 'Cannot delete this book now. All loans for this book must be returned first.';
      const message =
        statusCode === 409
          ? (apiMessage || deleteBlockedReason)
          : (apiMessage || 'All loans for this book must be returned first.');
      setDeleteErrorMessage(message);
    } finally {
      setBookToDelete(null);
    }
  };

  const handleSaveBook = async () => {
    const selectedCategory =
      addBookForm.category === '__new__'
        ? newCategoryName.trim()
        : addBookForm.category.trim();

    const payload = {
      title: addBookForm.title.trim(),
      authorName: addBookForm.authorName.trim(),
      category: selectedCategory,
      numberOfCopies: Math.max(1, Number(addBookForm.numberOfCopies) || 1),
    };

    if (!payload.title || !payload.authorName || !payload.category) {
      return;
    }

    try {
      const categoryId = await resolveCategoryId(payload.category, books);

      const { data: createdBook } = await api.post<CreatedBookResponse>('/api/admin/books', {
        title: payload.title,
        authorName: payload.authorName,
        category: { categoryid: categoryId },
      });

      for (let i = 0; i < payload.numberOfCopies; i += 1) {
        await api.post('/api/admin/copies', null, {
          params: { bookId: createdBook.bookId },
        });
      }

      setShowAddBookPage(false);
      setAddBookForm(initialAddBookForm);
      setNewCategoryName('');
      setCategoryOptions((prev) =>
        payload.category ? Array.from(new Set([...prev, payload.category])) : prev,
      );
      setLocalSearch('');
      setSubmittedSearch('');
      await refreshPageData();
    } catch (error) {
      console.error('Failed to save book', error);
    }
  };

  if (showAddBookPage) {
    return (
      <div className="rounded-xl bg-[#6fdcc0] p-3 sm:p-4">

        <p className="mb-1 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-white/90">
          <ChevronRight size={12} />
          Add New Book
        </p>

        <h1 className="text-2xl font-bold text-slate-900 sm:text-4xl">
          Add New Book
        </h1>

        <p className="mb-4 text-sm text-slate-700">
          Fill in the details to add a new book to the inventory.
        </p>

        <div className="grid grid-cols-1 gap-4">

          <Card className="p-4">

            <h2 className="mb-3 text-2xl font-bold text-slate-800">
              Book Information
            </h2>

            <div className="space-y-3 text-xs">

              <label className="block">
                <p className="mb-1 font-semibold text-slate-700">
                  Book Title
                </p>
                <input
                  className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3"
                  value={addBookForm.title}
                  onChange={(e) => setAddBookForm((prev) => ({ ...prev, title: e.target.value }))}
                />
              </label>

              <label className="block">
                <p className="mb-1 font-semibold text-slate-700">
                  Author Name
                </p>
                <input
                  className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3"
                  value={addBookForm.authorName}
                  onChange={(e) => setAddBookForm((prev) => ({ ...prev, authorName: e.target.value }))}
                />
              </label>

              <label className="block">
                <p className="mb-1 font-semibold text-slate-700">
                  Category / Genre
                </p>
                <select
                  className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-slate-600"
                  value={addBookForm.category}
                  onChange={(e) => {
                    const nextCategory = e.target.value;
                    setAddBookForm((prev) => ({ ...prev, category: nextCategory }));
                    if (nextCategory !== '__new__') {
                      setNewCategoryName('');
                    }
                  }}
                >
                  <option></option>
                  {categoryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                  <option value="__new__">+ Add New Category</option>
                </select>
              </label>

              {addBookForm.category === '__new__' ? (
                <label className="block">
                  <p className="mb-1 font-semibold text-slate-700">
                    New Category Name
                  </p>
                  <input
                    className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Enter new category"
                  />
                </label>
              ) : null}

            </div>

            <h3 className="mb-3 mt-5 text-2xl font-bold text-slate-800">
              Book Details
            </h3>

            <label className="block text-xs">
              <p className="mb-1 font-semibold text-slate-700">
                Number of Copies
              </p>
              <input
                type="number"
                min={1}
                className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3"
                value={addBookForm.numberOfCopies || ''}
                onChange={(e) =>
                  setAddBookForm((prev) => ({
                    ...prev,
                    numberOfCopies: e.target.value === '' ? 0 : Number(e.target.value),
                  }))
                }
              />
            </label>

            <div className="mt-3 flex justify-end gap-2">

              <button
                className="rounded px-2 py-1 text-xs font-semibold text-slate-500"
                onClick={() => setShowAddBookPage(false)}
              >
                Cancel
              </button>

              <button
                className="rounded bg-emerald-700 px-2 py-1 text-xs font-semibold text-white"
                onClick={() => void handleSaveBook()}
              >
                Save Book
              </button>

            </div>

          </Card>

        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden">

      <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-black">
        • Book Management
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

        <h1 className="text-2xl font-bold text-slate-900 sm:text-4xl">
          Book Catalog
        </h1>

        <Button
          size="sm"
          className="bg-slate-900 hover:bg-slate-800"
          onClick={() => setShowAddBookPage(true)}
        >
          <Plus size={14} /> Add New Book
        </Button>

      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total Books" value={String(totalBooks)} icon={Book} />
        <StatCard label="Active Loans" value={String(activeLoans)} icon={BookOpen} />
        <StatCard label="Overdue Items" value={String(overdueItems)} icon={CircleAlert} />
      </div>

      <Card className="mb-4 p-3">

        <div className="flex flex-wrap items-center gap-2">

          <SearchSuggestInput
            className="min-w-full flex-1 sm:min-w-72"
            value={localSearch}
            placeholder="Search by title, author & category"
            suggestions={bookSuggestions}
            onChange={setLocalSearch}
            onEnter={() => {
              const nextQuery = localSearch.trim();
              setSubmittedSearch(nextQuery);
              void refreshPageData(nextQuery);
            }}
            onSelect={(item) => {
              setLocalSearch(item.value);
              setSubmittedSearch(item.value);
              void refreshPageData(item.value);
            }}
          />

        </div>

      </Card>

      <Card>

        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">

          <h2 className="text-2xl font-bold text-slate-800">
            Inventory List
          </h2>

          <p className="text-xs font-semibold text-slate-500">
            Displaying {bookRows.length === 0 ? 0 : startIndex + 1}-
            {Math.min(endIndex, bookRows.length)} of {bookRows.length} items
          </p>

        </div>

        <div className="sm:hidden">
          {paginatedBookRows.map((book) => (
            <div key={book.bookId} className="border-t border-slate-100 px-4 py-3">
              <div className="flex items-start gap-3">
                <img
                  src={bookCoverMap[String(book.bookId)] || '/default-book.svg'}
                  alt={book.title}
                  className="h-14 w-10 rounded object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/default-book.svg';
                  }}
                />
                <div className="min-w-0 flex-1">
                  <p className="break-words text-sm font-semibold text-slate-800">{book.title}</p>
                  <p className="break-words text-xs text-slate-500">{book.author}</p>
                  <p className="mt-2 text-xs text-slate-600">Genre: {book.genre}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                      {book.status}
                    </span>
                    <button
                      onClick={() => setBookToDelete(book)}
                      className="flex items-center gap-1 rounded bg-red-600 px-2 py-1 text-[11px] font-semibold text-white hover:bg-red-700"
                    >
                      <Trash2 size={12} />
                      Delete
                    </button>
                  </div>
                  <div className="mt-2">
                    <button
                      type="button"
                      className="text-xs font-semibold text-sky-700"
                      onClick={() => toggleBookId(book.bookId)}
                    >
                      {expandedBookIds[String(book.bookId)] ? 'Hide Book ID' : 'View Book ID'}
                    </button>
                    {expandedBookIds[String(book.bookId)] ? (
                      <p className="mt-1 break-all text-xs font-semibold text-sky-700">{book.bookId}</p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden w-full max-w-full overflow-x-auto sm:block">

          <table className="min-w-full text-xs md:text-sm">

            <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500">

              <tr>
                <th className="px-2 py-2 text-left md:px-4 md:py-3">Title & Author</th>
                <th className="px-2 py-2 text-left md:px-4 md:py-3">Genre</th>
                <th className="px-2 py-2 text-left md:px-4 md:py-3">Status</th>
                <th className="px-2 py-2 text-left md:px-4 md:py-3">Actions</th>
              </tr>

            </thead>

            <tbody>

              {paginatedBookRows.map((book) => (

                <tr key={book.bookId} className="border-t border-slate-100">

                  <td className="px-2 py-2 text-xs md:px-4 md:py-3 md:text-sm">
                    <div className="flex items-center gap-3">
                      <img
                        src={bookCoverMap[String(book.bookId)] || '/default-book.svg'}
                        alt={book.title}
                        className="h-12 w-9 rounded object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/default-book.svg';
                        }}
                      />
                      <div>
                        <p className="font-semibold text-slate-800">{book.title}</p>
                        <p className="text-[11px] text-slate-500">{book.author}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-2 py-2 text-xs text-slate-600 md:px-4 md:py-3 md:text-sm">
                    {book.genre}
                  </td>

                  <td className="px-2 py-2 text-xs md:px-4 md:py-3 md:text-sm">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                      {book.status}
                    </span>
                  </td>

                  <td className="px-2 py-2 text-xs md:px-4 md:py-3 md:text-sm">

                    <button
                      onClick={() => setBookToDelete(book)}
                      className="flex items-center gap-1 rounded bg-red-600 px-2 py-1 text-[11px] font-semibold text-white hover:bg-red-700"
                    >
                      <Trash2 size={12} />
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        <div className="flex flex-col gap-2 border-t border-slate-200 px-4 py-3 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p className="text-slate-500">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center justify-end gap-2">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>

      </Card>

      {bookToDelete && (
        <DeleteConfirmModal
          title="Delete Book?"
          message={`Are you sure you want to permanently delete "${bookToDelete.title}" from the catalog?`}
          onCancel={() => setBookToDelete(null)}
          onConfirm={handleDelete}
        />
      )}

      {deleteErrorMessage && (
        <ModalShell cardClassName="max-w-md" overlayClassName="bg-slate-900/30" zIndexClassName="z-50">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Cannot Delete Book
            </h2>
          </div>

          <div className="px-5 py-4 text-sm text-slate-700">
            {deleteErrorMessage}
          </div>

          <div className="flex justify-end border-t border-slate-200 px-5 py-4">
            <Button variant="primary" onClick={() => setDeleteErrorMessage(null)}>
              OK
            </Button>
          </div>
        </ModalShell>
      )}

    </div>
  );
}
