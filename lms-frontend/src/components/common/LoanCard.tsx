import { Clock3 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface Props {
  title: string;
  author: string;
  tag: string;
  due: string;
  cover?: string; // ✅ new optional prop
}

export default function LoanCard({ title, author, tag, due, cover }: Props) {
  return (
    <Card className="flex w-full items-center gap-3 p-3">

      {/* BOOK COVER */}
      <img
        src={cover || '/default-book.svg'}
        alt={title}
        className="h-20 w-16 rounded-md object-cover"
        onError={(e) => {
          e.currentTarget.src = '/default-book.svg';
        }}
      />

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
