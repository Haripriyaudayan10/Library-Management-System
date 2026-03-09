export type UserRole = 'ADMIN' | 'MEMBER';

export interface LoginResult {
  token: string;
  userId: string;
  name: string;
  role: UserRole;
  email: string;
  profileImageUrl?: string;
  isDummy?: boolean;
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

interface BackendLoginResponse {
  token: string;
  userId: string;
  name: string;
  role: string;
  profileImageUrl?: string;
}

export const DUMMY_ADMIN = {
  email: 'admin@readsphere.com',
  password: 'Admin@123',
  name: 'Sudarshana',
  role: 'ADMIN' as const,
};

export const DUMMY_MEMBER = {
  email: 'member@readsphere.com',
  password: 'Member@123',
  name: 'Hari',
  role: 'MEMBER' as const,
};

export async function loginWithBackend(body: LoginRequestBody): Promise<LoginResult> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error('Invalid email or password');
  }

  const data = (await response.json()) as BackendLoginResponse;
  const roleUpper = String(data.role ?? '').toUpperCase();

  if (roleUpper !== 'ADMIN' && roleUpper !== 'MEMBER') {
    throw new Error('Unsupported role from backend');
  }

  return {
    token: data.token,
    userId: String(data.userId),
    name: data.name,
    role: roleUpper,
    email: body.email,
    profileImageUrl: data.profileImageUrl,
  };
}

export function loginWithDummy(body: LoginRequestBody): LoginResult | null {
  if (body.email === DUMMY_ADMIN.email && body.password === DUMMY_ADMIN.password) {
    return {
      token: 'dummy-admin-token',
      userId: '00000000-0000-0000-0000-000000000001',
      name: DUMMY_ADMIN.name,
      role: DUMMY_ADMIN.role,
      email: DUMMY_ADMIN.email,
      isDummy: true,
    };
  }

  if (body.email === DUMMY_MEMBER.email && body.password === DUMMY_MEMBER.password) {
    return {
      token: 'dummy-member-token',
      userId: '00000000-0000-0000-0000-000000000002',
      name: DUMMY_MEMBER.name,
      role: DUMMY_MEMBER.role,
      email: DUMMY_MEMBER.email,
      isDummy: true,
    };
  }

  return null;
}
