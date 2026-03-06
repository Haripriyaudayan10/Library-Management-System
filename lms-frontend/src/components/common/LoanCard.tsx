import { Clock3 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface Props {
  title: string;
  author: string;
  tag: string;
  due: string;
}

export default function LoanCard({ title, author, tag, due }: Props) {
  return (
    <Card className="flex max-w-[310px] items-center gap-3 p-3">
      <div className="h-20 w-16 rounded-md bg-gradient-to-br from-slate-200 to-slate-400" />

      <div className="flex-1">
        <div className="mb-0.5 flex items-center justify-between gap-2">
          <p className="text-sm font-bold text-slate-800">{title}</p>
          <Badge>{tag}</Badge>
        </div>

        <p className="text-xs text-slate-500">{author}</p>

        <p className="mt-4 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
          <Clock3 size={11} />
          {due}
        </p>
      </div>
    </Card>
  );
}
