import { useState } from 'react';
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

  const [mobileSidebar, setMobileSidebar] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Removed overflow-hidden */}
      <div className="flex min-h-screen bg-white">

        <Sidebar
          items={navItems}
          activeKey={activeKey}
          onSelect={(key) => {
            onSelect(key);
            setMobileSidebar(false);
          }}
          onLogout={onLogout}
          mobileOpen={mobileSidebar}
          closeMobile={() => setMobileSidebar(false)}
        />

        <div className="flex flex-1 flex-col">

          <TopBar
            user={user}
            role={role}
            onOpenNotifications={onOpenNotifications}
            onOpenProfile={onOpenProfile}
            onToggleSidebar={() => setMobileSidebar(!mobileSidebar)}
          />

          <main className="flex-1 bg-[#7be2c8] p-3 sm:p-6 overflow-x-auto">
            {children}
          </main>

        </div>

      </div>

    </div>
  );
}