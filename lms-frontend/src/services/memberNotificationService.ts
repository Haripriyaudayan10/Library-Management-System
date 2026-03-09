import api from './api';

export interface MemberNotificationItem {
  id: number;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export async function getMemberNotifications(): Promise<MemberNotificationItem[]> {
  const { data } = await api.get<MemberNotificationItem[]>('/api/member/notifications');
  return Array.isArray(data) ? data : [];
}
