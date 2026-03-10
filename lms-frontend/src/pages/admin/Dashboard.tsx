import { useEffect, useMemo, useState } from 'react';
import { CircleDollarSign, Clock3 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { getAdminDashboard, type AdminDashboardStats } from '../../services/dashboardService';
import api from '../../services/api';
import { getFines, type FineItem } from '../../services/fineService';

interface ActivityRow {
  name: string;
  book: string;
  status: string;
  time: string;
  profileImageUrl?: string;
}

interface LoanItem {
  issueDate?: string;
  status?: string;
  user?: { name?: string; profileImageUrl?: string };
  copy?: { book?: { title?: string } };
}

interface DashboardBook {
  category?: string | { name?: string };
}

interface ChartDatum {
  name: string;
  value: number;
  color: string;
}

const CHART_COLORS = ['#e16a4f', '#239e90', '#223645', '#d7b44a', '#7c8aa0', '#67b99a'];

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
  const [books, setBooks] = useState<DashboardBook[]>([]);
  const [fines, setFines] = useState<FineItem[]>([]);
  const [chartData, setChartData] = useState<ChartDatum[]>([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [dashboardData, loansResponse, booksResponse, finesData] = await Promise.all([
          getAdminDashboard(),
          api.get('/api/admin/loans'),
          api.get('/api/admin/books'),
          getFines(),
        ]);

        setStats(dashboardData);

        const loansData = Array.isArray(loansResponse.data)
          ? loansResponse.data
          : loansResponse.data?.content || [];

        const booksData = Array.isArray(booksResponse.data)
          ? booksResponse.data
          : booksResponse.data?.content || [];

        setLoans(loansData);
        setBooks(booksData);
        setFines(finesData);
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      }
    };

    loadDashboard();
  }, []);

  useEffect(() => {
    const categoryCount = books.reduce<Record<string, number>>((acc, book) => {
      const categoryValue =
        typeof book.category === 'string'
          ? book.category
          : book.category?.name;

      const categoryName = (categoryValue || 'Uncategorized').trim();

      acc[categoryName] = (acc[categoryName] || 0) + 1;

      return acc;
    }, {});

    const nextChartData = Object.entries(categoryCount).map(([name, value], index) => ({
      name,
      value,
      color: CHART_COLORS[index % CHART_COLORS.length],
    }));

    setChartData(nextChartData);
  }, [books]);

  const activityRows = useMemo<ActivityRow[]>(
    () =>
      [...loans]
        .sort((a, b) => {
          const aTime = a.issueDate ? new Date(a.issueDate).getTime() : 0;
          const bTime = b.issueDate ? new Date(b.issueDate).getTime() : 0;
          return bTime - aTime;
        })
        .slice(0, 5)
        .map((loan) => ({
          name: loan.user?.name ?? 'Member',
          book: loan.copy?.book?.title ?? 'Book',
          status: String(loan.status ?? 'ACTIVE'),
          time: formatDate(loan.issueDate),
          profileImageUrl: loan.user?.profileImageUrl,
        })),
    [loans],
  );

  const donut = useMemo(() => {
    if (!chartData.length) {
      return { background: 'conic-gradient(#e2e8f0 0 100%)' };
    }

    const total = chartData.reduce((sum, item) => sum + item.value, 0) || 1;

    let current = 0;

    const segments = chartData
      .map((item) => {
        const start = current;
        current += (item.value / total) * 100;
        return `${item.color} ${start}% ${current}%`;
      })
      .join(', ');

    return { background: `conic-gradient(${segments})` };
  }, [chartData]);

  const totalRevenue = useMemo(
    () =>
      fines.reduce((sum, fine) => (fine.paid ? sum + Number(fine.amount ?? 0) : sum), 0),
    [fines],
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 sm:text-4xl">
        Operational Overview
      </h1>

      <p className="mb-4 text-sm text-slate-700">
        Welcome back. Here's what's happening in your library today.
      </p>

      <div className="mb-5 max-w-[320px]">
        <StatCard
          label="Total Revenue"
          value={`Rs.${totalRevenue.toFixed(2)}`}
          icon={CircleDollarSign}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.7fr_0.9fr]">
        <Card className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">
                Recent Activity
              </h2>
              <p className="text-xs text-slate-500">
                Latest transactions and member actions
              </p>
            </div>
          </div>

          <div>
            {activityRows.map((row) => (
              <div
                key={`${row.name}-${row.book}-${row.time}`}
                className="flex items-center justify-between border-t border-slate-100 py-3"
              >
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

                  <div>
                    <p className="text-xs font-semibold text-slate-700">
                      {row.name} borrowed
                    </p>

                    <p className="text-xs font-bold text-sky-700">
                      {row.book}
                    </p>
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
          <h3 className="text-2xl font-bold text-slate-800">
            Catalog Breakdown
          </h3>

          <p className="mb-4 text-xs text-slate-500">
            Book distribution by primary genre
          </p>

          <div
            className="mx-auto h-36 w-36 rounded-full"
            style={donut}
          >
            <div className="m-auto h-20 w-20 translate-y-8 rounded-full bg-white" />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-slate-600">
            {chartData.map((item) => (
              <p key={item.name} className="inline-flex items-center gap-1">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                {item.name}
              </p>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
