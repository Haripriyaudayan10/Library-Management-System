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
  profileImageUrl?: string;
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

export async function createLoan(copyId: number, userId: string): Promise<LoanItem> {
  const { data } = await api.post<LoanItem>('/api/admin/loans', null, {
    params: { copyId, userId },
  });
  return data;
}

export async function returnLoan(loanId: number): Promise<LoanItem> {
  const { data } = await api.put<LoanItem>(`/api/admin/loans/${loanId}/return`);
  return data;
}

export async function reissueLoan(loanId: number, newDueDate: string): Promise<LoanItem> {
  const { data } = await api.patch<LoanItem>(`/api/admin/loans/${loanId}`, null, {
    params: { newDueDate },
  });
  return data;
}
