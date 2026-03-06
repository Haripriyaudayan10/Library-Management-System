import { Bell, Search } from 'lucide-react';

interface TopBarProps {
  user: string;
  role: string;
  onOpenNotifications?: () => void;
  onOpenProfile?: () => void;
}

export function TopBar({ user, role, onOpenNotifications, onOpenProfile }: TopBarProps) {
  const isMember = role.toLowerCase() === 'member';
  const isAdmin = role.toLowerCase() === 'admin';

  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-5">
      <label className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
        <input
          className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs text-slate-700 outline-none ring-emerald-300 transition focus:bg-white focus:ring-2"
          placeholder="Search books, authors, or members..."
        />
      </label>

      <div className="ml-6 flex items-center gap-4">
        {isMember ? (
          <button className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100" type="button" onClick={onOpenNotifications}>
            <Bell size={15} />
          </button>
        ) : null}
        <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
          <div className="text-right leading-tight">
            {isAdmin ? (
              <p className="text-xs font-semibold text-slate-800">Admin</p>
            ) : (
              <>
                <p className="text-xs font-semibold text-slate-800">{user}</p>
                <p className="text-[10px] text-slate-500">{role}</p>
              </>
            )}
          </div>
          <button
            type="button"
            className="h-7 w-7 rounded-full bg-gradient-to-br from-amber-200 to-rose-300"
            onClick={isMember ? onOpenProfile : undefined}
          />
        </div>
      </div>
    </header>
  );
}
