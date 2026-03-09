import { useEffect, useMemo, useState } from 'react';
import { BookOpen, Clock3, Filter, Plus } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import NewLoanModal from './NewLoanModal';
import { getLoans, reissueLoan, returnLoan, type LoanItem } from '../../services/loanService';
import SearchSuggestInput, { type SearchSuggestionItem } from '../../components/common/SearchSuggestInput';

interface LoanRow {
  id: number;
  name: string;
  mail: string;
  profileImageUrl?: string;
  title: string;
  sub: string;
  loanDate: string;
  dueDate: string;
  status: string;
}

function formatDate(value?: string): string {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

export default function Loans() {
  const [showNewLoanSlide, setShowNewLoanSlide] = useState(false);
  const [loans, setLoans] = useState<LoanItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const loadLoans = async () => {
    try {
      const data = await getLoans();
      setLoans(data);
    } catch (error) {
      console.error('Failed to load loans', error);
    }
  };

  useEffect(() => {
    void loadLoans();
  }, []);

  const rows = useMemo<LoanRow[]>(
    () =>
      loans.map((loan) => ({
        id: loan.loanId,
        name: loan.user?.name ?? 'Member',
        mail: loan.user?.email ?? '-',
        profileImageUrl: loan.user?.profileImageUrl,
        title: loan.copy?.book?.title ?? 'Unknown Book',
        sub: `BK-${loan.copy?.book?.bookId ?? '-'} • ${loan.copy?.book?.authorName ?? '-'}`,
        loanDate: formatDate(loan.issueDate),
        dueDate: formatDate(loan.dueDate),
        status: String(loan.status ?? 'ACTIVE'),
      })),
    [loans],
  );

  const loanSuggestions = useMemo<SearchSuggestionItem[]>(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return [];
    return rows
      .filter((row) =>
        row.name.toLowerCase().includes(q) ||
        row.title.toLowerCase().includes(q) ||
        row.mail.toLowerCase().includes(q),
      )
      .slice(0, 10)
      .map((row) => ({
        id: String(row.id),
        label: `${row.name} • ${row.title}`,
        value: row.name,
      }));
  }, [rows, searchTerm]);

  const filteredRows = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) =>
      row.name.toLowerCase().includes(q) ||
      row.title.toLowerCase().includes(q) ||
      row.mail.toLowerCase().includes(q),
    );
  }, [rows, searchTerm]);

  const activeLoans = rows.filter((row) => row.status === 'ACTIVE').length;
  const overdueItems = rows.filter((row) => row.status === 'ACTIVE' && row.dueDate !== '-' && new Date(row.dueDate).getTime() < Date.now()).length;
  const dueToday = rows.filter((row) => {
    if (row.dueDate === '-') return false;
    const due = new Date(row.dueDate);
    const now = new Date();
    return due.getFullYear() === now.getFullYear() && due.getMonth() === now.getMonth() && due.getDate() === now.getDate();
  }).length;

  const handleReturn = async (loanId: number) => {
    try {
      await returnLoan(loanId);
      await loadLoans();
    } catch (error) {
      console.error('Failed to return loan', error);
    }
  };

  const handleReissue = async (loanId: number) => {
    const loan = loans.find((item) => item.loanId === loanId);
    if (!loan) return;

    const today = new Date();
    const due = loan.dueDate ? new Date(loan.dueDate) : new Date();
    const base =
      Number.isNaN(due.getTime()) || due.getTime() < today.getTime()
        ? today
        : due;
    const nextDue = new Date(base);
    nextDue.setDate(nextDue.getDate() + 14);
    const newDueDate = nextDue.toISOString().slice(0, 10);

    try {
      await reissueLoan(loanId, newDueDate);
      await loadLoans();
    } catch (error) {
      console.error('Failed to reissue loan', error);
    }
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden">
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
        <StatCard label="Active Loans" value={String(activeLoans)} icon={BookOpen} />
        <StatCard label="Overdue Items" value={String(overdueItems)} icon={Clock3} />
        <StatCard label="Due Today" value={String(dueToday)} icon={Clock3} />
      </div>

      <Card className="mb-4 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <SearchSuggestInput
            className="min-w-full flex-1 sm:min-w-72"
            value={searchTerm}
            placeholder="Search by book title or borrower name..."
            suggestions={loanSuggestions}
            onChange={setSearchTerm}
            onSelect={(item) => setSearchTerm(item.value)}
          />

          <Button variant="secondary" size="sm">
            <Filter size={13} /> Filter
          </Button>
        </div>
      </Card>

      <Card>
        <div className="w-full overflow-x-hidden">
          <table className="w-full table-auto text-xs md:text-sm">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-2 py-2 text-left text-xs md:px-3 md:py-2 lg:px-4 lg:py-3 md:text-sm">Borrower ↕</th>
                <th className="px-2 py-2 text-left text-xs md:px-3 md:py-2 lg:px-4 lg:py-3 md:text-sm">Book Details ↕</th>
                <th className="hidden px-2 py-2 text-left text-xs sm:table-cell md:px-3 md:py-2 lg:px-4 lg:py-3 md:text-sm">Loan Date</th>
                <th className="hidden px-2 py-2 text-left text-xs sm:table-cell md:px-3 md:py-2 lg:px-4 lg:py-3 md:text-sm">Due Date ↕</th>
                <th className="px-2 py-2 text-left text-xs md:px-3 md:py-2 lg:px-4 lg:py-3 md:text-sm">Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.id} className="border-t border-slate-100">
                  <td className="px-2 py-2 text-xs md:px-3 md:py-2 lg:px-4 lg:py-3 md:text-sm">
                    <div className="flex items-center gap-2">
                      {row.profileImageUrl ? (
                        <img
                          src={row.profileImageUrl}
                          alt={row.name}
                          className="h-7 w-7 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-slate-200 to-slate-400" />
                      )}
                      <div className="min-w-0">
                        <p className="max-w-[120px] break-words whitespace-normal font-semibold text-slate-800 md:max-w-[160px]">{row.name}</p>
                        <p className="max-w-[120px] break-words whitespace-normal text-[11px] text-slate-500 md:max-w-[160px]">{row.mail}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-2 py-2 text-xs md:px-3 md:py-2 lg:px-4 lg:py-3 md:text-sm">
                    <p className="max-w-[120px] break-words whitespace-normal font-semibold text-slate-800 md:max-w-[220px]">{row.title}</p>
                    <p className="max-w-[120px] break-words whitespace-normal text-[11px] text-slate-500 md:max-w-[220px]">{row.sub}</p>
                  </td>

                  <td className="hidden px-2 py-2 text-xs text-slate-600 sm:table-cell md:px-3 md:py-2 lg:px-4 lg:py-3 md:text-sm">{row.loanDate}</td>

                  <td
                    className={`hidden px-2 py-2 text-xs font-semibold sm:table-cell md:px-3 md:py-2 lg:px-4 lg:py-3 md:text-sm ${
                      row.status === 'OVERDUE'
                        ? 'text-rose-500'
                        : 'text-slate-700'
                    }`}
                  >
                    {row.dueDate}
                  </td>

                  <td className="px-2 py-2 text-xs md:px-3 md:py-2 lg:px-4 lg:py-3 md:text-sm">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        row.status === 'OVERDUE'
                          ? 'bg-rose-100 text-rose-600'
                          : row.status === 'RETURNED'
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {row.status}
                    </span>
                    {row.status === 'ACTIVE' || row.status === 'REISSUED' ? (
                      <>
                        <button
                          className="ml-2 rounded border border-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-50"
                          onClick={() => void handleReissue(row.id)}
                        >
                          Reissue
                        </button>
                        <button
                          className="ml-2 rounded border border-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-50"
                          onClick={() => void handleReturn(row.id)}
                        >
                          Return
                        </button>
                      </>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-2 border-t border-slate-200 px-4 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Showing 1-{filteredRows.length} records</p>

          <div className="flex items-center gap-1">
            <button className="rounded border border-slate-200 px-2 py-1">
              Previous
            </button>
            <button className="rounded bg-blue-700 px-2 py-1 text-white">
              1
            </button>
            <button className="rounded border border-slate-200 px-2 py-1">
              Next
            </button>
          </div>
        </div>
      </Card>

      {showNewLoanSlide ? (
        <NewLoanModal
          onClose={() => {
            setShowNewLoanSlide(false);
            void loadLoans();
          }}
          onCreated={() => {
            void loadLoans();
          }}
        />
      ) : null}
    </div>
  );
}
