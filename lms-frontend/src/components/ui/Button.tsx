import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '../../lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-emerald-700 text-white hover:bg-emerald-800 shadow-sm hover:shadow',
  secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:shadow-sm',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
  danger: 'bg-rose-500 text-white hover:bg-rose-600 hover:shadow',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-9 px-4 text-sm',
};

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  children,
  ...props
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold transition-all duration-150 hover:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
