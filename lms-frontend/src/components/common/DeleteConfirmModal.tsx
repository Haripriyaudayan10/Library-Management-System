import { AlertTriangle, X } from 'lucide-react';
import ModalShell from './ModalShell';
import { Button } from '../ui/Button';

interface Props {
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmModal({
  title = "Delete Item?",
  message = "Are you sure you want to permanently delete this item? This action cannot be undone.",
  onConfirm,
  onCancel,
}: Props) {

  return (
    <ModalShell cardClassName="max-w-md" overlayClassName="bg-slate-900/30" zIndexClassName="z-50">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-rose-100 p-2 text-rose-600">
              <AlertTriangle size={18} />
            </div>

            <h2 className="text-lg font-semibold text-slate-900">
              {title}
            </h2>

          </div>

          <button
            onClick={onCancel}
            className="text-slate-500 hover:text-slate-700"
          >
            <X size={16} />
          </button>

        </div>


        {/* Message */}
        <div className="px-5 py-4 text-sm text-slate-600">
          {message}
        </div>


        {/* Buttons */}
        <div className="flex flex-col gap-2 border-t border-slate-200 px-5 py-4 sm:flex-row sm:justify-end">

          <Button
            variant="secondary"
            onClick={onCancel}
          >
            Cancel
          </Button>

          <Button
            className="bg-rose-600 hover:bg-rose-700"
            onClick={onConfirm}
          >
            Delete
          </Button>

        </div>

    </ModalShell>
  );
}
