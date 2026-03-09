import type { PropsWithChildren } from 'react';
import { cn } from '../../lib/cn';
import { Card } from '../ui/Card';

interface ModalShellProps {
  cardClassName?: string;
  overlayClassName?: string;
  zIndexClassName?: string;
}

export default function ModalShell({
  children,
  cardClassName,
  overlayClassName,
  zIndexClassName = 'z-50',
}: PropsWithChildren<ModalShellProps>) {
  return (
    <div
      className={cn(
        'fixed inset-0 flex items-center justify-center p-3 backdrop-blur-sm',
        zIndexClassName,
        overlayClassName ?? 'bg-slate-900/20',
      )}
    >
      <Card className={cn('max-h-[92vh] w-full overflow-y-auto', cardClassName)}>{children}</Card>
    </div>
  );
}
