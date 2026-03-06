import type { PropsWithChildren } from 'react';
import type { NavItem } from './Sidebar';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface AppShellProps {
  navItems: NavItem[];
  activeKey: string;
  onSelect: (key: string) => void;
  user: string;
  role: string;
  onLogout?: () => void;
  onOpenNotifications?: () => void;
  onOpenProfile?: () => void;
}

export function AppShell({
  children,
  navItems,
  activeKey,
  onSelect,
  user,
  role,
  onLogout,
  onOpenNotifications,
  onOpenProfile,
}: PropsWithChildren<AppShellProps>) {
  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="flex min-h-[calc(100vh-2rem)] overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm">
        <Sidebar items={navItems} activeKey={activeKey} onSelect={onSelect} onLogout={onLogout} />
        <div className="flex flex-1 flex-col">
          <TopBar user={user} role={role} onOpenNotifications={onOpenNotifications} onOpenProfile={onOpenProfile} />
          <main className="flex-1 bg-[#7be2c8] p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
