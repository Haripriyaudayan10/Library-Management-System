import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisible?: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisible = 8,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const safeCurrent = Math.min(Math.max(currentPage, 1), totalPages);
  const visible = Math.min(maxVisible, totalPages);
  const half = Math.floor(visible / 2);

  let start = Math.max(1, safeCurrent - half);
  let end = start + visible - 1;

  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, end - visible + 1);
  }

  const pages = Array.from({ length: end - start + 1 }, (_, idx) => start + idx);

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        className="h-10 w-10 rounded-xl border border-slate-200 bg-white text-slate-500 disabled:opacity-40 disabled:hover:translate-y-0"
        disabled={safeCurrent === 1}
        onClick={() => onPageChange(Math.max(1, safeCurrent - 1))}
        aria-label="Previous page"
      >
        <ChevronLeft size={18} className="mx-auto" />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          className={`h-10 min-w-10 rounded-xl border px-3 text-sm font-semibold ${
            page === safeCurrent
              ? 'border-blue-500 bg-blue-500 text-white'
              : 'border-slate-200 bg-white text-slate-700'
          }`}
          onClick={() => onPageChange(page)}
          aria-label={`Page ${page}`}
          aria-current={page === safeCurrent ? 'page' : undefined}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        className="h-10 w-10 rounded-xl border border-slate-200 bg-white text-slate-500 disabled:opacity-40 disabled:hover:translate-y-0"
        disabled={safeCurrent === totalPages}
        onClick={() => onPageChange(Math.min(totalPages, safeCurrent + 1))}
        aria-label="Next page"
      >
        <ChevronRight size={18} className="mx-auto" />
      </button>
    </div>
  );
}
