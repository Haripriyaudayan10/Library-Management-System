import type { LucideIcon } from 'lucide-react';
import { BookOpenCheck, LogOut } from 'lucide-react';
import { cn } from '../../lib/cn';

export interface NavItem {
  key: string;
  label: string;
  icon: LucideIcon;
}

interface SidebarProps {
  items: NavItem[];
  activeKey: string;
  onSelect: (key: string) => void;
  compact?: boolean;
  onLogout?: () => void;
}

export function Sidebar({ items, activeKey, onSelect, compact, onLogout }: SidebarProps) {
  return (
    <aside className={cn('flex w-56 flex-col border-r border-slate-200 bg-slate-50', compact && 'w-52')}>
      <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-4">
        <div className="rounded-md border border-slate-200 bg-white p-1 text-emerald-700">
          <BookOpenCheck size={15} />
        </div>
        <span className="text-lg font-extrabold uppercase tracking-tight text-emerald-500">READSPHERE</span>
      </div>

      <div className="px-3 py-4">
        <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Main Menu</p>
        <nav className="space-y-1">
          {items.map(({ key, label, icon: Icon }) => {
            const active = key === activeKey;
            return (
              <button
                key={key}
                className={cn(
                  'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold transition-colors',
                  active ? 'bg-rose-100 text-rose-600' : 'text-slate-600 hover:bg-slate-100',
                )}
                onClick={() => onSelect(key)}
                type="button"
              >
                <Icon size={13} />
                {label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto space-y-1 border-t border-slate-200 px-3 py-4">
        <button
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold text-rose-500 hover:bg-rose-50"
          type="button"
          onClick={onLogout}
        >
          <LogOut size={13} />
          Log out
        </button>
      </div>
    </aside>
  );
}
