import { useState } from 'react';
import { CalendarDays, Filter, MoreVertical, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import Identity from '../../components/common/Identity';
import FineModal from './FineModal';

const rows = [
  { name: 'Arjun Mehta', id: 'LE-2022-104', total: '₹450.00', unpaid: '₹120.00', status: 'Pending' },
  { name: 'Priya Sharma', id: 'LE-2023-512', total: '₹50.00', unpaid: '₹0.00', status: '' },
  { name: 'Vikram Singh', id: 'LE-2021-089', total: '₹820.00', unpaid: '₹340.00', status: 'Pending' },
  { name: 'Sneha Kapur', id: 'LE-2022-331', total: '₹180.00', unpaid: '₹0.00', status: '' },
  { name: 'Rahul Varma', id: 'LE-2023-112', total: '₹310.00', unpaid: '₹75.00', status: 'Pending' },
];

export default function Fines() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Card>
        <div className="border-b border-slate-200 px-5 py-4">
          <h1 className="text-4xl font-bold text-slate-900">Fine Activity</h1>
        </div>

        <div className="border-b border-slate-200 px-5 py-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="relative min-w-80">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs"
                placeholder="Search member name or ID..."
              />
            </label>

            <div className="flex items-center gap-2">
              <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs">
                <button className="rounded bg-emerald-700 px-3 py-1 font-semibold text-white">All</button>
                <button className="rounded px-3 py-1 text-slate-500">Paid</button>
                <button className="rounded px-3 py-1 text-slate-500">Unpaid</button>
              </div>

              <Button variant="secondary" size="sm">
                <CalendarDays size={13} /> Date Range
              </Button>

              <Button variant="secondary" size="sm">
                <Filter size={13} />
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-2 text-left">Member Identity</th>
                <th className="px-3 py-2 text-left">Member ID</th>
                <th className="px-3 py-2 text-left">Total Amount</th>
                <th className="px-3 py-2 text-left">Unpaid Amount</th>
                <th className="px-3 py-2 text-left">Quick Actions</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    <Identity name={row.name} subtitle="Active Member" />
                  </td>

                  <td className="px-3 py-3">
                    <span className="rounded bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                      {row.id}
                    </span>
                  </td>

                  <td className="px-3 py-3 font-semibold text-slate-700">
                    {row.total}
                  </td>

                  <td className="px-3 py-3">
                    <p
                      className={`font-bold ${
                        row.unpaid === '₹0.00'
                          ? 'text-emerald-600'
                          : 'text-rose-500'
                      }`}
                    >
                      {row.unpaid}
                    </p>

                    {row.status ? (
                      <p className="text-[10px] font-semibold text-rose-500">
                        {row.status}
                      </p>
                    ) : null}
                  </td>

                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowModal(true)}
                      >
                        Edit
                      </Button>

                      <Button variant="secondary" size="sm">
                        Remind
                      </Button>

                      <MoreVertical size={13} className="text-slate-400" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {showModal && <FineModal onClose={() => setShowModal(false)} />}
    </>
  );
}