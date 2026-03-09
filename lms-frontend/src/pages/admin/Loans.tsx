import { useState } from 'react';
import { BookOpen, Clock3, Filter, Plus, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import NewLoanModal from './NewLoanModal';

const rows = [
  {
    name: 'Marcus Aurelius',
    mail: 'm.aurelius@stoic.edu',
    title: 'Meditations: A New Translation',
    sub: 'BK-001 • Marcus Aurelius',
    loanDate: 'Oct 12, 2023',
    dueDate: 'Oct 26, 2023',
    status: 'Returned',
  },
  {
    name: 'Elena Rodriguez',
    mail: 'elena.r@techmail.com',
    title: 'The Design of Everyday Things',
    sub: 'BK-442 • Don Norman',
    loanDate: 'Nov 02, 2023',
    dueDate: 'Nov 16, 2023',
    status: 'Overdue',
  },
  {
    name: 'James Wilson',
    mail: 'j.wilson@corp.com',
    title: 'Clean Code',
    sub: 'BK-109 • Robert C. Martin',
    loanDate: 'Nov 05, 2023',
    dueDate: 'Nov 19, 2023',
    status: 'On Time',
  },
  {
    name: 'Sarah Chen',
    mail: 'schen@university.edu',
    title: 'The Pragmatic Programmer',
    sub: 'BK-882 • Andrew Hunt',
    loanDate: 'Oct 30, 2023',
    dueDate: 'Nov 13, 2023',
    status: 'On Time',
  },
  {
    name: 'Robert Fox',
    mail: 'robert.fox@design.io',
    title: 'Zero to One',
    sub: 'BK-221 • Peter Thiel',
    loanDate: 'Nov 10, 2023',
    dueDate: 'Nov 24, 2023',
    status: 'On Time',
  },
];

export default function Loans() {
  const [showNewLoanSlide, setShowNewLoanSlide] = useState(false);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-4xl">Loan Management</h1>
          <p className="text-sm text-slate-700">
            Track book circulation and manage returns across the library.
          </p>
        </div>

        <Button
          size="sm"
          className="bg-slate-900 hover:bg-slate-800"
          onClick={() => setShowNewLoanSlide(true)}
        >
          <Plus size={14} /> New Record
        </Button>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active Loans" value="12" icon={BookOpen} />
        <StatCard label="Overdue Items" value="2" icon={Clock3} />
        <StatCard label="Due Today" value="1" icon={Clock3} />
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
              placeholder="Search by book title or borrower name..."
            />
          </label>

          <Button variant="secondary" size="sm">
            <Filter size={13} /> Filter
          </Button>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-xs">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-2 text-left">Borrower ↕</th>
                <th className="px-3 py-2 text-left">Book Details ↕</th>
                <th className="px-3 py-2 text-left">Loan Date</th>
                <th className="px-3 py-2 text-left">Due Date ↕</th>
                <th className="px-3 py-2 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr key={row.name} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-gradient-to-br from-slate-200 to-slate-400" />
                      <div>
                        <p className="font-semibold text-slate-800">{row.name}</p>
                        <p className="text-[11px] text-slate-500">{row.mail}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-3 py-3">
                    <p className="font-semibold text-slate-800">{row.title}</p>
                    <p className="text-[11px] text-slate-500">{row.sub}</p>
                  </td>

                  <td className="px-3 py-3 text-slate-600">{row.loanDate}</td>

                  <td
                    className={`px-3 py-3 font-semibold ${
                      row.status === 'Overdue'
                        ? 'text-rose-500'
                        : 'text-slate-700'
                    }`}
                  >
                    {row.dueDate}
                  </td>

                  <td className="px-3 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        row.status === 'Overdue'
                          ? 'bg-rose-100 text-rose-600'
                          : row.status === 'Returned'
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-2 border-t border-slate-200 px-4 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Showing 1-5 of 1,284 records</p>

          <div className="flex items-center gap-1">
            <button className="rounded border border-slate-200 px-2 py-1">
              Previous
            </button>
            <button className="rounded bg-blue-700 px-2 py-1 text-white">
              1
            </button>
            <button className="rounded border border-slate-200 px-2 py-1">
              2
            </button>
            <button className="rounded border border-slate-200 px-2 py-1">
              3
            </button>
            <span className="px-1">...</span>
            <button className="rounded border border-slate-200 px-2 py-1">
              42
            </button>
            <button className="rounded border border-slate-200 px-2 py-1">
              Next
            </button>
          </div>
        </div>
      </Card>

      {showNewLoanSlide ? (
        <NewLoanModal onClose={() => setShowNewLoanSlide(false)} />
      ) : null}
    </div>
  );
}
