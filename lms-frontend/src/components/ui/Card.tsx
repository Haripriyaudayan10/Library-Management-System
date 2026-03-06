import type { PropsWithChildren } from 'react';
import { cn } from '../../lib/cn';

interface CardProps {
  className?: string;
}

export function Card({ children, className }: PropsWithChildren<CardProps>) {
  return <section className={cn('rounded-xl border border-slate-200 bg-white shadow-sm', className)}>{children}</section>;
}
