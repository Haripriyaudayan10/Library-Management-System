import api from './api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: string | number;
  name: string;
  role: string;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const payload: LoginRequest = { email, password };
  const { data } = await api.post<LoginResponse>('/api/auth/login', payload);
  return data;
}
