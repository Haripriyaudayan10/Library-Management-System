import { LayoutDashboard, BookOpen, Users, Receipt, Calendar, Settings, LogOut } from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: BookOpen, label: 'Book Management' },
  { icon: Users, label: 'Members' },
  { icon: Receipt, label: 'Loans' },
  { icon: Calendar, label: 'Reservations' },
  { icon: Receipt, label: 'Fine' },
];

export const Sidebar = () => (
  <aside className="w-64 h-screen bg-white border-r flex flex-col p-6 sticky top-0">
    <div className="flex items-center gap-2 mb-10">
      <div className="w-8 h-8 bg-emerald-600 rounded-lg"></div>
      <h1 className="text-xl font-bold text-gray-800 tracking-tight">READSPHERE</h1>
    </div>
    <nav className="flex-1 space-y-2">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Main Menu</p>
      {navItems.map((item) => (
        <button key={item.label} className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-500 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-all">
          <item.icon size={20} />
          <span className="font-semibold text-sm">{item.label}</span>
        </button>
      ))}
    </nav>
    <div className="pt-6 border-t space-y-1">
      <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-500 hover:text-gray-900">
        <Settings size={20} /> <span className="font-semibold text-sm">Settings</span>
      </button>
      <button className="w-full flex items-center gap-3 px-3 py-2 text-red-500 hover:text-red-700">
        <LogOut size={20} /> <span className="font-semibold text-sm">Log out</span>
      </button>
    </div>
  </aside>
);