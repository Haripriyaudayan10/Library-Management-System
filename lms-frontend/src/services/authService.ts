import api from './api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  userId: string | number;
  name: string;
  email: string;
  role: string;
  profileImageUrl?: string;
}

export async function initializeCsrf(): Promise<void> {
  await api.get('/api/auth/csrf');
}

export async function login(email: string, password: string): Promise<AuthUser> {
  const payload: LoginRequest = { email, password };
  const { data } = await api.post<AuthUser>('/api/auth/login', payload);
  return data;
}

export async function getCurrentUser(): Promise<AuthUser> {
  const { data } = await api.get<AuthUser>('/api/auth/me');
  return data;
}

export async function refreshAuth(): Promise<AuthUser> {
  const { data } = await api.post<AuthUser>('/api/auth/refresh');
  return data;
}

export async function logout(): Promise<void> {
  await api.post('/api/auth/logout');
}

export async function tryGetCurrentUser(): Promise<AuthUser | null> {
  try {
    return await getCurrentUser();
  } catch {
    return null;
  }
}

export async function loginWithCsrf(email: string, password: string): Promise<AuthUser> {
  await initializeCsrf();
  const data = await login(email, password);
  return data;
}
