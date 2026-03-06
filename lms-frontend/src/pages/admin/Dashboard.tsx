import { CircleDollarSign, Clock3 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';

const activityRows = [
  { name: 'Haripriya Udayan', book: 'A Tale of Two Cities', status: 'Borrowed', time: '2 mins ago' },
  { name: 'Niranjan Krishna', book: 'The Hunger Games', status: 'Returned', time: '15 mins ago' },
  { name: 'Akash', book: 'The Alchemist', status: 'Returned', time: '20 mins ago' },
  { name: 'Pranav S', book: 'Me Before You', status: 'Returned', time: '35 mins ago' },
  { name: 'Sithara', book: 'Gone Girl', status: 'Reserved', time: '45 mins ago' },
  { name: 'Anand', book: 'Project Hail Mary', status: 'Overdue', time: '1 hours ago' },
  { name: 'James', book: 'The Adventures of Sherlock Holmes', status: 'Overdue', time: '2 hours ago' },
  { name: 'Anjali', book: 'Life of Pi', status: 'Overdue', time: '3 hours ago' },
  { name: 'overdue', book: 'The Kite Runner', status: 'Overdue', time: '4 hours ago' },
];

const donut = {
  background:
    'conic-gradient(#e16a4f 0 25%, #239e90 25% 52%, #223645 52% 78%, #d7b44a 78% 100%)',
};

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-slate-900">Operational Overview</h1>
      <p className="mb-4 text-sm text-slate-700">Welcome back. Here's what's happening in your library today.</p>

      <div className="mb-5 max-w-[320px]">
        <StatCard label="Total Revenue" value="Rs.100" icon={CircleDollarSign} />
      </div>

      <div className="grid grid-cols-[1.7fr_0.9fr] gap-4">
        <Card className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Recent Activity</h2>
              <p className="text-xs text-slate-500">Latest transactions and member actions</p>
            </div>
        
          </div>

          <div>
            {activityRows.map((row) => (
              <div key={`${row.name}-${row.book}`} className="flex items-center justify-between border-t border-slate-100 py-3">
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
                      row.status === 'Overdue'
                        ? 'bg-rose-100 text-rose-600'
                        : row.status === 'Reserved'
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
