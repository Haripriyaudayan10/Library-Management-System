import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Card } from './Card';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  negative?: boolean;
}

export function StatCard({ label, value, icon: Icon, trend, negative }: StatCardProps) {
  return (
    <Card className="min-h-[100px] p-4 transition-all duration-150 hover:-translate-y-[1px] hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-1 text-[33px] font-bold leading-none text-slate-900">{value}</p>
          {trend ? (
            <p className={cn('mt-2 text-[11px] font-semibold', negative ? 'text-rose-600' : 'text-emerald-600')}>{trend}</p>
          ) : null}
        </div>
        <div className="rounded-lg bg-slate-100 p-2 text-slate-500 transition-colors duration-150 hover:bg-slate-200">
          <Icon size={15} />
        </div>
      </div>
    </Card>
  );
}
