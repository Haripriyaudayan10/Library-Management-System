import { Bell, Menu } from 'lucide-react';

interface TopBarProps {
  user: string;
  role: string;
  onOpenNotifications?: () => void;
  onOpenProfile?: () => void;
  onToggleSidebar?: () => void;
  onSearch?: (query: string) => void;
}

export function TopBar({
  user,
  role,
  onOpenNotifications,
  onOpenProfile,
  onToggleSidebar,
}: TopBarProps) {
  const isMember = role.toLowerCase() === 'member';
  const isAdmin = role.toLowerCase() === 'admin';

  return (
    <header className="flex h-12 items-center justify-between border-b border-slate-200 bg-white px-3 sm:h-14 sm:px-5">

      {/* LEFT */}
      <div className="flex items-center gap-2">

        {/* Mobile Menu */}
        <button
          className="sm:hidden rounded p-2 hover:bg-slate-100"
          onClick={onToggleSidebar}
        >
          <Menu size={18} />
        </button>

      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">

        {isMember && (
          <button
            className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100"
            onClick={onOpenNotifications}
          >
            <Bell size={16} />
          </button>
        )}

        <div className="flex items-center gap-2 border-l border-slate-200 pl-3">

          <div className="hidden sm:block text-right leading-tight">

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
            className="h-7 w-7 rounded-full bg-gradient-to-br from-amber-200 to-rose-300"
            onClick={isMember ? onOpenProfile : undefined}
          />

        </div>

      </div>

    </header>
  );
}
