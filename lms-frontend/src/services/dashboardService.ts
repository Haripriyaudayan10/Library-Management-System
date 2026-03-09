import api from './api';

export interface AdminDashboardStats {
  totalBooks: number;
  totalCopies: number;
  availableCopies: number;
  totalMembers: number;
  activeLoans: number;
  waitingReservations: number;
}

export async function getAdminDashboard(): Promise<AdminDashboardStats> {
  const { data } = await api.get<AdminDashboardStats>('/api/admin/dashboard');
  return {
    totalBooks: data?.totalBooks ?? 0,
    totalCopies: data?.totalCopies ?? 0,
    availableCopies: data?.availableCopies ?? 0,
    totalMembers: data?.totalMembers ?? 0,
    activeLoans: data?.activeLoans ?? 0,
    waitingReservations: data?.waitingReservations ?? 0,
  };
}
