import { api } from '../../api/client';
import { endpoints } from '../../api/endpoints';
import type { AuthResponse, LoginPayload, RegisterPayload, User } from './types';

export const authApi = {
  login: async (payload: LoginPayload) => (await api.post<AuthResponse>(endpoints.auth.login, payload)).data,
  register: async (payload: RegisterPayload) => (await api.post<AuthResponse>(endpoints.auth.register, payload)).data,
  forgotPassword: async (email: string) => {
    await api.post(endpoints.auth.forgotPassword, { email });
  },
  me: async () => (await api.get<User>(endpoints.auth.me)).data,
  logout: async (refreshToken: string | null) => {
    await api.post(endpoints.auth.logout, { refreshToken });
  },
};
