import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Filter, MoreVertical } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import Identity from '../../components/common/Identity';
import FineModal from './FineModal';
import { getFines, markFinePaid, type FineItem } from '../../services/fineService';
import SearchSuggestInput, { type SearchSuggestionItem } from '../../components/common/SearchSuggestInput';

interface FineRow {
  fineId: number;
  name: string;
  id: string;
  profileImageUrl?: string;
  total: string;
  unpaid: string;
  status: string;
}

export default function Fines() {
  const [showModal, setShowModal] = useState(false);
  const [fines, setFines] = useState<FineItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const loadFines = async () => {
    try {
      const data = await getFines();
      setFines(data);
    } catch (error) {
      console.error('Failed to load fines', error);
    }
  };

  useEffect(() => {
    void loadFines();
  }, []);

  const rows = useMemo<FineRow[]>(
    () =>
      fines.map((fine) => ({
        fineId: fine.fineId,
        name: fine.loan?.user?.name ?? 'Member',
        id: fine.loan?.user?.userId ? String(fine.loan.user.userId) : '-',
        profileImageUrl: fine.loan?.user?.profileImageUrl,
        total: `₹${Number(fine.amount ?? 0).toFixed(2)}`,
        unpaid: fine.paid ? '₹0.00' : `₹${Number(fine.amount ?? 0).toFixed(2)}`,
        status: fine.paid ? '' : 'Pending',
      })),
    [fines],
  );

  const fineSuggestions = useMemo<SearchSuggestionItem[]>(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return [];
    return rows
      .filter((row) => row.name.toLowerCase().includes(q) || row.id.toLowerCase().includes(q))
      .slice(0, 10)
      .map((row) => ({
        id: String(row.fineId),
        label: `${row.name} (${row.id})`,
        value: row.name,
      }));
  }, [rows, searchTerm]);

  const filteredRows = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) => row.name.toLowerCase().includes(q) || row.id.toLowerCase().includes(q));
  }, [rows, searchTerm]);

  const handleMarkPaid = async (fineId: number) => {
    try {
      await markFinePaid(fineId);
      await loadFines();
    } catch (error) {
      console.error('Failed to mark fine as paid', error);
    }
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <Card>
        <div className="border-b border-slate-200 px-5 py-4">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-4xl">Fine Activity</h1>
        </div>

        <div className="border-b border-slate-200 px-5 py-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <SearchSuggestInput
              className="min-w-full sm:min-w-80"
              value={searchTerm}
              placeholder="Search member name or ID..."
              suggestions={fineSuggestions}
              onChange={setSearchTerm}
              onSelect={(item) => setSearchTerm(item.value)}
            />

            <div className="flex w-full flex-wrap items-center gap-2 xl:w-auto">
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

        <div className="w-full overflow-x-hidden">
          <table className="w-full table-auto text-xs md:text-sm">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-2 py-2 text-left text-xs md:px-3 md:py-2 lg:px-4 lg:py-3 md:text-sm">Member Identity</th>
                <th className="px-2 py-2 text-left text-xs md:px-3 md:py-2 lg:px-4 lg:py-3 md:text-sm">Member ID</th>
                <th className="hidden px-2 py-2 text-left text-xs sm:table-cell md:px-3 md:py-2 lg:px-4 lg:py-3 md:text-sm">Total Amount</th>
                <th className="px-2 py-2 text-left text-xs md:px-3 md:py-2 lg:px-4 lg:py-3 md:text-sm">Unpaid Amount</th>
                <th className="px-2 py-2 text-left text-xs md:px-3 md:py-2 lg:px-4 lg:py-3 md:text-sm">Quick Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.fineId} className="border-t border-slate-100">
                  <td className="px-2 py-2 text-xs md:px-3 md:py-2 lg:px-4 lg:py-3 md:text-sm">
                    <Identity name={row.name} subtitle="Active Member" imageUrl={row.profileImageUrl} />
                  </td>

                  <td className="px-2 py-2 text-xs md:px-3 md:py-2 lg:px-4 lg:py-3 md:text-sm">
                    <span className="rounded bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                      {row.id}
                    </span>
                  </td>

                  <td className="hidden px-2 py-2 text-xs font-semibold text-slate-700 sm:table-cell md:px-3 md:py-2 lg:px-4 lg:py-3 md:text-sm">
                    {row.total}
                  </td>

                  <td className="px-2 py-2 text-xs md:px-3 md:py-2 lg:px-4 lg:py-3 md:text-sm">
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

                  <td className="px-2 py-2 text-xs md:px-3 md:py-2 lg:px-4 lg:py-3 md:text-sm">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowModal(true)}
                      >
                        Edit
                      </Button>

                      <Button variant="secondary" size="sm" onClick={() => void handleMarkPaid(row.fineId)}>
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
    </div>
  );
}
