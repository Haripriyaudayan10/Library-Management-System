import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface Props {
  title: string;
  description: string;
  meta: string;
}

export default function NotificationCard({ title, description, meta }: Props) {
  return (
    <Card className="mb-3 border-emerald-100 p-4">
      <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-800">{title}</p>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
        <p className="text-[10px] font-semibold uppercase text-slate-400">{meta}</p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
        <Button size="sm" variant="ghost">
          Dismiss
        </Button>
        <Button size="sm">View Details</Button>
      </div>
    </Card>
  );
}
