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
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-800">{title}</p>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
        <p className="text-[10px] font-semibold uppercase text-slate-400">{meta}</p>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button size="sm" variant="ghost">
          Dismiss
        </Button>
        <Button size="sm">View Details</Button>
      </div>
    </Card>
  );
}
