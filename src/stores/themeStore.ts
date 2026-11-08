import { create } from 'zustand';
import { lightColors, darkColors, type ThemeColors } from '../theme/colors';

export type ThemeMode = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: 'light', // Mode clair par défaut
  colors: lightColors,

  setTheme: (mode) => {
    set({
      mode,
      colors: mode === 'dark' ? darkColors : lightColors,
    });
  },

  toggleTheme: () => {
    const next = get().mode === 'light' ? 'dark' : 'light';
    get().setTheme(next);
  },
}));
