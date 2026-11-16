import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { env } from '../config/env';
import type { AuthTokens } from '../features/auth/types';
import { endpoints } from './endpoints';
import { tokenStorage } from './tokenStorage';

export const api = axios.create({
  baseURL: env.apiUrl,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

// Le store d'authentification s'enregistre ici (évite un import circulaire client <-> store).
let onSessionExpired: (() => void) | null = null;
export function setSessionExpiredHandler(handler: () => void): void {
  onSessionExpired = handler;
}

api.interceptors.request.use(async (config) => {
  const token = await tokenStorage.getAccess();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

async function refreshAccessToken(): Promise<string> {
  const refreshToken = await tokenStorage.getRefresh();
  if (!refreshToken) throw new Error('NO_REFRESH_TOKEN');
  const { data } = await api.post<AuthTokens>(endpoints.auth.refresh, { refreshToken });
  await tokenStorage.save(data);
  return data.accessToken;
}

// Un seul rafraîchissement à la fois, même si plusieurs requêtes échouent en 401 ensemble.
let refreshing: Promise<string> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    // Les appels /auth/* ne sont jamais rejoués (mauvais mot de passe = 401 normal).
    const isAuthCall = original?.url?.includes('/auth/') ?? false;

    if (error.response?.status === 401 && original && !original._retry && !isAuthCall) {
      original._retry = true;
      try {
        refreshing ??= refreshAccessToken().finally(() => {
          refreshing = null;
        });
        const newToken = await refreshing;
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch {
        onSessionExpired?.();
      }
    }
    return Promise.reject(error);
  },
);
