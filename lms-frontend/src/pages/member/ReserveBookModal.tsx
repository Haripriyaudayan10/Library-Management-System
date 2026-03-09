import { BookOpen, Clock3, Search, X } from 'lucide-react';
import ModalShell from '../../components/common/ModalShell';

interface ReserveBookModalProps {
  onClose: () => void;
}

export default function ReserveBookModal({ onClose }: ReserveBookModalProps) {
  return (
    <ModalShell cardClassName="max-w-3xl" overlayClassName="bg-slate-900/45" zIndexClassName="z-50">
        <div className="flex items-center justify-between border-b border-slate-200 bg-emerald-50 px-4 py-3.5">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-emerald-700 p-2.5 text-white">
              <BookOpen size={16} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">Reserve New Book</h2>
          </div>
          <button type="button" className="text-slate-600" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3 p-4">
          <div>
            <p className="mb-2 text-lg font-bold text-slate-800 sm:text-xl">Search Book</p>
            <label className="relative block">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                className="h-10 w-full rounded-xl border border-emerald-200 bg-emerald-50/60 pl-12 pr-4 text-base text-slate-700 sm:h-11 sm:text-xl"
                placeholder="Search by title or author"
              />
            </label>
          </div>

          <div>
            <p className="mb-2 text-lg font-bold text-slate-800 sm:text-xl">Selected Book</p>
            <div className="rounded-xl border border-slate-200 bg-slate-50/70">
              <div className="flex flex-col gap-3 border-b border-slate-200 p-3.5 sm:flex-row">
                <div className="h-28 w-20 rounded-lg border border-slate-300 bg-[linear-gradient(180deg,#f3efe4,#dfd8c8)]" />
                <div>
                  <p className="text-xl font-bold text-slate-800 sm:text-2xl">Atomic Habits</p>
                  <p className="mt-0.5 text-lg text-slate-600 sm:text-xl">James Clear</p>
                  <p className="mt-2 text-lg text-slate-700 sm:text-xl">
                  </p>
                  <p className="mt-1.5 text-lg sm:text-xl">
                    <span className="font-semibold text-rose-500">Status:</span>{' '}
                    <span className="text-slate-700">All copies currently borrowed.</span>
                  </p>
                </div>
              </div>

              <div className="p-3">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                  <p className="inline-flex items-center gap-2 text-lg font-bold text-emerald-900 sm:text-xl">
                    <Clock3 size={18} />
                    Estimated Queue Position: Auto
                  </p>
                  <p className="mt-1.5 pl-7 text-lg text-slate-600 sm:text-xl">You&apos;ll be added to the waiting list.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-end gap-2 sm:flex-row sm:gap-3">
            <button
              type="button"
              className="h-11 rounded-xl border border-slate-300 bg-white px-6 text-lg font-semibold text-slate-700 sm:h-12 sm:px-7 sm:text-xl"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="button" className="h-11 rounded-xl bg-emerald-700 px-6 text-lg font-semibold text-white sm:h-12 sm:px-7 sm:text-xl">
              Reserve Book
            </button>
          </div>
        </div>
    </ModalShell>
  );
}
