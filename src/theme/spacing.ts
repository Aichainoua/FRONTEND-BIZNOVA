/** Échelle d'espacement (px). Issue des marges relevées dans la maquette. */
export const spacing = {
  xxs: 4,
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

/** Rayons de bordure. */
export const radius = {
  xs: 4,
  sm: 6,
  md: 10,
  lg: 12,
  xl: 16,
  xxl: 20,
  pill: 100,
} as const;

/** Dimensions structurantes du layout mobile. */
export const layout = {
  screenPadding: 24,
  cardPadding: 18,
  controlHeight: 52,
  tabBarHeight: 76,
  minTouchTarget: 44,
} as const;

/** Ombres (une seule dans la maquette : bouton d'export du rapport). */
export const shadows = {
  elevatedAction: {
    shadowColor: '#145A46',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 6,
  },
} as const;
