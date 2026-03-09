import { useEffect, useMemo, useState } from 'react';
import { Filter, Plus, Users } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import AddMemberModal from './AddMemberModal';
import EditMemberModal from './EditMemberModal';
import { getMembers, type MemberItem } from '../../services/memberService';
import { getLoans, type LoanItem } from '../../services/loanService';
import SearchSuggestInput, { type SearchSuggestionItem } from '../../components/common/SearchSuggestInput';

interface MemberRow {
  id: string;
  name: string;
  mail: string;
  borrowed: number;
  profileImageUrl?: string;
}

export default function Members() {

  const [members, setMembers] = useState<MemberItem[]>([]);
  const [loans, setLoans] = useState<LoanItem[]>([]);
  const [totalMembers, setTotalMembers] = useState(0);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [showAddMemberSlide, setShowAddMemberSlide] = useState(false);
  const [editingMember, setEditingMember] = useState<MemberRow | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const borrowedCountByMember = useMemo(() => {
    const activeLoanStatuses = new Set(['ACTIVE', 'ISSUED', 'REISSUED', 'OVERDUE']);
    return loans.reduce<Record<string, number>>((acc, loan) => {
      const userId = loan.user?.userId;
      const status = String(loan.status ?? '').toUpperCase();
      if (!userId || !activeLoanStatuses.has(status)) return acc;
      acc[userId] = (acc[userId] ?? 0) + 1;
      return acc;
    }, {});
  }, [loans]);

  const memberRows = useMemo<MemberRow[]>(
    () =>
      members.map((member) => ({
        id: member.userid,
        name: member.name,
        mail: member.email,
        borrowed: borrowedCountByMember[member.userid] ?? 0,
        profileImageUrl: member.profileImageUrl,
      })),
    [borrowedCountByMember, members],
  );

  const memberSuggestions = useMemo<SearchSuggestionItem[]>(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return [];
    return memberRows
      .filter((member) =>
        member.name.toLowerCase().includes(q) ||
        member.id.toLowerCase().includes(q) ||
        member.mail.toLowerCase().includes(q),
      )
      .slice(0, 10)
      .map((member) => ({
        id: member.id,
        label: `${member.name} (${member.mail})`,
        value: member.name,
      }));
  }, [memberRows, searchTerm]);

  const filteredMemberRows = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return memberRows;
    return memberRows.filter((member) =>
      member.name.toLowerCase().includes(q) ||
      member.id.toLowerCase().includes(q) ||
      member.mail.toLowerCase().includes(q),
    );
  }, [memberRows, searchTerm]);

  const loadMembers = async (pageNo: number) => {
    try {
      const [memberPage, loanData] = await Promise.all([getMembers(pageNo, 10), getLoans()]);
      setMembers(memberPage.content);
      setLoans(loanData);
      setTotalMembers(memberPage.totalElements);
      setTotalPages(Math.max(memberPage.totalPages, 1));
      setPage(memberPage.page);
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
            <SearchSuggestInput
              className="w-full sm:w-[260px]"
              value={searchTerm}
              placeholder="Search by ID or name..."
              suggestions={memberSuggestions}
              onChange={setSearchTerm}
              onSelect={(item) => setSearchTerm(item.value)}
            />

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
                <th className="px-2 py-2 text-left text-xs md:px-3 md:py-2 lg:px-4 lg:py-3 md:text-sm">Edit</th>
              </tr>
            </thead>

            <tbody>
              {filteredMemberRows.map((member) => (
                <tr key={member.id} className="border-t border-slate-100">

                  <td className="px-2 py-2 text-xs font-semibold text-sky-700 md:px-3 md:py-2 lg:px-4 lg:py-3 md:text-sm">
                    {member.id}
                  </td>

                  <td className="hidden px-2 py-2 text-xs md:table-cell md:px-3 md:py-2 lg:px-4 lg:py-3 md:text-sm"></td>

                  <td className="px-2 py-2 text-xs md:px-3 md:py-2 lg:px-4 lg:py-3 md:text-sm">
                    <div className="flex items-center gap-2">

                      {member.profileImageUrl ? (
                        <img
                          src={member.profileImageUrl}
                          alt={member.name}
                          className="h-7 w-7 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-slate-200 to-slate-400" />
                      )}

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

          <p>Showing {filteredMemberRows.length} of {totalMembers} members</p>

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
        <AddMemberModal
          onClose={() => {
            setShowAddMemberSlide(false);
            void loadMembers(page);
          }}
          onSuccess={() => {
            void loadMembers(page);
          }}
        />
      )}

      {/* Edit Member Modal */}
      {editingMember && (
        <EditMemberModal
          member={editingMember}
          onSuccess={() => {
            void loadMembers(page);
          }}
          onClose={() => {
            setEditingMember(null);
            void loadMembers(page);
          }}
        />
      )}

    </div>
  );
}
