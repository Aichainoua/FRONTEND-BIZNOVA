import { create } from 'zustand';

/**
 * Session utilisateur.
 *
 * TODO(auth) : l'authentification réelle (API, jeton stocké de façon sécurisée,
 * persistance entre deux lancements — critère de recette R9) n'est pas encore
 * développée. Pour l'instant, la session ne vit qu'en mémoire et toute adresse
 * e-mail valide ouvre l'application. Seule l'interface de ce store doit rester stable.
 */
interface SessionState {
  status: 'signedOut' | 'signedIn';
  email: string | null;
  signIn: (email: string) => void;
  signOut: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  status: 'signedOut',
  email: null,
  signIn: (email) => set({ status: 'signedIn', email }),
  signOut: () => set({ status: 'signedOut', email: null }),
}));
