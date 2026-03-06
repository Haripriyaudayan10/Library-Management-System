import { AlertTriangle, RotateCcw, SquareLibrary } from 'lucide-react';
import LoanCard from '../../components/common/LoanCard';
import { Button } from '../../components/ui/Button';
import { StatCard } from '../../components/ui/StatCard';

export default function Dashboard() {
  return (
    <div>
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Welcome back, Hari 👋</h1>
          <p className="text-sm text-slate-700">You have read <span className="font-semibold">50 books</span> this year. Keep the momentum going!</p>
        </div>
        <Button size="sm" className="bg-rose-500 hover:bg-rose-600">Reserve New Books</Button>
      </div>

      <div className="mb-5 grid grid-cols-3 gap-4">
        <StatCard label="Books Borrowed" value="2" icon={SquareLibrary} />
        <StatCard label="Books Returned" value="48" icon={RotateCcw} />
        <StatCard label="Pending Balance" value="Rs.14" icon={AlertTriangle} />
      </div>

      <h2 className="mb-3 text-2xl font-bold text-slate-800">Active Loans</h2>

      <div className="grid grid-cols-3 gap-4">
        <LoanCard title="The Great Gatsby" author="F. Scott Fitzgerald" tag="Classic" due="DUE IN 4 DAYS" />
        <LoanCard title="Atomic Habits" author="James Clear" tag="Self-Help" due="DUE IN 10 DAYS" />
        <LoanCard title="The Great Gatsby" author="F. Scott Fitzgerald" tag="Classic" due="DUE IN 4 DAYS" />
      </div>
    </div>
  );
}
