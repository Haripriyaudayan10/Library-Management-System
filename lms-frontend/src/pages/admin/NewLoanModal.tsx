import { BookOpen, Search, SquareMinus, X } from 'lucide-react';
import { Card } from '../../components/ui/Card';

interface NewLoanModalProps {
  onClose: () => void;
}

export default function NewLoanModal({ onClose }: NewLoanModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm">
      <Card className="w-full max-w-3xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 bg-emerald-50 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-700 p-2 text-white">
              <BookOpen size={16} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">New Loan Details</h2>
          </div>
          <button type="button" className="text-slate-600" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="p-6">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Loan Information</p>

          <div className="space-y-5 text-sm">
            <div className="grid grid-cols-[140px_1fr] items-center gap-4">
              <p className="text-slate-800">Select Member:</p>
              <label className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                <input className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs" placeholder="Search by member name." />
              </label>
            </div>

            <div className="grid grid-cols-[140px_1fr] items-center gap-4">
              <p className="text-slate-800">Select Book:</p>
              <label className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                <input className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs" placeholder="Search by Book name, Author or Book ID." />
              </label>
            </div>

            <div className="grid grid-cols-[140px_1fr] items-center gap-4">
              <p className="text-slate-800">Available Copies:</p>
              <div className="inline-flex h-9 w-12 items-center justify-center rounded bg-slate-100 text-slate-600">
                <SquareMinus size={14} />
              </div>
            </div>

            <div className="grid grid-cols-[140px_1fr] items-center gap-4">
              <p className="text-slate-800">Enter Book Copy ID:</p>
              <input className="h-9 w-24 rounded-lg border border-slate-200 bg-slate-100 px-3 text-xs" />
            </div>
          </div>

          <div className="mt-14 flex items-center justify-between">
            <button
              type="button"
              className="h-20 w-36 rounded border border-slate-200 bg-white text-sm font-semibold text-slate-700"
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="button" className="h-20 w-36 rounded bg-emerald-700 text-sm font-semibold text-white">
              Create
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
