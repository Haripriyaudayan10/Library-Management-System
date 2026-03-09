import api from './api';

export interface MemberItem {
  userid: string;
  name: string;
  email: string;
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
