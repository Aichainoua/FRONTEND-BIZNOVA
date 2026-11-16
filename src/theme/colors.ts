export type ThemeColors = {
  background: string;
  surface: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
  primaryDark: string;
  primaryLight: string;
  accent: string;
  danger: string;
  dangerLight: string;
  warning: string;
  warningLight: string;
  success: string;
  successLight: string;
  statusBar: 'dark' | 'light';
};

export const lightColors: ThemeColors = {
  background: '#FFFFFF',
  surface: '#F8FAFC',
  card: '#FFFFFF',
  text: '#0F172A',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  primary: '#0284C7',
  primaryDark: '#0369A1',
  primaryLight: '#E0F2FE',
  accent: '#059669',
  danger: '#E11D48',
  dangerLight: '#FFE4E6',
  warning: '#D97706',
  warningLight: '#FEF3C7',
  success: '#059669',
  successLight: '#D1FAE5',
  statusBar: 'dark',
};

export const darkColors: ThemeColors = {
  background: '#0F172A',
  surface: '#1E293B',
  card: '#1E293B',
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  border: '#334155',
  primary: '#38BDF8',
  primaryDark: '#0284C7',
  primaryLight: '#082F49',
  accent: '#10B981',
  danger: '#F43F5E',
  dangerLight: '#881337',
  warning: '#F59E0B',
  warningLight: '#78350F',
  success: '#10B981',
  successLight: '#064E3B',
  statusBar: 'light',
};
