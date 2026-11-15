import { initialsOf } from './format';

export interface UserIdentity {
  /** Prénom affiché dans les messages d'accueil (vide si indéterminable). */
  firstName: string;
  /** Initiales de l'avatar (2 lettres max). */
  initials: string;
}

const NAME_PART = /^[A-Za-zÀ-ÿ]+$/;

/**
 * Déduit une identité d'affichage d'une adresse e-mail de type « prenom.nom@domaine ».
 * Solution transitoire : à remplacer par le profil renvoyé par l'API (voir `sessionStore`).
 */
export const identityFromEmail = (email: string | null): UserIdentity => {
  const local = (email ?? '').split('@')[0] ?? '';
  const parts = local.split(/[._-]+/).filter((part) => NAME_PART.test(part));
  const first = parts[0] ?? '';

  return {
    firstName: first ? first.charAt(0).toUpperCase() + first.slice(1).toLowerCase() : '',
    initials: initialsOf(parts.join(' ')) || 'BN',
  };
};
