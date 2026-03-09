import api from './api';

export interface FineLoanUser {
  userId?: string;
  name?: string;
  email?: string;
}

export interface FineLoan {
  loanId?: number;
  user?: FineLoanUser;
}

export interface FineItem {
  fineId: number;
  loan?: FineLoan;
  amount: number;
  paid: boolean;
  paidDate?: string | null;
}

export async function getFines(): Promise<FineItem[]> {
  const { data } = await api.get<FineItem[]>('/api/admin/fines');
  return Array.isArray(data) ? data : [];
}

export async function markFinePaid(fineId: number): Promise<void> {
  await api.put(`/api/admin/fines/${fineId}`);
}
