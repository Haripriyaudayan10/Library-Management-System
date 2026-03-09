import api from './api';

export interface LoanCopyBook {
  bookId?: number;
  title?: string;
  authorName?: string;
}

export interface LoanCopy {
  copyid?: number;
  status?: string;
  book?: LoanCopyBook;
}

export interface LoanUser {
  userId?: string;
  name?: string;
  email?: string;
}

export interface LoanItem {
  loanId: number;
  copy?: LoanCopy;
  user?: LoanUser;
  issueDate?: string;
  dueDate?: string;
  returnDate?: string | null;
  status?: string;
}

export async function getLoans(): Promise<LoanItem[]> {
  const { data } = await api.get<LoanItem[]>('/api/admin/loans');
  return Array.isArray(data) ? data : [];
}
