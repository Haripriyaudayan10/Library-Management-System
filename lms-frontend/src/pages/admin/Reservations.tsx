import { useEffect, useMemo, useState } from 'react';
import { Clock3 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { getReservations, type ReservationItem } from '../../services/reservationService';
import SearchSuggestInput, { type SearchSuggestionItem } from '../../components/common/SearchSuggestInput';
import { useDebouncedValue } from '../../lib/useDebouncedValue';
import Pagination from '../../components/common/Pagination';

interface ReservationRow {
  id: string;
  title: string;
  isbn: string;
  member: string;
  memberProfileImageUrl?: string;
  code: string;
  requested: string;
  status: string;
}

type FilterType = 'ALL' | 'WAITING' | 'CANCELLED' | 'EXPIRED';

function formatDate(value?: string): string {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

export default function Reservations() {

  const [reservations, setReservations] = useState<ReservationItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 425);
  const effectiveSearchTerm = searchTerm.trim() === '' ? '' : debouncedSearchTerm;
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedReservationIds, setExpandedReservationIds] = useState<Record<string, boolean>>({});

  const loadReservations = async () => {
    try {
      const data = await getReservations();
      setReservations(data);
    } catch (error) {
      console.error('Failed to load reservations', error);
    }
  };

  useEffect(() => {
    void loadReservations();
  }, []);

  const rows = useMemo<ReservationRow[]>(() =>
    reservations.map((reservation) => ({
      id: `RES-${reservation.reservationId}`,
      title: reservation.bookTitle ?? 'Unknown Book',
      isbn: `BOOK ID: ${reservation.bookId ?? '-'}`,
      member: reservation.userName ?? 'Member',
      memberProfileImageUrl: reservation.userProfileImageUrl,
      code: `MEM-${reservation.userId ?? '-'}`,
      requested: formatDate(reservation.reservationDate),
      status: String(reservation.status ?? 'WAITING'),
    })), [reservations]
  );

  const reservationSuggestions = useMemo<SearchSuggestionItem[]>(() => {
    const q = effectiveSearchTerm.trim().toLowerCase();
    if (!q) return [];

    return rows
      .filter(row =>
        row.member.toLowerCase().includes(q) ||
        row.title.toLowerCase().includes(q) ||
        row.code.toLowerCase().includes(q)
      )
      .slice(0, 10)
      .map(row => ({
        id: row.id,
        label: `${row.member} • ${row.title}`,
        value: row.member,
      }));
  }, [rows, effectiveSearchTerm]);

  const filteredRows = useMemo(() => {

    let result = rows;

    if (filter === 'WAITING') {
      result = result.filter(r => r.status === 'WAITING');
    }

    if (filter === 'CANCELLED') {
      result = result.filter(r => r.status === 'CANCELLED');
    }

    if (filter === 'EXPIRED') {
      result = result.filter(r => r.status === 'EXPIRED');
    }

    const q = effectiveSearchTerm.trim().toLowerCase();

    if (q) {
      result = result.filter(row =>
        row.member.toLowerCase().includes(q) ||
        row.title.toLowerCase().includes(q) ||
        row.code.toLowerCase().includes(q)
      );
    }

    return result;

  }, [rows, effectiveSearchTerm, filter]);

  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedRows = useMemo(
    () => filteredRows.slice(startIndex, endIndex),
    [filteredRows, startIndex, endIndex],
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [effectiveSearchTerm, filter]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const toggleReservationId = (id: string) => {
    setExpandedReservationIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden">

      {/* HEADER */}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-4xl">
            Reservations
          </h1>

          <p className="text-xs text-slate-600 sm:text-sm">
            Monitor and process book requests, availability dates, and pickups.
          </p>
        </div>

      </div>

      {/* STAT */}

      <div className="mb-4 max-w-full sm:max-w-md">
        <StatCard
          label="Active Reservations"
          value={String(rows.length)}
          icon={Clock3}
        />
      </div>

      <Card>

        {/* TOP BAR */}

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">

          <div>
            <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">
              Active Queue
            </h2>

            <p className="text-xs text-slate-500">
              Live tracking of all reservation states and deadlines.
            </p>
          </div>

          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">

            {/* FILTER BUTTONS */}

            <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs">

              <button
                onClick={() => setFilter('ALL')}
                className={`rounded px-2 py-1 ${
                  filter === 'ALL'
                    ? 'bg-white font-semibold text-slate-700 shadow'
                    : 'text-slate-500'
                }`}
              >
                All
              </button>

              <button
                onClick={() => setFilter('WAITING')}
                className={`rounded px-2 py-1 ${
                  filter === 'WAITING'
                    ? 'bg-white font-semibold text-slate-700 shadow'
                    : 'text-slate-500'
                }`}
              >
                Waiting
              </button>

              <button
                onClick={() => setFilter('CANCELLED')}
                className={`rounded px-2 py-1 ${
                  filter === 'CANCELLED'
                    ? 'bg-white font-semibold text-slate-700 shadow'
                    : 'text-slate-500'
                }`}
              >
                Cancelled
              </button>

              <button
                onClick={() => setFilter('EXPIRED')}
                className={`rounded px-2 py-1 ${
                  filter === 'EXPIRED'
                    ? 'bg-white font-semibold text-slate-700 shadow'
                    : 'text-slate-500'
                }`}
              >
                Expired
              </button>

            </div>

            {/* SEARCH */}

            <SearchSuggestInput
              className="w-full sm:w-[260px]"
              value={searchTerm}
              placeholder="Filter by member name..."
              suggestions={reservationSuggestions}
              onChange={setSearchTerm}
              onSelect={(item) => setSearchTerm(item.value)}
            />

          </div>

        </div>

        {/* TABLE */}

        <div className="sm:hidden">
          {paginatedRows.map((row) => (
            <div key={row.id} className="border-t border-slate-100 px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="break-words text-sm font-semibold text-slate-800">{row.title}</p>
                  <p className="text-xs text-slate-500">{row.isbn}</p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    row.status === 'EXPIRED'
                      ? 'bg-rose-100 text-rose-600'
                      : row.status === 'WAITING'
                      ? 'bg-amber-100 text-amber-700'
                      : row.status === 'CANCELLED'
                      ? 'bg-slate-200 text-slate-600'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {row.status}
                </span>
              </div>

              <div className="mt-3 flex items-center gap-2">
                {row.memberProfileImageUrl ? (
                  <img
                    src={row.memberProfileImageUrl}
                    alt={row.member}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-slate-200 to-slate-400" />
                )}
                <div className="min-w-0">
                  <p className="break-words text-sm font-semibold text-slate-700">{row.member}</p>
                  <p className="break-words text-[10px] text-slate-500">{row.code}</p>
                </div>
              </div>

              <p className="mt-2 text-xs text-slate-600">Requested: {row.requested}</p>

              <div className="mt-2">
                <button
                  type="button"
                  className="text-xs font-semibold text-sky-700"
                  onClick={() => toggleReservationId(row.id)}
                >
                  {expandedReservationIds[row.id] ? 'Hide Reservation ID' : 'View Reservation ID'}
                </button>
                {expandedReservationIds[row.id] ? (
                  <p className="mt-1 break-all text-xs font-semibold text-sky-700">{row.id}</p>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        <div className="hidden w-full overflow-x-hidden sm:block">

          <table className="w-full table-auto text-xs md:text-sm">

            <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500">

              <tr>
                <th className="px-2 py-2 text-left">ID</th>
                <th className="px-2 py-2 text-left">Book Details</th>
                <th className="px-2 py-2 text-left">Member</th>
                <th className="hidden sm:table-cell px-2 py-2 text-left">Requested</th>
                <th className="px-2 py-2 text-left">Status</th>
              </tr>

            </thead>

            <tbody>

              {paginatedRows.map(row => (

                <tr key={row.id} className="border-t border-slate-100">

                  <td className="truncate px-2 py-2 text-[11px] font-semibold text-slate-500">
                    {row.id}
                  </td>

                  <td className="px-2 py-2">

                    <p className="max-w-[120px] break-words font-semibold text-slate-800 md:max-w-[220px]">
                      {row.title}
                    </p>

                    <p className="max-w-[120px] break-words text-[11px] text-slate-500 md:max-w-[220px]">
                      {row.isbn}
                    </p>

                  </td>

                  <td className="px-2 py-2">

                    <div className="flex items-center gap-2">

                      {row.memberProfileImageUrl ? (
                        <img
                          src={row.memberProfileImageUrl}
                          alt={row.member}
                          className="h-6 w-6 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-slate-200 to-slate-400"/>
                      )}

                      <div className="min-w-0">

                        <p className="max-w-[120px] break-words font-semibold text-slate-700 md:max-w-[160px]">
                          {row.member}
                        </p>

                        <p className="max-w-[120px] break-words text-[10px] text-slate-500 md:max-w-[160px]">
                          {row.code}
                        </p>

                      </div>

                    </div>

                  </td>

                  <td className="hidden sm:table-cell px-2 py-2 text-slate-600">
                    {row.requested}
                  </td>

                  <td className="px-2 py-2">

                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        row.status === 'EXPIRED'
                          ? 'bg-rose-100 text-rose-600'
                          : row.status === 'WAITING'
                          ? 'bg-amber-100 text-amber-700'
                          : row.status === 'CANCELLED'
                          ? 'bg-slate-200 text-slate-600'
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

        {/* PAGINATION */}

        <div className="flex flex-col gap-2 border-t border-slate-200 px-4 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">

          <p>
            Showing {filteredRows.length === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, filteredRows.length)} of {filteredRows.length} reservations
          </p>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />

        </div>

      </Card>

    </div>
  );
}
