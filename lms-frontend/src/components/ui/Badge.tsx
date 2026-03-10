import type { PropsWithChildren } from 'react';
import { cn } from '../../lib/cn';

type BadgeTone = 'neutral' | 'positive' | 'warning' | 'danger' | 'info';

interface BadgeProps {
  tone?: BadgeTone;
  className?: string;
}

const toneStyles: Record<BadgeTone, string> = {
  neutral: 'bg-slate-100 text-slate-600',
  positive: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-rose-100 text-rose-600',
  info: 'bg-blue-100 text-blue-700',
};

export function Badge({
  tone = 'neutral',
  children,
  className,
}: PropsWithChildren<BadgeProps>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium transition-all duration-150 hover:-translate-y-[2px] hover:shadow',
        toneStyles[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
