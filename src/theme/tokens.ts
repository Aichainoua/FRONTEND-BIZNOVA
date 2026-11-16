import type { TextStyle } from 'react-native';

// Valeurs estimées à partir des maquettes. À remplacer par les codes exacts du designer
// (et à aligner avec F2, propriétaire du design system).
export const colors = {
  background: '#F1F6F2',
  surface: '#FFFFFF',
  primary: '#0E5C45',
  primaryPressed: '#0A4A38',
  primarySoft: '#E3EFE8',
  primaryBorder: '#9CC3B1',
  text: '#14261E',
  textMuted: '#52645A',
  textOnPrimary: '#FFFFFF',
  textOnPrimaryMuted: '#BFDACB',
  border: '#DCE6DF',
  borderStrong: '#B8CBBF',
  placeholder: '#7C8B83',
  warningBg: '#FFF4E0',
  warningBorder: '#F1C77A',
  warningText: '#7A4A00',
  dangerBg: '#FDECEA',
  dangerBorder: '#F0A9A2',
  dangerText: '#A3261B',
  infoBg: '#E8F1EC',
  infoBorder: '#C5DACE',
  successBg: '#E3F3E8',
} as const;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const radius = { sm: 8, md: 14, lg: 20, pill: 999 } as const;

const weight = (w: TextStyle['fontWeight']) => w;

export const typography = {
  eyebrow: { fontSize: 12, fontWeight: weight('700'), letterSpacing: 1.1, textTransform: 'uppercase' as const, color: colors.primary },
  title: { fontSize: 28, lineHeight: 34, fontWeight: weight('800'), color: colors.text },
  subtitle: { fontSize: 15, lineHeight: 22, color: colors.textMuted },
  sectionTitle: { fontSize: 18, lineHeight: 24, fontWeight: weight('700'), color: colors.text },
  label: { fontSize: 14, fontWeight: weight('700'), color: colors.text },
  body: { fontSize: 15, lineHeight: 22, color: colors.text },
  helper: { fontSize: 12.5, lineHeight: 18, color: colors.textMuted },
  kpi: { fontSize: 26, lineHeight: 32, fontWeight: weight('800'), color: colors.text },
  hero: { fontSize: 40, lineHeight: 46, fontWeight: weight('800'), color: colors.textOnPrimary },
} as const;
