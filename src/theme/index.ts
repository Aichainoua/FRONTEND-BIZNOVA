import { useThemeStore } from '../stores/themeStore';
import type { ThemeColors } from './colors';

export { lightColors, darkColors } from './colors';
export type { ThemeColors } from './colors';
export { spacing, radius, layout, shadows } from './spacing';
export { fontFamily, textStyles } from './typography';
export type { TextVariant } from './typography';

/** Accès aux couleurs du thème courant. */
export const useColors = (): ThemeColors => useThemeStore((state) => state.colors);
