import { useState } from 'react';
import { Filter, Plus, Search, Users } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import AddMemberModal from './AddMemberModal';

const members = [
  { id: 'LIB-8801', name: 'Alexander Wright', mail: 'a.wright@example.com', borrowed: 1, joined: 'May 12, 2023' },
  { id: 'LIB-9244', name: 'Elena Rodriguez', mail: 'elena.r@example.com', borrowed: 0, joined: 'Aug 20, 2023' },
  { id: 'LIB-4112', name: 'Marcus Thorne', mail: 'm.thorne@example.com', borrowed: 0, joined: 'Nov 5, 2022' },
  { id: 'LIB-7723', name: 'Sarah Jenkins', mail: 's.sarah@school.edu', borrowed: 3, joined: 'Jan 15, 2024' },
  { id: 'LIB-6550', name: 'Julian Voss', mail: 'jvoss@techcorp.com', borrowed: 2, joined: 'Mar 30, 2021' },
];

export default function Members() {
  const [showAddMemberSlide, setShowAddMemberSlide] = useState(false);

  return (
    <div>
      <div className="mb-4 flex items-start justify-between">
        <h1 className="text-4xl font-bold text-slate-900">Members</h1>
        <Button
          size="sm"
          className="bg-slate-900 hover:bg-slate-800"
          onClick={() => setShowAddMemberSlide(true)}
        >
          <Plus size={14} /> Add New Member
        </Button>
      </div>

      <div className="mb-4 max-w-md">
        <StatCard label="Total Members" value="2,842" icon={Users} />
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
          <h2 className="text-2xl font-bold text-slate-800">Patron Records</h2>
          <div className="flex items-center gap-2">
            <label className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input className="h-8 rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs" placeholder="Search by ID or name..." />
            </label>
            <Button variant="secondary" size="sm"><Filter size={13} /></Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-2 text-left">Member ID</th>
                <th className="w-6 px-2 py-2 text-left">↕</th>
                <th className="px-3 py-2 text-left">Member Information</th>
                <th className="px-3 py-2 text-left">Borrowed</th>
                <th className="px-3 py-2 text-left">Joined On</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-semibold text-sky-700">{member.id}</td>
                  <td className="px-2 py-3"> </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-gradient-to-br from-slate-200 to-slate-400" />
                      <div>
                        <p className="font-semibold text-slate-800">{member.name}</p>
                        <p className="text-[11px] text-slate-500">{member.mail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3"><span className="rounded-full bg-slate-100 px-2 py-0.5">{member.borrowed}</span></td>
                  <td className="px-3 py-3 text-slate-600">{member.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-xs text-slate-500">
          <p>Showing 1-5 of 2,842 members</p>
          <div className="flex items-center gap-1">
            <button className="rounded border border-slate-200 px-2 py-1" type="button">Previous</button>
            <button className="rounded bg-blue-700 px-2 py-1 text-white" type="button">1</button>
            <button className="rounded border border-slate-200 px-2 py-1" type="button">2</button>
            <button className="rounded border border-slate-200 px-2 py-1" type="button">3</button>
            <span className="px-1">...</span>
            <button className="rounded border border-slate-200 px-2 py-1" type="button">569</button>
            <button className="rounded border border-slate-200 px-2 py-1" type="button">Next</button>
          </div>
        </div>
      </Card>

      {showAddMemberSlide ? <AddMemberModal onClose={() => setShowAddMemberSlide(false)} /> : null}
    </div>
  );
}
