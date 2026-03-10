import { useEffect, useMemo, useState } from 'react';
import { BookOpen, Calendar, Clock3, IndianRupee, Layers, Users } from 'lucide-react';

import { AppShell } from './components/layout/AppShell';
import type { NavItem } from './components/layout/Sidebar';
import { type LoginResult } from './lib/auth';
import { login as loginRequest } from './services/authService';

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
import { getMemberNotifications } from './services/memberNotificationService';

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
const JWT_STORAGE_KEY = 'jwt_token';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
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
    localStorage.setItem(JWT_STORAGE_KEY, auth.token);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
    setSession(auth);
    setScreen(auth.role === 'ADMIN' ? 'admin-dashboard' : 'member-dashboard');
    window.history.pushState({}, '', '/dashboard');
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const backendData = await loginRequest(email, password);
      const roleUpper = String(backendData.role ?? '').toUpperCase();
      if (roleUpper !== 'ADMIN' && roleUpper !== 'MEMBER') {
        throw new Error('Unsupported role from backend');
      }

      const backend: LoginResult = {
        token: backendData.token,
        userId: String(backendData.userId),
        name: backendData.name,
        role: roleUpper,
        email,
        profileImageUrl: backendData.profileImageUrl,
      };
      setAuthenticated(backend);
    } catch {
      throw new Error('Invalid email or password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  };

  const handleProfileUpdated = (patch: { name?: string; profileImageUrl?: string }) => {
    setSession((prev) => {
      if (!prev) return prev;
      const next = {
        ...prev,
        name: patch.name ?? prev.name,
        profileImageUrl: patch.profileImageUrl ?? prev.profileImageUrl,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const refreshUnreadNotifications = async () => {
    if (!session || session.role !== 'MEMBER') {
      setHasUnreadNotifications(false);
      return;
    }
    try {
      const notifications = await getMemberNotifications();
      setHasUnreadNotifications(notifications.some((item) => !item.read));
    } catch (error) {
      console.error('Failed to refresh unread notifications', error);
    }
  };

  useEffect(() => {
    if (!session || session.role !== 'MEMBER') return;
    void refreshUnreadNotifications();
  }, [session?.role, session?.token]);

  useEffect(() => {
    if (!session || session.role !== 'MEMBER') return;
    const interval = window.setInterval(() => {
      void refreshUnreadNotifications();
    }, 30000);
    return () => window.clearInterval(interval);
  }, [session?.role, session?.token]);

  const renderScreen = () => {
    if (!session) return <Login onSubmit={handleLogin} />;

    if (session.role === 'ADMIN') {
      return (
        <AppShell
          navItems={adminNav}
          activeKey={screen === 'admin-fine-modal' ? 'admin-fines' : screen}
          onSelect={(key) => setScreen(key as Screen)}
          onSearch={(query) => {
            setSearchQuery(query);
            setScreen('admin-books');
          }}
          user={session.name}
          role="Admin"
          profileImageUrl={session.profileImageUrl}
          onLogout={handleLogout}
        >
          {screen === 'admin-dashboard' && <AdminDashboard />}
          {screen === 'admin-books' && <Books searchQuery={searchQuery} />}
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
        profileImageUrl={session.profileImageUrl}
        hasUnreadNotifications={hasUnreadNotifications}
        onLogout={handleLogout}
        onOpenNotifications={() => {
          void refreshUnreadNotifications();
          setScreen('member-notifications');
        }}
        onOpenProfile={() => setScreen('member-profile')}
      >
        {screen === 'member-dashboard' && <MemberDashboard />}
        {screen === 'member-profile' && <Profile onProfileUpdated={handleProfileUpdated} />}
        {screen === 'member-notifications' && (
  <Notifications
    onClose={() => setScreen('member-dashboard')}
    onMarkedAllRead={() => setHasUnreadNotifications(false)}
  />
)}
      </AppShell>

      
    );
  };

  return <div>{renderScreen()}</div>;
}

export default App;
