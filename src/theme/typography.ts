import type { TextStyle } from 'react-native';

/**
 * Police : Inter (conforme à la maquette Figma).
 * En React Native, chaque graisse correspond à une famille distincte :
 * on n'utilise donc jamais `fontWeight` avec ces familles.
 */
export const fontFamily = {
  regular: 'Inter_400Regular',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

export type TextVariant =
  | 'display'
  | 'title'
  | 'metric'
  | 'heading'
  | 'brand'
  | 'eyebrow'
  | 'lead'
  | 'body'
  | 'bodyStrong'
  | 'valueStrong'
  | 'label'
  | 'caption'
  | 'captionStrong'
  | 'small'
  | 'smallStrong'
  | 'micro'
  | 'microStrong'
  | 'chart';

/** Échelle typographique, une entrée par style réellement utilisé dans la maquette. */
export const textStyles: Record<TextVariant, TextStyle> = {
  display: { fontFamily: fontFamily.regular, fontSize: 36, lineHeight: 42, letterSpacing: -1.4 },
  title: { fontFamily: fontFamily.regular, fontSize: 28, lineHeight: 32, letterSpacing: -1 },
  metric: { fontFamily: fontFamily.regular, fontSize: 22, lineHeight: 28, letterSpacing: -0.7 },
  heading: { fontFamily: fontFamily.regular, fontSize: 17, lineHeight: 22 },
  brand: { fontFamily: fontFamily.bold, fontSize: 20, lineHeight: 24, letterSpacing: -0.7 },
  eyebrow: {
    fontFamily: fontFamily.bold,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
  },
  lead: { fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 22 },
  body: { fontFamily: fontFamily.regular, fontSize: 13, lineHeight: 18 },
  bodyStrong: { fontFamily: fontFamily.semibold, fontSize: 14, lineHeight: 20 },
  valueStrong: { fontFamily: fontFamily.bold, fontSize: 14, lineHeight: 20 },
  label: { fontFamily: fontFamily.semibold, fontSize: 13, lineHeight: 18 },
  caption: { fontFamily: fontFamily.regular, fontSize: 12, lineHeight: 18 },
  captionStrong: { fontFamily: fontFamily.semibold, fontSize: 12, lineHeight: 18 },
  small: { fontFamily: fontFamily.regular, fontSize: 11, lineHeight: 15 },
  smallStrong: { fontFamily: fontFamily.semibold, fontSize: 11, lineHeight: 15 },
  micro: { fontFamily: fontFamily.regular, fontSize: 10, lineHeight: 14 },
  microStrong: { fontFamily: fontFamily.bold, fontSize: 10, lineHeight: 14 },
  chart: { fontFamily: fontFamily.regular, fontSize: 9, lineHeight: 12 },
};
