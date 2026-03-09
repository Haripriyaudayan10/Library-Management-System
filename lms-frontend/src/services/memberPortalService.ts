import api from './api';

export interface MemberActiveLoan {
  loanId: number;
  bookTitle: string;
  author: string;
  dueDate: string;
}

export interface MemberCurrentReservation {
  reservationId: number;
  bookTitle: string;
  author: string;
  status: string;
  reservationDate: string;
}

export interface MemberDashboardData {
  booksBorrowed: number;
  booksReturned: number;
  pendingFine: number;
  activeLoans: MemberActiveLoan[];
  currentReservations: MemberCurrentReservation[];
}

export interface MemberBookSearchItem {
  bookId: number;
  title: string;
  author: string;
  category: string;
  availableCopies: number;
}

export interface MemberProfileData {
  userId: string;
  name: string;
  email: string;
  phoneNumber?: string;
  about?: string;
  profileImageUrl?: string;
}

export async function getMemberDashboard(): Promise<MemberDashboardData> {
  const { data } = await api.get<MemberDashboardData>('/api/member/dashboard');
  return {
    booksBorrowed: Number(data?.booksBorrowed ?? 0),
    booksReturned: Number(data?.booksReturned ?? 0),
    pendingFine: Number(data?.pendingFine ?? 0),
    activeLoans: Array.isArray(data?.activeLoans) ? data.activeLoans : [],
    currentReservations: Array.isArray(data?.currentReservations) ? data.currentReservations : [],
  };
}

export async function searchMemberBooks(keyword: string): Promise<MemberBookSearchItem[]> {
  const { data } = await api.get<MemberBookSearchItem[]>('/api/member/books/search', {
    params: { keyword },
  });
  return Array.isArray(data) ? data : [];
}

export async function reserveMemberBook(bookId: number): Promise<string> {
  const { data } = await api.post(`/api/member/reservations/${bookId}`);
  return typeof data === 'string' ? data : 'Reservation processed.';
}

export async function getMemberProfile(): Promise<MemberProfileData> {
  const { data } = await api.get<MemberProfileData>('/api/member/profile');
  return data;
}

export async function updateMemberProfile(payload: {
  phoneNumber?: string;
  about?: string;
}): Promise<MemberProfileData> {
  const { data } = await api.put<MemberProfileData>('/api/member/profile', payload);
  return data;
}

export async function uploadOwnProfileImage(file: File): Promise<MemberProfileData> {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post<MemberProfileData>('/api/member/profile/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}
