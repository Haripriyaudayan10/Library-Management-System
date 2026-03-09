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
  mobileOpen?: boolean;
  closeMobile?: () => void;
}

export function Sidebar({
  items,
  activeKey,
  onSelect,
  compact,
  onLogout,
  mobileOpen = false,
  closeMobile,
}: SidebarProps) {
  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-30 bg-slate-900/35 sm:hidden"
          onClick={closeMobile}
        />
      ) : null}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-56 -translate-x-full flex-col border-r border-slate-200 bg-slate-50 transition-transform sm:static sm:w-56 sm:translate-x-0',
          mobileOpen && 'translate-x-0',
          compact && 'sm:w-52',
        )}
      >
      <div className="flex h-14 items-center justify-center gap-2 border-b border-slate-200 px-2 sm:h-16 sm:justify-start sm:px-4">
        <div className="rounded-md border border-slate-200 bg-white p-1 text-emerald-700">
          <BookOpenCheck size={15} />
        </div>
        <span className="text-lg font-extrabold uppercase tracking-tight text-emerald-500">READSPHERE</span>
      </div>

      <div className="px-2 py-3 sm:px-3 sm:py-4">
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
                <span>{label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto space-y-1 border-t border-slate-200 px-2 py-3 sm:px-3 sm:py-4">
        <button
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold text-rose-500 hover:bg-rose-50"
          type="button"
          onClick={onLogout}
        >
          <LogOut size={13} />
          <span>Log out</span>
        </button>
      </div>
      </aside>
    </>
  );
}
