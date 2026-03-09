import api from './api';

export interface ReservationItem {
  reservationId: number;
  userId: string;
  userName: string;
  bookId: number;
  bookTitle: string;
  reservationDate: string;
  status: string;
}

export async function getReservations(): Promise<ReservationItem[]> {
  const { data } = await api.get<ReservationItem[]>('/api/admin/reservations');
  return Array.isArray(data) ? data : [];
}
