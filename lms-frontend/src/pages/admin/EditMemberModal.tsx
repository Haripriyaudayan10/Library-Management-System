import { useState } from 'react';
import { X } from 'lucide-react';
import ModalShell from '../../components/common/ModalShell';
import { Button } from '../../components/ui/Button';
import { deleteMember, updateMember } from '../../services/memberService';

interface Props {
  member: {
    id: string;
    name: string;
    mail: string;
  };
  onClose: () => void;
  onSuccess?: () => void;
}

export default function EditMemberModal({ member, onClose, onSuccess }: Props) {
  const [name, setName] = useState(member.name);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = async () => {
    if (!name.trim()) return;
    try {
      await updateMember(member.id, name.trim());
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Failed to update member', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMember(member.id);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Failed to delete member', error);
    }
  };

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
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            <Button variant="danger" onClick={() => void handleDelete()}>
              Delete Member
            </Button>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>

            <Button onClick={() => void handleSave()}>
              Save Changes
            </Button>
          </div>

        </div>

    </ModalShell>
  );
}
