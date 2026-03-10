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
  profileImageUrl?: string;
  hasUnreadNotifications?: boolean;
  onLogout?: () => void;
  onOpenNotifications?: () => void;
  onOpenProfile?: () => void;
  onSearch?: (query: string) => void;
}

export function AppShell({
  children,
  navItems,
  activeKey,
  onSelect,
  user,
  role,
  profileImageUrl,
  hasUnreadNotifications,
  onLogout,
  onOpenNotifications,
  onOpenProfile,
  onSearch,
}: PropsWithChildren<AppShellProps>) {

  const [mobileSidebar, setMobileSidebar] = useState(false);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-100">

      {/* Removed overflow-hidden */}
      <div className="flex min-h-screen w-full max-w-full overflow-x-hidden bg-white">

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

        <div className="flex w-full max-w-full flex-1 flex-col overflow-x-hidden">

          <TopBar
            user={user}
            role={role}
            profileImageUrl={profileImageUrl}
            hasUnreadNotifications={hasUnreadNotifications}
            onOpenNotifications={onOpenNotifications}
            onOpenProfile={onOpenProfile}
            onToggleSidebar={() => setMobileSidebar(!mobileSidebar)}
            onSearch={onSearch}
          />

          <main className="flex-1 w-full max-w-full overflow-x-hidden bg-[#7be2c8] p-3 sm:p-6">
            {children}
          </main>

        </div>

      </div>

    </div>
  );
}
