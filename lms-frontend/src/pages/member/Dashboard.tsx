import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, RotateCcw, SquareLibrary } from 'lucide-react';

import LoanCard from '../../components/common/LoanCard';
import { Button } from '../../components/ui/Button';
import { StatCard } from '../../components/ui/StatCard';

import ReserveBookModal from './ReserveBookModal';

import {
  getMemberDashboard,
  searchMemberBooks,
  type MemberActiveLoan,
  type MemberCurrentReservation,
  type MemberBookSearchItem
} from '../../services/memberPortalService';
import { resolveBookCoverMap } from '../../services/bookCoverService';

import SearchSuggestInput, {
  type SearchSuggestionItem
} from '../../components/common/SearchSuggestInput';
import { useDebouncedValue } from '../../lib/useDebouncedValue';


function getDueText(dueDate: string): string {

  const due = new Date(dueDate);

  if (Number.isNaN(due.getTime())) return 'DUE DATE UNAVAILABLE';

  const today = new Date();

  const dayStartDue = new Date(
    due.getFullYear(),
    due.getMonth(),
    due.getDate()
  ).getTime();

  const dayStartToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  ).getTime();

  const diffDays = Math.round(
    (dayStartDue - dayStartToday) / (1000 * 60 * 60 * 24)
  );

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
  const [currentReservations, setCurrentReservations] = useState<MemberCurrentReservation[]>([]);

  const [memberName, setMemberName] = useState('Member');


  // SEARCH
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 425);
  const effectiveSearchTerm = searchTerm.trim() === '' ? '' : debouncedSearchTerm;
  const [searchResults, setSearchResults] = useState<MemberBookSearchItem[]>([]);
  const [bookCoverMap, setBookCoverMap] = useState<Record<string, string>>({});



  const loadDashboard = async () => {

    try {

      const data = await getMemberDashboard();

      setBooksBorrowed(data.booksBorrowed);
      setBooksReturned(data.booksReturned);
      setPendingFine(data.pendingFine);

      setActiveLoans(data.activeLoans);
      setCurrentReservations(data.currentReservations);

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



  useEffect(() => {
    const q = effectiveSearchTerm.trim();
    if (!q) {
      setSearchResults([]);
      return;
    }

    let active = true;
    const loadSearchResults = async () => {
      try {
        const results = await searchMemberBooks(q);
        if (!active) return;
        setSearchResults(results);
      } catch (error) {
        console.error('Search failed', error);
        if (!active) return;
        setSearchResults([]);
      }
    };

    void loadSearchResults();
    return () => {
      active = false;
    };
  }, [effectiveSearchTerm]);



  const searchSuggestions = useMemo<SearchSuggestionItem[]>(() => {

    const q = effectiveSearchTerm.trim().toLowerCase();

    if (!q) return [];

    return searchResults
      .slice(0, 10)
      .map((book) => ({
        id: String(book.bookId),
        label: `${book.title} (${book.author})`,
        value: book.title
      }));

  }, [searchResults, effectiveSearchTerm]);



  const loanCards = useMemo(

    () =>

      activeLoans.map((loan) => ({

        loanId: loan.loanId,

        title: loan.bookTitle,

        author: loan.author,
        coverImageUrl: loan.coverImageUrl,

        tag: 'Loan',

        due: getDueText(loan.dueDate)

      })),

    [activeLoans]

  );



  const reservationCards = useMemo(

    () =>

      currentReservations.map((reservation) => ({

        reservationId: reservation.reservationId,

        title: reservation.bookTitle,

        author: reservation.author,
        coverImageUrl: reservation.coverImageUrl,

        tag: 'Reservation',

        due: reservation.status.replaceAll('_', ' ')

      })),

    [currentReservations]

  );

  useEffect(() => {
    let active = true;

    const resolveCovers = async () => {
      const coverInputs = [
        ...loanCards.map((loan) => ({
          id: `loan-${loan.loanId}`,
          title: loan.title,
          author: loan.author,
          existingUrl: loan.coverImageUrl,
        })),
        ...reservationCards.map((reservation) => ({
          id: `reservation-${reservation.reservationId}`,
          title: reservation.title,
          author: reservation.author,
          existingUrl: reservation.coverImageUrl,
        })),
        ...searchResults.map((book) => ({
          id: `search-${book.bookId}`,
          title: book.title,
          author: book.author,
          existingUrl: book.coverImageUrl,
        })),
      ];

      if (coverInputs.length === 0) return;
      const map = await resolveBookCoverMap(coverInputs);
      if (!active) return;
      setBookCoverMap((prev) => ({ ...prev, ...map }));
    };

    void resolveCovers();
    return () => {
      active = false;
    };
  }, [loanCards, reservationCards, searchResults]);



  return (

    <div>

      {/* HEADER */}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

        <div>

          <h1 className="text-2xl font-bold text-slate-900 sm:text-4xl">

            Welcome back, {memberName} 👋

          </h1>

          <p className="text-sm text-slate-700">

            Track your current loans and reservations here.

          </p>

        </div>

        <Button
          size="sm"
          className="bg-rose-500 hover:bg-rose-600"
          onClick={() => setShowReserveModal(true)}
        >
          Reserve New Books
        </Button>

      </div>



      {/* SEARCH BAR */}

      <div className="mb-6 max-w-xl">

        <SearchSuggestInput
          className="w-full"
          value={searchTerm}
          placeholder="Search books, authors or categories..."
          suggestions={searchSuggestions}
          onChange={setSearchTerm}
          onSelect={(item) => setSearchTerm(item.value)}
        />

      </div>



      {/* SEARCH RESULTS */}

      {searchResults.length > 0 && (

        <>

          <h2 className="mb-3 text-2xl font-bold text-slate-800">

            Search Results

          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

            {searchResults.map((book) => (

              <LoanCard
                key={book.bookId}
                title={book.title}
                author={book.author}
                tag={book.category}
                due={`Available Copies: ${book.availableCopies}`}
                cover={bookCoverMap[`search-${book.bookId}`]}
              />

            ))}

          </div>

        </>

      )}



      {/* STATS */}

      <div className="mb-5 mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

        <StatCard
          label="Books Borrowed"
          value={String(booksBorrowed)}
          icon={SquareLibrary}
        />

        <StatCard
          label="Books Returned"
          value={String(booksReturned)}
          icon={RotateCcw}
        />

        <StatCard
          label="Pending Balance"
          value={`Rs.${pendingFine.toFixed(2)}`}
          icon={AlertTriangle}
        />

      </div>



      {/* ACTIVE LOANS */}

      <h2 className="mb-3 text-2xl font-bold text-slate-800">

        Active Loans

      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

        {loanCards.map((loan) => (

          <LoanCard
            key={loan.loanId}
            title={loan.title}
            author={loan.author}
            tag={loan.tag}
            due={loan.due}
            cover={bookCoverMap[`loan-${loan.loanId}`]}
          />

        ))}

      </div>



      {/* RESERVATIONS */}

      <h2 className="mb-3 mt-6 text-2xl font-bold text-slate-800">

        Current Reservation

      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

        {reservationCards.map((reservation) => (

          <LoanCard
            key={reservation.reservationId}
            title={reservation.title}
            author={reservation.author}
            tag={reservation.tag}
            due={reservation.due}
            cover={bookCoverMap[`reservation-${reservation.reservationId}`]}
          />

        ))}

      </div>



      {showReserveModal && (

        <ReserveBookModal
          onClose={() => setShowReserveModal(false)}
          onReserved={() => {
            void loadDashboard();
          }}
        />

      )}

    </div>

  );

}
