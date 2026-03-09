import { useState } from 'react';
import { Filter, Plus, Search, Users } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import AddMemberModal from './AddMemberModal';
import EditMemberModal from './EditMemberModal';

const members = [
  { id: 'LIB-8801', name: 'Alexander Wright', mail: 'a.wright@example.com', borrowed: 1, joined: 'May 12, 2023' },
  { id: 'LIB-9244', name: 'Elena Rodriguez', mail: 'elena.r@example.com', borrowed: 0, joined: 'Aug 20, 2023' },
  { id: 'LIB-4112', name: 'Marcus Thorne', mail: 'm.thorne@example.com', borrowed: 0, joined: 'Nov 5, 2022' },
  { id: 'LIB-7723', name: 'Sarah Jenkins', mail: 's.sarah@school.edu', borrowed: 3, joined: 'Jan 15, 2024' },
  { id: 'LIB-6550', name: 'Julian Voss', mail: 'jvoss@techcorp.com', borrowed: 2, joined: 'Mar 30, 2021' },
];

export default function Members() {

  const [showAddMemberSlide, setShowAddMemberSlide] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);

  return (
    <div>

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
        <StatCard label="Total Members" value="2,842" icon={Users} />
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
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-xs">

            <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-2 text-left">Member ID</th>
                <th className="w-6 px-2 py-2 text-left">↕</th>
                <th className="px-3 py-2 text-left">Member Information</th>
                <th className="px-3 py-2 text-left">Borrowed</th>
                <th className="px-3 py-2 text-left">Joined On</th>
                <th className="px-3 py-2 text-left">Edit</th>
              </tr>
            </thead>

            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-t border-slate-100">

                  <td className="px-4 py-3 font-semibold text-sky-700">
                    {member.id}
                  </td>

                  <td className="px-2 py-3"></td>

                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">

                      <div className="h-7 w-7 rounded-full bg-gradient-to-br from-slate-200 to-slate-400" />

                      <div>
                        <p className="font-semibold text-slate-800">
                          {member.name}
                        </p>

                        <p className="text-[11px] text-slate-500">
                          {member.mail}
                        </p>
                      </div>

                    </div>
                  </td>

                  <td className="px-3 py-3">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5">
                      {member.borrowed}
                    </span>
                  </td>

                  <td className="px-3 py-3 text-slate-600">
                    {member.joined}
                  </td>

                  {/* Edit Button */}
                  <td className="px-3 py-3">
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

          <p>Showing 1-5 of 2,842 members</p>

          <div className="flex items-center gap-1">

            <button className="rounded border border-slate-200 px-2 py-1">
              Previous
            </button>

            <button className="rounded bg-blue-700 px-2 py-1 text-white">
              1
            </button>

            <button className="rounded border border-slate-200 px-2 py-1">
              2
            </button>

            <button className="rounded border border-slate-200 px-2 py-1">
              3
            </button>

            <span className="px-1">...</span>

            <button className="rounded border border-slate-200 px-2 py-1">
              569
            </button>

            <button className="rounded border border-slate-200 px-2 py-1">
              Next
            </button>

          </div>

        </div>

      </Card>

      {/* Add Member Modal */}
      {showAddMemberSlide && (
        <AddMemberModal onClose={() => setShowAddMemberSlide(false)} />
      )}

      {/* Edit Member Modal */}
      {editingMember && (
        <EditMemberModal
          member={editingMember}
          onClose={() => setEditingMember(null)}
        />
      )}

    </div>
  );
}
