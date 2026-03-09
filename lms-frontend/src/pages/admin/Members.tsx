import { useEffect, useMemo, useState } from 'react';
import { Filter, Plus, Search, Users } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import AddMemberModal from './AddMemberModal';
import EditMemberModal from './EditMemberModal';
import { getMembers, type MemberItem } from '../../services/memberService';

interface MemberRow {
  id: string;
  name: string;
  mail: string;
  borrowed: number;
  joined: string;
}

export default function Members() {

  const [members, setMembers] = useState<MemberItem[]>([]);
  const [totalMembers, setTotalMembers] = useState(0);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [showAddMemberSlide, setShowAddMemberSlide] = useState(false);
  const [editingMember, setEditingMember] = useState<MemberRow | null>(null);

  const memberRows = useMemo<MemberRow[]>(
    () =>
      members.map((member) => ({
        id: member.userid,
        name: member.name,
        mail: member.email,
        borrowed: 0,
        joined: '-',
      })),
    [members],
  );

  const loadMembers = async (pageNo: number) => {
    try {
      const data = await getMembers(pageNo, 10);
      setMembers(data.content);
      setTotalMembers(data.totalElements);
      setTotalPages(Math.max(data.totalPages, 1));
      setPage(data.page);
    } catch (error) {
      console.error('Failed to load members', error);
    }
  };

  useEffect(() => {
    void loadMembers(0);
  }, []);

  return (
    <div className="w-full max-w-full overflow-x-hidden">

      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-4xl">Members</h1>

        <Button
          size="sm"
          className="bg-slate-900 hover:bg-slate-800"
          onClick={() => setShowAddMemberSlide(true)}
        >
          <Plus size={14} /> Add New Member
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-4 max-w-full sm:max-w-md">
        <StatCard label="Total Members" value={String(totalMembers)} icon={Users} />
      </div>

      <Card>

        {/* Search */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
          <h2 className="text-2xl font-bold text-slate-800">Patron Records</h2>

          <div className="flex items-center gap-2">
            <label className="relative w-full sm:w-auto">
              <Search
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={14}
              />
              <input
                className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs"
                placeholder="Search by ID or name..."
              />
            </label>

            <Button variant="secondary" size="sm">
              <Filter size={13} />
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-hidden">
          <table className="w-full table-auto text-xs md:text-sm">

            <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-2 py-2 text-left text-xs md:px-3 md:py-2 lg:px-4 lg:py-3 md:text-sm">Member ID</th>
                <th className="hidden w-6 px-2 py-2 text-left text-xs md:table-cell md:px-3 md:py-2 lg:px-4 lg:py-3 md:text-sm">↕</th>
                <th className="px-2 py-2 text-left text-xs md:px-3 md:py-2 lg:px-4 lg:py-3 md:text-sm">Member Information</th>
                <th className="px-2 py-2 text-left text-xs md:px-3 md:py-2 lg:px-4 lg:py-3 md:text-sm">Borrowed</th>
                <th className="hidden px-2 py-2 text-left text-xs sm:table-cell md:px-3 md:py-2 lg:px-4 lg:py-3 md:text-sm">Joined On</th>
                <th className="px-2 py-2 text-left text-xs md:px-3 md:py-2 lg:px-4 lg:py-3 md:text-sm">Edit</th>
              </tr>
            </thead>

            <tbody>
              {memberRows.map((member) => (
                <tr key={member.id} className="border-t border-slate-100">

                  <td className="px-2 py-2 text-xs font-semibold text-sky-700 md:px-3 md:py-2 lg:px-4 lg:py-3 md:text-sm">
                    {member.id}
                  </td>

                  <td className="hidden px-2 py-2 text-xs md:table-cell md:px-3 md:py-2 lg:px-4 lg:py-3 md:text-sm"></td>

                  <td className="px-2 py-2 text-xs md:px-3 md:py-2 lg:px-4 lg:py-3 md:text-sm">
                    <div className="flex items-center gap-2">

                      <div className="h-7 w-7 rounded-full bg-gradient-to-br from-slate-200 to-slate-400" />

                      <div className="min-w-0">
                        <p className="max-w-[120px] break-words whitespace-normal font-semibold text-slate-800 md:max-w-[180px]">
                          {member.name}
                        </p>

                        <p className="max-w-[120px] break-words whitespace-normal text-[11px] text-slate-500 md:max-w-[180px]">
                          {member.mail}
                        </p>
                      </div>

                    </div>
                  </td>

                  <td className="px-2 py-2 text-xs md:px-3 md:py-2 lg:px-4 lg:py-3 md:text-sm">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5">
                      {member.borrowed}
                    </span>
                  </td>

                  <td className="hidden px-2 py-2 text-xs text-slate-600 sm:table-cell md:px-3 md:py-2 lg:px-4 lg:py-3 md:text-sm">
                    {member.joined}
                  </td>

                  {/* Edit Button */}
                  <td className="px-2 py-2 text-xs md:px-3 md:py-2 lg:px-4 lg:py-3 md:text-sm">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setEditingMember(member)}
                    >
                      Edit
                    </Button>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-2 border-t border-slate-200 px-4 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">

          <p>Showing {memberRows.length} of {totalMembers} members</p>

          <div className="flex items-center gap-1">

            <button
              className="rounded border border-slate-200 px-2 py-1"
              disabled={page === 0}
              onClick={() => void loadMembers(Math.max(page - 1, 0))}
            >
              Previous
            </button>

            <button className="rounded bg-blue-700 px-2 py-1 text-white">
              {page + 1}
            </button>

            <button
              className="rounded border border-slate-200 px-2 py-1"
              disabled={page + 1 >= totalPages}
              onClick={() => void loadMembers(Math.min(page + 1, totalPages - 1))}
            >
              Next
            </button>

          </div>

        </div>

      </Card>

      {/* Add Member Modal */}
      {showAddMemberSlide && (
        <AddMemberModal onClose={() => {
          setShowAddMemberSlide(false);
          void loadMembers(page);
        }} />
      )}

      {/* Edit Member Modal */}
      {editingMember && (
        <EditMemberModal
          member={editingMember}
          onClose={() => {
            setEditingMember(null);
            void loadMembers(page);
          }}
        />
      )}

    </div>
  );
}
