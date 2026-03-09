import { UserPlus, X } from 'lucide-react';
import ModalShell from '../../components/common/ModalShell';
import { Button } from '../../components/ui/Button';

interface AddMemberModalProps {
  onClose: () => void;
}

export default function AddMemberModal({ onClose }: AddMemberModalProps) {
  return (
    <ModalShell cardClassName="max-w-2xl" zIndexClassName="z-50">
        <div className="flex items-center justify-between border-b border-slate-200 bg-emerald-50 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-700 p-2 text-white">
              <UserPlus size={16} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Member Details</h2>
          </div>
          <button type="button" className="text-slate-600" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4 p-5 text-xs">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Member Information</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label>
              <p className="mb-1 font-semibold text-slate-700">Full Name</p>
              <input className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3" placeholder="Enter Full Name" />
            </label>
            <label>
              <p className="mb-1 font-semibold text-slate-700">Email Address</p>
              <input className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3" placeholder="Enter Email ID" />
            </label>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label>
              <p className="mb-1 font-semibold text-slate-700">Phone Number</p>
              <input className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3" placeholder="Enter Phone Number" />
            </label>
            <div>
              <p className="mb-1 font-semibold text-slate-700"> </p>
              <div className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-200 to-slate-300" />
                <button type="button" className="text-xs font-semibold text-slate-700">
                  Add Profile Photo
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Account Credentials</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label>
                <p className="mb-1 font-semibold text-slate-700">User Name</p>
                <input className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3" placeholder="Enter User Name" />
              </label>
              <label>
                <p className="mb-1 font-semibold text-slate-700">Password</p>
                <input className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3" placeholder="Enter Password" />
              </label>
              <label>
                <p className="mb-1 font-semibold text-slate-700">Confirm Password</p>
                <input className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3" placeholder="Enter Password" />
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button>Add Member</Button>
          </div>
        </div>
    </ModalShell>
  );
}
