import { BellRing, X } from 'lucide-react';
import ModalShell from '../../components/common/ModalShell';
import NotificationCard from '../../components/common/NotificationCard';
import { Button } from '../../components/ui/Button';

interface Props {
  onClose: () => void;
}

export default function Notifications({ onClose }: Props) {
  return (
    <ModalShell cardClassName="max-w-md p-4 sm:p-5" overlayClassName="bg-slate-900/35" zIndexClassName="z-40">

        <div className="mb-4 flex items-start justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-700 p-2 text-white">
              <BellRing size={16} />
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                My Alerts • 4 Actions Required
              </p>

              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Pending Resolutions
              </h1>
            </div>
          </div>

          {/* CLOSE ICON */}
          <button
            className="text-slate-500"
            onClick={onClose}
            type="button"
          >
            <X size={15} />
          </button>
        </div>

        <p className="mb-3 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          Recent Priority Notifications
        </p>

        <NotificationCard
          title="Book Ready for Pickup"
          description="'The classic you requested is waiting at the circulation desk. Please collect by Friday.'"
          meta="10M AGO"
        />

        <NotificationCard
          title="Approaching Due Date"
          description="Friendly reminder that your current loan period is ending in 48 hours."
          meta="3H AGO"
        />

        <NotificationCard
          title="Overdue Notice"
          description="The return date for this resource has passed. Please return it immediately."
          meta="2D AGO"
        />

        <NotificationCard
          title="Library Fine Issued"
          description="A late return fee has been automatically applied to your account balance."
          meta="5H AGO"
        />

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">

          {/* CLOSE BUTTON */}
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Close Action Center
          </Button>

          <Button>
            Mark All as Read
          </Button>

        </div>
    </ModalShell>
  );
}
