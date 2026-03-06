import { BookOpen, Clock3, Search, X } from 'lucide-react';
import { Card } from '../../components/ui/Card';

interface ReserveBookModalProps {
  onClose: () => void;
}

export default function ReserveBookModal({ onClose }: ReserveBookModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 backdrop-blur-sm">
      <Card className="w-full max-w-3xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 bg-emerald-50 px-4 py-3.5">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-emerald-700 p-2.5 text-white">
              <BookOpen size={16} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Reserve New Book</h2>
          </div>
          <button type="button" className="text-slate-600" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3 p-4">
          <div>
            <p className="mb-2 text-xl font-bold text-slate-800">Search Book</p>
            <label className="relative block">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                className="h-11 w-full rounded-xl border border-emerald-200 bg-emerald-50/60 pl-12 pr-4 text-xl text-slate-700"
                placeholder="Search by title or author"
              />
            </label>
          </div>

          <div>
            <p className="mb-2 text-xl font-bold text-slate-800">Selected Book</p>
            <div className="rounded-xl border border-slate-200 bg-slate-50/70">
              <div className="flex gap-3 border-b border-slate-200 p-3.5">
                <div className="h-28 w-20 rounded-lg border border-slate-300 bg-[linear-gradient(180deg,#f3efe4,#dfd8c8)]" />
                <div>
                  <p className="text-2xl font-bold text-slate-800">Atomic Habits</p>
                  <p className="mt-0.5 text-xl text-slate-600">James Clear</p>
                  <p className="mt-2 text-xl text-slate-700">
                  </p>
                  <p className="mt-1.5 text-xl">
                    <span className="font-semibold text-rose-500">Status:</span>{' '}
                    <span className="text-slate-700">All copies currently borrowed.</span>
                  </p>
                </div>
              </div>

              <div className="p-3">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                  <p className="inline-flex items-center gap-2 text-xl font-bold text-emerald-900">
                    <Clock3 size={18} />
                    Estimated Queue Position: Auto
                  </p>
                  <p className="mt-1.5 pl-7 text-xl text-slate-600">You&apos;ll be added to the waiting list.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="h-12 rounded-xl border border-slate-300 bg-white px-7 text-xl font-semibold text-slate-700"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="button" className="h-12 rounded-xl bg-emerald-700 px-7 text-xl font-semibold text-white">
              Reserve Book
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
