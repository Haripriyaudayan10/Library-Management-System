import { useEffect, useMemo, useState } from 'react';
import { CircleDollarSign, Clock3 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { getAdminDashboard, type AdminDashboardStats } from '../../services/dashboardService';
import { getLoans, type LoanItem } from '../../services/loanService';

interface ActivityRow {
  name: string;
  book: string;
  status: string;
  time: string;
}

const donut = {
  background:
    'conic-gradient(#e16a4f 0 25%, #239e90 25% 52%, #223645 52% 78%, #d7b44a 78% 100%)',
};

function formatDate(value?: string): string {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

export default function Dashboard() {
  const [stats, setStats] = useState<AdminDashboardStats>({
    totalBooks: 0,
    totalCopies: 0,
    availableCopies: 0,
    totalMembers: 0,
    activeLoans: 0,
    waitingReservations: 0,
  });
  const [loans, setLoans] = useState<LoanItem[]>([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [dashboardData, loansData] = await Promise.all([getAdminDashboard(), getLoans()]);
        setStats(dashboardData);
        setLoans(loansData);
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      }
    };

    void loadDashboard();
  }, []);

  const activityRows = useMemo<ActivityRow[]>(
    () =>
      loans.slice(0, 9).map((loan) => ({
        name: loan.user?.name ?? 'Member',
        book: loan.copy?.book?.title ?? 'Book',
        status: String(loan.status ?? 'ACTIVE'),
        time: formatDate(loan.issueDate),
      })),
    [loans],
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 sm:text-4xl">Operational Overview</h1>
      <p className="mb-4 text-sm text-slate-700">Welcome back. Here's what's happening in your library today.</p>

      <div className="mb-5 max-w-[320px]">
        <StatCard label="Total Revenue" value={`Rs.${stats.totalBooks}`} icon={CircleDollarSign} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.7fr_0.9fr]">
        <Card className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">Recent Activity</h2>
              <p className="text-xs text-slate-500">Latest transactions and member actions</p>
            </div>
          </div>

          <div>
            {activityRows.map((row) => (
              <div key={`${row.name}-${row.book}-${row.time}`} className="flex items-center justify-between border-t border-slate-100 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-slate-200 to-slate-400" />
                  <div>
                    <p className="text-xs font-semibold text-slate-700">{row.name} borrowed</p>
                    <p className="text-xs font-bold text-sky-700">{row.book}</p>
                  </div>
                </div>
                <div className="text-right text-[10px]">
                  <span
                    className={`rounded-full px-2 py-0.5 font-semibold ${
                      row.status === 'OVERDUE'
                        ? 'bg-rose-100 text-rose-600'
                        : row.status === 'RETURNED'
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {row.status}
                  </span>
                  <p className="mt-1 inline-flex items-center gap-1 text-slate-400">
                    <Clock3 size={10} />
                    {row.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="my-auto p-5">
          <h3 className="text-2xl font-bold text-slate-800">Catalog Breakdown</h3>
          <p className="mb-4 text-xs text-slate-500">Book distribution by primary genre</p>

          <div className="mx-auto h-36 w-36 rounded-full" style={donut}>
            <div className="m-auto h-20 w-20 translate-y-8 rounded-full bg-white" />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-slate-600">
            <p className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#e16a4f]" />Fiction</p>
            <p className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#239e90]" />Science</p>
            <p className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#223645]" />History</p>
            <p className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#d7b44a]" />Arts</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
