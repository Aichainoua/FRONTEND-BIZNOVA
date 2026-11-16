import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import type { AuthTokens } from '../features/auth/types';

const ACCESS_KEY = 'biznova.access_token';
const REFRESH_KEY = 'biznova.refresh_token';

type WebStorage = { getItem(k: string): string | null; setItem(k: string, v: string): void; removeItem(k: string): void };
// Web : uniquement pour tester dans le navigateur. Sur mobile, SecureStore reste utilisé.
const web = (globalThis as unknown as { localStorage?: WebStorage }).localStorage;
const isWeb = Platform.OS === 'web';

const read = async (key: string) => (isWeb ? web?.getItem(key) ?? null : SecureStore.getItemAsync(key));
const write = async (key: string, value: string) => {
  if (isWeb) web?.setItem(key, value);
  else await SecureStore.setItemAsync(key, value);
};
const remove = async (key: string) => {
  if (isWeb) web?.removeItem(key);
  else await SecureStore.deleteItemAsync(key);
};

export const tokenStorage = {
  getAccess: () => read(ACCESS_KEY),
  getRefresh: () => read(REFRESH_KEY),
  async save(tokens: AuthTokens): Promise<void> {
    await write(ACCESS_KEY, tokens.accessToken);
    await write(REFRESH_KEY, tokens.refreshToken);
  },
  async clear(): Promise<void> {
    await remove(ACCESS_KEY);
    await remove(REFRESH_KEY);
  },
};