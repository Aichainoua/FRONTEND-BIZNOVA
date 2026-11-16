import { create } from 'zustand';
import { setSessionExpiredHandler } from '../api/client';
import { queryClient } from '../api/queryClient';
import { tokenStorage } from '../api/tokenStorage';
import { authApi } from '../features/auth/api';
import type { LoginPayload, RegisterPayload, User } from '../features/auth/types';
import { getStatus } from '../utils/errors';

type Status = 'loading' | 'signedOut' | 'signedIn';

interface AuthState {
  status: Status;
  user: User | null;
  restoreSession: () => Promise<void>;
  signIn: (payload: LoginPayload) => Promise<void>;
  signUp: (payload: RegisterPayload) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  status: 'loading',
  user: null,

  async restoreSession() {
    try {
      const token = await tokenStorage.getAccess();
      if (!token) {
        set({ status: 'signedOut', user: null });
        return;
      }
      const user = await authApi.me();
      set({ status: 'signedIn', user });
    } catch (error) {
      // Session refusée : on efface. Simple coupure réseau : on garde les tokens pour la prochaine fois.
      if (getStatus(error) === 401) await tokenStorage.clear();
      set({ status: 'signedOut', user: null });
    }
  },

  async signIn(payload) {
    const { user, ...tokens } = await authApi.login(payload);
    await tokenStorage.save(tokens);
    set({ status: 'signedIn', user });
  },

  async signUp(payload) {
    const { user, ...tokens } = await authApi.register(payload);
    await tokenStorage.save(tokens);
    set({ status: 'signedIn', user });
  },

  async signOut() {
    try {
      await authApi.logout(await tokenStorage.getRefresh());
    } catch {
      // Déconnexion locale quoi qu'il arrive.
    }
    await tokenStorage.clear();
    queryClient.clear(); // aucune donnée d'un utilisateur ne doit rester pour le suivant
    set({ status: 'signedOut', user: null });
  },
}));

setSessionExpiredHandler(() => {
  void useAuthStore.getState().signOut();
});
