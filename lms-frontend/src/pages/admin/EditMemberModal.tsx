import { useState } from 'react';
import { X } from 'lucide-react';
import ModalShell from '../../components/common/ModalShell';
import { Button } from '../../components/ui/Button';

interface Props {
  member: {
    id: string;
    name: string;
    mail: string;
  };
  onClose: () => void;
}

export default function EditMemberModal({ member, onClose }: Props) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <ModalShell cardClassName="max-w-lg" zIndexClassName="z-40">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 sm:px-5 sm:py-4">
          <h1 className="text-xl font-bold text-slate-900">Edit Member</h1>
          <button onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4 p-4 text-sm sm:p-5">

          {/* Member ID */}
          <div>
            <label className="text-xs font-semibold text-slate-500">Member ID</label>
            <input
              value={member.id}
              disabled
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2"
            />
          </div>

          {/* Name */}
          <div>
            <label className="text-xs font-semibold text-slate-500">Full Name</label>
            <input
              defaultValue={member.name}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-semibold text-slate-500">Email</label>
            <input
              defaultValue={member.mail}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-xs font-semibold text-slate-500">Phone</label>
            <input
              placeholder="Enter phone number"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
            />
          </div>

          {/* Status */}
          <div>
            <label className="text-xs font-semibold text-slate-500">Membership Status</label>
            <select className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2">
              <option>Active</option>
              <option>Suspended</option>
            </select>
          </div>

          {/* Password Section */}
          <div className="border-t border-slate-200 pt-4">
            <p className="mb-2 text-xs font-semibold uppercase text-slate-500">
              Reset Password
            </p>

            <div className="space-y-3">

              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2"
              />

              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2"
              />

            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-2 pt-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>

            <Button>
              Save Changes
            </Button>
          </div>

        </div>

    </ModalShell>
  );
}
