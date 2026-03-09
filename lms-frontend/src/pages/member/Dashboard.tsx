import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, RotateCcw, SquareLibrary } from 'lucide-react';
import LoanCard from '../../components/common/LoanCard';
import { Button } from '../../components/ui/Button';
import { StatCard } from '../../components/ui/StatCard';
import ReserveBookModal from './ReserveBookModal';
import { getMemberDashboard, type MemberActiveLoan } from '../../services/memberPortalService';

function getDueText(dueDate: string): string {
  const due = new Date(dueDate);
  if (Number.isNaN(due.getTime())) return 'DUE DATE UNAVAILABLE';
  const today = new Date();
  const dayStartDue = new Date(due.getFullYear(), due.getMonth(), due.getDate()).getTime();
  const dayStartToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const diffDays = Math.round((dayStartDue - dayStartToday) / (1000 * 60 * 60 * 24));
  if (diffDays > 0) return `DUE IN ${diffDays} DAY${diffDays > 1 ? 'S' : ''}`;
  if (diffDays === 0) return 'DUE TODAY';
  return `OVERDUE BY ${Math.abs(diffDays)} DAY${Math.abs(diffDays) > 1 ? 'S' : ''}`;
}

export default function Dashboard() {
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [booksBorrowed, setBooksBorrowed] = useState(0);
  const [booksReturned, setBooksReturned] = useState(0);
  const [pendingFine, setPendingFine] = useState(0);
  const [activeLoans, setActiveLoans] = useState<MemberActiveLoan[]>([]);
  const [memberName, setMemberName] = useState('Member');

  const loadDashboard = async () => {
    try {
      const data = await getMemberDashboard();
      setBooksBorrowed(data.booksBorrowed);
      setBooksReturned(data.booksReturned);
      setPendingFine(data.pendingFine);
      setActiveLoans(data.activeLoans);
    } catch (error) {
      console.error('Failed to load member dashboard', error);
    }
  };

  useEffect(() => {
    const raw = localStorage.getItem('lms_auth_session');
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as { name?: string };
        setMemberName(parsed?.name || 'Member');
      } catch {
        setMemberName('Member');
      }
    }
    void loadDashboard();
  }, []);

  const loanCards = useMemo(
    () =>
      activeLoans.map((loan) => ({
        loanId: loan.loanId,
        title: loan.bookTitle,
        author: loan.author,
        tag: 'Loan',
        due: getDueText(loan.dueDate),
      })),
    [activeLoans],
  );

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-4xl">Welcome back, {memberName} 👋</h1>
          <p className="text-sm text-slate-700">Track your current loans and reservations here.</p>
        </div>
        <Button size="sm" className="bg-rose-500 hover:bg-rose-600" onClick={() => setShowReserveModal(true)}>
          Reserve New Books
        </Button>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Books Borrowed" value={String(booksBorrowed)} icon={SquareLibrary} />
        <StatCard label="Books Returned" value={String(booksReturned)} icon={RotateCcw} />
        <StatCard label="Pending Balance" value={`Rs.${pendingFine.toFixed(2)}`} icon={AlertTriangle} />
      </div>

      <h2 className="mb-3 text-2xl font-bold text-slate-800">Active Loans</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {loanCards.map((loan) => (
          <LoanCard key={loan.loanId} title={loan.title} author={loan.author} tag={loan.tag} due={loan.due} />
        ))}
      </div>

      {showReserveModal ? (
        <ReserveBookModal
          onClose={() => setShowReserveModal(false)}
          onReserved={() => {
            void loadDashboard();
          }}
        />
      ) : null}
    </div>
  );
}
