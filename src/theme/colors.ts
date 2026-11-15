/**
 * Palette Biznova.
 *
 * Source de vérité : fichier Figma « Biznova » (écrans 07 à 13, parcours B).
 * Les couleurs sont exposées sous forme de jetons SÉMANTIQUES : un composant ne
 * doit jamais contenir de valeur hexadécimale, il lit toujours `useColors()`.
 */

export interface ThemeColors {
  /** Fond des écrans. */
  background: string;
  /** Fond des cartes et des champs. */
  surface: string;
  /** Fond discret : pistes de jauge, encarts d'information, segments inactifs. */
  surfaceMuted: string;
  /** Filets et bordures. */
  border: string;

  text: string;
  textSecondary: string;

  /** Vert de marque : actions, liens, éléments actifs. */
  primary: string;
  /** Vert profond : bandeaux « héros » (trésorerie, budget, résultat). */
  primaryDeep: string;
  /** Vert très clair : pastilles, recettes, option sélectionnée. */
  primarySoft: string;
  /** Vert menthe : texte secondaire sur fond profond, barres de dépenses. */
  primaryTint: string;
  /** Texte placé sur `primary` / `primaryDeep`. */
  onPrimary: string;
  /** Texte secondaire placé sur `primaryDeep`. */
  onPrimaryMuted: string;

  /** Dépassement de budget, erreurs de saisie. */
  danger: string;
  dangerSoft: string;

  overlay: string;
  statusBar: 'light' | 'dark';
}

export const lightColors: ThemeColors = {
  background: '#F5F7F4',
  surface: '#FFFFFF',
  surfaceMuted: '#EDF1EC',
  border: '#DFE6E0',

  text: '#182E27',
  textSecondary: '#66766E',

  primary: '#145A46',
  primaryDeep: '#103D32',
  primarySoft: '#DDF3E7',
  primaryTint: '#A8DFC0',
  onPrimary: '#FFFFFF',
  onPrimaryMuted: '#A8DFC0',

  danger: '#B54436',
  dangerSoft: '#FDECE8',

  overlay: 'rgba(16, 61, 50, 0.45)',
  statusBar: 'dark',
};

/**
 * Proposition de thème sombre dérivée de la marque.
 * ⚠️ Non validée par la maquette Figma (qui ne couvre que le mode clair) :
 * à faire valider par le design avant toute exposition aux utilisateurs.
 */
export const darkColors: ThemeColors = {
  background: '#0C1A16',
  surface: '#13261F',
  surfaceMuted: '#1A322A',
  border: '#24413A',

  text: '#EEF4F0',
  textSecondary: '#9DB0A7',

  primary: '#5FD1A0',
  primaryDeep: '#0A2E25',
  primarySoft: '#1C3D33',
  primaryTint: '#A8DFC0',
  onPrimary: '#08201A',
  onPrimaryMuted: '#A8DFC0',

  danger: '#F0806F',
  dangerSoft: '#3A1D19',

  overlay: 'rgba(0, 0, 0, 0.6)',
  statusBar: 'light',
};
