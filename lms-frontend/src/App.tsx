import { useMemo, useState } from 'react';
import { BookOpen, Calendar, Clock3, IndianRupee, Layers, Users } from 'lucide-react';

import { AppShell } from './components/layout/AppShell';
import type { NavItem } from './components/layout/Sidebar';
import { loginWithBackend, loginWithDummy, type LoginResult } from './lib/auth';

import Login from './pages/Login';

import AdminDashboard from './pages/admin/Dashboard';
import Books from './pages/admin/Books';
import Members from './pages/admin/Members';
import Loans from './pages/admin/Loans';
import Reservations from './pages/admin/Reservations';
import Fines from './pages/admin/Fines';
import FineModal from './pages/admin/FineModal';

import MemberDashboard from './pages/member/Dashboard';
import Profile from './pages/member/Profile';
import Notifications from './pages/member/Notifications';

type Screen =
  | 'admin-dashboard'
  | 'admin-books'
  | 'admin-members'
  | 'admin-loans'
  | 'admin-reservations'
  | 'admin-fines'
  | 'admin-fine-modal'
  | 'member-dashboard'
  | 'member-profile'
  | 'member-notifications';

const STORAGE_KEY = 'lms_auth_session';

function getInitialSession(): LoginResult | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as LoginResult;
    if (!parsed?.role || !parsed?.token) return null;
    return parsed;
  } catch {
    return null;
  }
}

function App() {
  const [session, setSession] = useState<LoginResult | null>(getInitialSession);
  const [screen, setScreen] = useState<Screen>(() => {
    const saved = getInitialSession();
    return saved?.role === 'MEMBER' ? 'member-dashboard' : 'admin-dashboard';
  });

  const adminNav = useMemo<NavItem[]>(
    () => [
      { key: 'admin-dashboard', label: 'Dashboard', icon: Layers },
      { key: 'admin-books', label: 'Book Management', icon: BookOpen },
      { key: 'admin-members', label: 'Members', icon: Users },
      { key: 'admin-loans', label: 'Loans', icon: Clock3 },
      { key: 'admin-reservations', label: 'Reservations', icon: Calendar },
      { key: 'admin-fines', label: 'Fine', icon: IndianRupee },
    ],
    [],
  );

  const memberNav = useMemo<NavItem[]>(() => [{ key: 'member-dashboard', label: 'My Dashboard', icon: Layers }], []);

  const setAuthenticated = (auth: LoginResult) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
    setSession(auth);
    setScreen(auth.role === 'ADMIN' ? 'admin-dashboard' : 'member-dashboard');
  };

  const handleLogin = async (email: string, password: string) => {
    const dummy = loginWithDummy({ email, password });
    if (dummy) {
      setAuthenticated(dummy);
      return;
    }

    const backend = await loginWithBackend({ email, password });
    setAuthenticated(backend);
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  };

  const renderScreen = () => {
    if (!session) return <Login onSubmit={handleLogin} />;

    if (session.role === 'ADMIN') {
      return (
        <AppShell
          navItems={adminNav}
          activeKey={screen === 'admin-fine-modal' ? 'admin-fines' : screen}
          onSelect={(key) => setScreen(key as Screen)}
          user={session.name}
          role="Admin"
          onLogout={handleLogout}
        >
          {screen === 'admin-dashboard' && <AdminDashboard />}
          {screen === 'admin-books' && <Books />}
          {screen === 'admin-members' && <Members />}
          {screen === 'admin-loans' && <Loans />}
          {screen === 'admin-reservations' && <Reservations />}
          {screen === 'admin-fines' && <Fines />}
    
          {screen === 'admin-fine-modal' && (
  <FineModal onClose={() => setScreen('admin-fines')} />
)}
        </AppShell>
      );
    }

    return (
      <AppShell
        navItems={memberNav}
        activeKey="member-dashboard"
        onSelect={(key) => setScreen(key as Screen)}
        user={session.name}
        role="Member"
        onLogout={handleLogout}
        onOpenNotifications={() => setScreen('member-notifications')}
        onOpenProfile={() => setScreen('member-profile')}
      >
        {screen === 'member-dashboard' && <MemberDashboard />}
        {screen === 'member-profile' && <Profile />}
        {screen === 'member-notifications' && (
  <Notifications onClose={() => setScreen('member-dashboard')} />
)}
      </AppShell>

      
    );
  };

  return <div>{renderScreen()}</div>;
}

export default App;
