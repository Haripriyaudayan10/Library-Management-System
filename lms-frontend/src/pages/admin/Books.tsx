import { useEffect, useMemo, useState } from 'react';
import {
  ChevronRight,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Book,
  BookOpen,
  CircleAlert
} from 'lucide-react';

import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal';
import { deleteBook, getBooks, type BookItem } from '../../services/bookService';
import { getLoans } from '../../services/loanService';

interface BookRow {
  bookId: number;
  title: string;
  author: string;
  genre: string;
  status: string;
}

export default function Books() {

  const [books, setBooks] = useState<BookItem[]>([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [activeLoans, setActiveLoans] = useState(0);
  const [overdueItems, setOverdueItems] = useState(0);
  const [showAddBookPage, setShowAddBookPage] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<BookRow | null>(null);

  const bookRows = useMemo<BookRow[]>(
    () =>
      books.map((book) => ({
        bookId: book.bookId,
        title: book.title,
        author: book.authorName,
        genre: book.category?.name ?? 'General',
        status: 'Available',
      })),
    [books],
  );

  const loadBooks = async () => {
    try {
      const [bookPage, loans] = await Promise.all([getBooks(0, 50), getLoans()]);
      setBooks(bookPage.content);
      setTotalBooks(bookPage.totalElements);
      setActiveLoans(loans.filter((loan) => String(loan.status).toUpperCase() === 'ACTIVE').length);
      setOverdueItems(
        loans.filter((loan) => {
          if (String(loan.status).toUpperCase() !== 'ACTIVE' || !loan.dueDate) return false;
          return new Date(loan.dueDate).getTime() < Date.now();
        }).length,
      );
    } catch (error) {
      console.error('Failed to load books', error);
    }
  };

  useEffect(() => {
    void loadBooks();
  }, []);

  const handleDelete = async () => {
    if (!bookToDelete) return;

    try {
      await deleteBook(bookToDelete.bookId);
      await loadBooks();
    } catch (error) {
      console.error('Failed to delete book', error);
    } finally {
      setBookToDelete(null);
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
                <input className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3" />
              </label>

              <label className="block">
                <p className="mb-1 font-semibold text-slate-700">
                  Author Name
                </p>
                <input className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3" />
              </label>

              <label className="block">
                <p className="mb-1 font-semibold text-slate-700">
                  Category / Genre
                </p>
                <select className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-slate-600">
                  <option></option>
                  <option>Fiction</option>
                  <option>Sci-Fi</option>
                  <option>Self-Help</option>
                  <option>Literary Fiction</option>
                </select>
              </label>

            </div>

            <h3 className="mb-3 mt-5 text-2xl font-bold text-slate-800">
              Book Details
            </h3>

            <label className="block text-xs">
              <p className="mb-1 font-semibold text-slate-700">
                Number of Copies
              </p>
              <input
                className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3"
                defaultValue="1"
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
                onClick={() => setShowAddBookPage(false)}
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

      <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-emerald-700/70">
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

          <label className="relative min-w-full flex-1 sm:min-w-72">

            <Search
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              size={14}
            />

            <input
              className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs"
              placeholder="Search by title, author & category"
            />

          </label>

          <Button variant="secondary" size="sm">
            <Filter size={13} />
          </Button>

          <Button variant="secondary" size="sm">Fiction</Button>
          <Button variant="secondary" size="sm">Sci-Fi</Button>
          <Button variant="secondary" size="sm">+3 More</Button>

          <Button variant="ghost" size="sm">
            <MoreHorizontal size={13} />
          </Button>

        </div>

      </Card>

      <Card>

        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">

          <h2 className="text-2xl font-bold text-slate-800">
            Inventory List
          </h2>

          <p className="text-xs font-semibold text-slate-500">
            Displaying {bookRows.length} items
          </p>

        </div>

        <div className="w-full max-w-full overflow-x-auto">

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

              {bookRows.map((book) => (

                <tr key={book.bookId} className="border-t border-slate-100">

                  <td className="px-2 py-2 text-xs md:px-4 md:py-3 md:text-sm">
                    <p className="font-semibold text-slate-800">{book.title}</p>
                    <p className="text-[11px] text-slate-500">{book.author}</p>
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

      </Card>

      {bookToDelete && (
        <DeleteConfirmModal
          title="Delete Book?"
          message={`Are you sure you want to permanently delete "${bookToDelete.title}" from the catalog?`}
          onCancel={() => setBookToDelete(null)}
          onConfirm={handleDelete}
        />
      )}

    </div>
  );
}
