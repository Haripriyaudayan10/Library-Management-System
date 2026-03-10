import api from './api';

export interface MemberItem {
  userid: string;
  name: string;
  email: string;
  profileImageUrl?: string;
  suspended?: boolean;
}

export interface CreateMemberPayload {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface MemberPageResult {
  content: MemberItem[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export async function getMembers(page = 0, size = 10): Promise<MemberPageResult> {
  const { data } = await api.get<PagedResponse<MemberItem>>('/api/admin/users', {
    params: { page, size, role: 'MEMBER' },
  });

  return {
    content: data?.content ?? [],
    totalElements: data?.totalElements ?? 0,
    totalPages: data?.totalPages ?? 0,
    page: data?.number ?? page,
    size: data?.size ?? size,
  };
}

export async function createMember(payload: CreateMemberPayload): Promise<MemberItem> {
  const { data } = await api.post<MemberItem>('/api/admin/users', payload);
  return data;
}

export async function uploadMemberProfileImage(userId: string, file: File): Promise<MemberItem> {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post<MemberItem>(`/api/admin/users/${userId}/profile-image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
}

export interface UpdateMemberPayload {
  name?: string;
  suspended?: boolean;
}

export async function updateMember(userId: string, payload: UpdateMemberPayload): Promise<MemberItem> {
  const { data } = await api.put<MemberItem>('/api/admin/users', payload, { params: { userId } });
  return data;
}

export async function deleteMember(userId: string): Promise<void> {
  await api.delete('/api/admin/users', { params: { userId } });
}
