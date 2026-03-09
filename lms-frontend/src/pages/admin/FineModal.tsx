import { CircleAlert, X } from 'lucide-react';
import DateBox from '../../components/common/DateBox';
import Identity from '../../components/common/Identity';
import ModalShell from '../../components/common/ModalShell';
import { Button } from '../../components/ui/Button';

interface Props {
  onClose: () => void;
}

export default function FineModal({ onClose }: Props) {
  return (
    <ModalShell cardClassName="max-w-2xl" zIndexClassName="z-40">

        <div className="flex items-start justify-between border-b border-slate-200 bg-emerald-50 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-700 p-2 text-white">
              <CircleAlert size={18} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-4xl">Fine Details</h1>
              <p className="text-xs text-slate-500">
                Transaction ID: #FIN-90241-XB
              </p>
            </div>
          </div>

          <button
            className="text-slate-500"
            onClick={onClose}
            type="button"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-5 p-5 text-xs">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Member Information
              </p>
              <Identity name="Arjun Mehta" subtitle="User ID : LE-2022-104" />
            </div>

            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Book Context
              </p>

              <p className="text-sm font-bold text-slate-800">
                The Silent Patient
              </p>

              <p className="text-xs text-slate-500">
                by Alex Michaelides
              </p>

              <p className="text-xs font-semibold text-emerald-700">
                Loan ID: #L-45829
              </p>
            </div>

          </div>

          <div className="border-t border-slate-200 pt-4">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Loan Timeline
            </p>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <DateBox label="Loan Date" value="Oct 01, 2024" />
              <DateBox label="Due Date" value="Oct 15, 2024" />
              <DateBox label="Returned On" value="Oct 22, 2024" danger />
            </div>
          </div>

          <div className="flex flex-wrap items-end justify-between rounded-xl border border-emerald-100 bg-emerald-50 p-4">

            <div>
              <p className="text-xs font-semibold text-emerald-800">
                Calculation: 7 days overdue × ₹5.00/day
              </p>

              <span className="mt-1 inline-block rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold text-rose-500">
                Overdue Charge
              </span>
            </div>

            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                Total Fine Amount
              </p>

              <p className="text-2xl font-bold text-slate-900 sm:text-4xl">
                ₹35.00
              </p>
            </div>

          </div>

          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>

            <Button>
              Mark as Paid
            </Button>
          </div>
        </div>

    </ModalShell>
  );
}
