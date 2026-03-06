import { useState } from 'react';
import { ChevronRight, Filter, MoreHorizontal, Plus, Search, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { Book, BookOpen, CircleAlert } from 'lucide-react';

const books = [
  { title: 'The Midnight Library', author: 'Matt Haig', genre: 'Contemporary Fiction', status: 'Available' },
  { title: 'Project Hail Mary', author: 'Andy Weir', genre: 'Sci-Fi', status: 'Borrowed' },
  { title: 'Atomic Habits', author: 'James Clear', genre: 'Self-Help', status: 'Available' },
  { title: 'Klara and the Sun', author: 'Kazuo Ishiguro', genre: 'Literary Fiction', status: 'Available' },
  { title: 'The Seven Husbands of Evelyn Hugo', author: 'Taylor Jenkins Reid', genre: 'Historical Fiction', status: 'Reserved' },
];

export default function Books() {
  const [showAddBookPage, setShowAddBookPage] = useState(false);

  if (showAddBookPage) {
    return (
      <div className="rounded-xl bg-[#6fdcc0] p-4">
        <p className="mb-1 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-white/90">
          <ChevronRight size={12} />
          Add New Book
        </p>

        <h1 className="text-4xl font-bold text-slate-900">Add New Book</h1>
        <p className="mb-4 text-sm text-slate-700">
          Fill in the details to add a new book to the inventory.
        </p>

        <div className="grid grid-cols-[1.8fr_0.9fr] gap-4">
          <Card className="p-4">
            <h2 className="mb-3 text-2xl font-bold text-slate-800">Book Information</h2>

            <div className="space-y-3 text-xs">
              <label className="block">
                <p className="mb-1 font-semibold text-slate-700">Book Title</p>
                <input
                  className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3"
                  placeholder="e.g., The Midnight Library"
                />
              </label>

              <label className="block">
                <p className="mb-1 font-semibold text-slate-700">Author Name</p>
                <input
                  className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3"
                  placeholder="e.g., Matt Haig"
                />
              </label>

              <label className="block">
                <p className="mb-1 font-semibold text-slate-700">Category / Genre</p>
                <select className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-slate-600">
                  <option> </option>
                  <option>Fiction</option>
                  <option>Sci-Fi</option>
                  <option>Self-Help</option>
                  <option>Literary Fiction</option>
                </select>
              </label>
            </div>

            <h3 className="mb-3 mt-5 text-2xl font-bold text-slate-800">Book Details</h3>

            <label className="block text-xs">
              <p className="mb-1 font-semibold text-slate-700">Number of Copies</p>
              <input
                className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3"
                defaultValue="1"
              />
            </label>

            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                className="rounded px-2 py-1 text-xs font-semibold text-slate-500"
                onClick={() => setShowAddBookPage(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="rounded bg-emerald-700 px-2 py-1 text-xs font-semibold text-white"
                onClick={() => setShowAddBookPage(false)}
              >
                Save Book
              </button>
            </div>
          </Card>

          <Card className="h-fit border-2 border-indigo-300 p-4">
            <h3 className="mb-3 text-2xl font-bold text-slate-800">Book Preview</h3>

            <div className="space-y-2 text-xs">
              <div>
                <p className="text-slate-500">Title</p>
                <p className="font-semibold text-slate-800">Not specified</p>
              </div>

              <div>
                <p className="text-slate-500">Author</p>
                <p className="font-semibold text-slate-800">Not specified</p>
              </div>

              <div>
                <p className="text-slate-500">Genre</p>
                <p className="font-semibold text-slate-800">Not specified</p>
              </div>

              <div>
                <p className="text-slate-500">Copies</p>
                <p className="font-semibold text-slate-800">1</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-emerald-700/70">
        • Book Management
      </div>

      <div className="mb-4 flex items-start justify-between">
        <h1 className="text-4xl font-bold text-slate-900">Book Catalog</h1>

        <Button
          size="sm"
          className="bg-slate-900 hover:bg-slate-800"
          onClick={() => setShowAddBookPage(true)}
        >
          <Plus size={14} /> Add New Book
        </Button>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-4">
        <StatCard label="Total Books" value="125" icon={Book} />
        <StatCard label="Active Loans" value="12" icon={BookOpen} />
        <StatCard label="Overdue Items" value="3" icon={CircleAlert} />
      </div>

      <Card className="mb-4 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative min-w-72 flex-1">
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
          <h2 className="text-2xl font-bold text-slate-800">Inventory List</h2>
          <p className="text-xs font-semibold text-slate-500">Displaying 50 items</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2 text-left">Title & Author</th>
                <th className="px-3 py-2 text-left">Genre</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {books.map((book) => (
                <tr key={book.title} className="border-t border-slate-100">
                  <td className="px-3 py-3">
                    <p className="font-semibold text-slate-800">{book.title}</p>
                    <p className="text-[11px] text-slate-500">{book.author}</p>
                  </td>

                  <td className="px-3 py-3 text-slate-600">
                    {book.genre}
                  </td>

                  <td className="px-3 py-3">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                      {book.status}
                    </span>
                  </td>

                  <td className="px-3 py-3">
                    <button className="flex items-center gap-1 rounded bg-red-600 px-2 py-1 text-[11px] font-semibold text-white hover:bg-red-700">
                      <Trash2 size={12} />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between border-t border-slate-200 px-4 py-3 text-xs text-slate-500">
          <p>Showing 1-5 of 4,200 books</p>

          <div className="flex items-center gap-2">
            <span>Rows per page: 10</span>

            <div className="flex items-center gap-1">
              <button className="rounded border border-slate-200 px-2 py-1">1</button>
              <button className="rounded border border-slate-200 px-2 py-1">2</button>
              <button className="rounded border border-slate-200 px-2 py-1">3</button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}