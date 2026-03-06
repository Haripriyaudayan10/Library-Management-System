import { Clock3, Filter } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';

const rows = [
  { id: 'RES-8821', title: 'The Great Gatsby', isbn: 'ISBN: 978-0743273565', member: 'Marcus Aurelius', code: 'MEM-4002', requested: '2024-05-10', eta: '2024-05-15', status: 'Available' },
  { id: 'RES-8825', title: 'Advanced Quantum Physics', isbn: 'ISBN: 978-3110531534', member: 'Sarah Jenkins', code: 'MEM-9128', requested: '2024-05-12', eta: '2024-05-14', status: 'Pending' },
  { id: 'RES-8830', title: 'Atomic Habits', isbn: 'ISBN: 978-0735211292', member: 'David Chen', code: 'MEM-2210', requested: '2024-05-08', eta: '2024-05-11', status: 'Overdue' },
  { id: 'RES-8834', title: 'Foundation and Empire', isbn: 'ISBN: 978-0553293371', member: 'Elena Rodriguez', code: 'MEM-7754', requested: '2024-05-14', eta: '2024-05-20', status: 'In Transit' },
  { id: 'RES-8842', title: 'Clean Code', isbn: 'ISBN: 978-0132350884', member: 'Robert Martin', code: 'MEM-1010', requested: '2024-05-13', eta: '2024-05-16', status: 'Pending' },
];

export default function Reservations() {
  return (
    <div>
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Reservations</h1>
          <p className="text-sm text-slate-700">
            Monitor and process book requests, availability dates, and pickups.
          </p>
        </div>
      </div>

      <div className="mb-4 max-w-[280px]">
        <StatCard label="Active Reservations" value="124" icon={Clock3} />
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Active Queue</h2>
            <p className="text-xs text-slate-500">
              Live tracking of all reservation states and deadlines.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs">
              <button className="rounded px-2 py-1 font-semibold text-slate-700">All</button>
              <button className="rounded px-2 py-1 text-slate-500">Ready</button>
              <button className="rounded px-2 py-1 text-slate-500">Pending</button>
              <button className="rounded px-2 py-1 text-slate-500">Overdue</button>
            </div>

            <label className="relative">
              <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
              <input
                className="h-8 rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs"
                placeholder="Filter by member name..."
              />
            </label>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-3 py-2 text-left">Book Details</th>
                <th className="px-3 py-2 text-left">Member</th>
                <th className="px-3 py-2 text-left">Requested</th>
                <th className="px-3 py-2 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 text-[11px] font-semibold text-slate-500">{row.id}</td>

                  <td className="px-3 py-3">
                    <p className="font-semibold text-slate-800">{row.title}</p>
                    <p className="text-[11px] text-slate-500">{row.isbn}</p>
                  </td>

                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-gradient-to-br from-slate-200 to-slate-400" />
                      <div>
                        <p className="font-semibold text-slate-700">{row.member}</p>
                        <p className="text-[10px] text-slate-500">{row.code}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-3 py-3 text-slate-600">{row.requested}</td>

                  <td className="px-3 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        row.status === 'Overdue'
                          ? 'bg-rose-100 text-rose-600'
                          : row.status === 'Available'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-700'
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

        <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-xs text-slate-500">
          <p>Showing 5 of 124 reservations</p>

          <div className="flex items-center gap-1">
            <button className="rounded border border-slate-200 px-2 py-1">Previous</button>
            <button className="rounded border border-slate-200 px-2 py-1">1</button>
            <button className="rounded border border-slate-200 px-2 py-1">2</button>
            <button className="rounded border border-slate-200 px-2 py-1">3</button>
            <button className="rounded border border-slate-200 px-2 py-1">Next</button>
          </div>
        </div>
      </Card>
    </div>
  );
}