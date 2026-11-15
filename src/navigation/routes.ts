/**
 * Noms de routes de l'application.
 * Toujours référencer ces constantes (jamais de chaîne libre) pour que
 * le typage de React Navigation détecte les fautes de frappe.
 */

/** Onglets de la barre de navigation principale. */
export const TABS = {
  HOME: 'Home',
  PROJECTS: 'Projects',
  BUSINESS: 'Business',
  REPORTS: 'Reports',
} as const;

/** Écrans de la pile « Entreprise » (parcours B). */
export const BUSINESS_SCREENS = {
  SETUP: 'BusinessSetup',
  DASHBOARD: 'Dashboard',
  OPERATIONS: 'Operations',
  ADD_OPERATION: 'AddOperation',
  BUDGET: 'Budget',
} as const;

/** Écrans de la pile racine (avant / après connexion). */
export const ROOT_SCREENS = {
  LOGIN: 'Login',
  MAIN: 'Main',
} as const;
