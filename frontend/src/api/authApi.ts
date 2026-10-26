import { apiFetch, jsonBody } from './client';
import type { User, UserRole } from '../types/api';

export type LoginInput = { email: string; password: string };
export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  PhoneNumber?: string;
  address: string;
};
export type LoginResponse = { token: string; role: UserRole };

export const authApi = {
  login: (input: LoginInput) =>
    apiFetch<LoginResponse>('/users/login', {
      method: 'POST',
      body: jsonBody(input),
    }),
  register: (input: RegisterInput) =>
    apiFetch<User>('/users/register', {
      method: 'POST',
      body: jsonBody(input),
    }),
  me: () => apiFetch<User>('/users/me'),
};
