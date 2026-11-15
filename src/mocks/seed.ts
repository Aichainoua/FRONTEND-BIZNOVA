/**
 * Jeu de données de démonstration — reproduit exactement les chiffres de la
 * maquette Figma (entreprise « Nova Studio », septembre et octobre 2026).
 *
 * Activation : `EXPO_PUBLIC_SEED_DATA=true` (voir `.env.example`).
 * Ce fichier est supprimé dès que l'API réelle est branchée.
 *
 * Contrôles de cohérence avec la maquette :
 *  - Septembre : recettes 1 100 000 − dépenses 920 000 = +180 000 ; budget 800 000 → dépassement 120 000 (115 %).
 *  - Octobre   : recettes 1 500 000 − dépenses 600 000 = +900 000 ; budget consommé 75 % ; trésorerie 2 100 000.
 */
import type { Business, Operation } from '../domain/types';

/** Mois de référence du jeu de données (la maquette présente octobre 2026). */
export const SEED_REFERENCE_MONTH = '2026-10';

export const seedBusiness: Business = {
  name: 'Nova Studio',
  sector: 'it_services',
  trackingStart: '2026-09-01',
  monthlyBudget: 800_000,
  initialCash: 1_020_000,
};

export const seedOperations: Operation[] = [
  // Septembre 2026
  { id: 'seed-09-01', type: 'income', amount: 700_000, date: '2026-09-05', categoryId: 'services', description: 'Développement application mobile', tags: ['Client Teranga'] },
  { id: 'seed-09-02', type: 'income', amount: 400_000, date: '2026-09-22', categoryId: 'services', description: 'Refonte de site', tags: [] },
  { id: 'seed-09-03', type: 'expense', amount: 250_000, date: '2026-09-04', categoryId: 'rent', description: 'Location du bureau', tags: ['Récurrent'] },
  { id: 'seed-09-04', type: 'expense', amount: 300_000, date: '2026-09-10', categoryId: 'equipment', description: 'Achat de serveur', tags: [] },
  { id: 'seed-09-05', type: 'expense', amount: 120_000, date: '2026-09-20', categoryId: 'software', description: 'Abonnements logiciels', tags: ['Récurrent'] },
  { id: 'seed-09-06', type: 'expense', amount: 80_000, date: '2026-09-26', categoryId: 'telecom', description: 'Connexion internet', tags: [] },
  { id: 'seed-09-07', type: 'expense', amount: 170_000, date: '2026-09-28', categoryId: 'marketing', description: 'Campagne de communication', tags: ['Projet boutique'] },

  // Octobre 2026
  { id: 'seed-10-01', type: 'income', amount: 150_000, date: '2026-10-27', categoryId: 'services', description: 'Maintenance mensuelle', tags: ['Récurrent', 'Client Teranga'] },
  { id: 'seed-10-02', type: 'expense', amount: 80_000, date: '2026-10-26', categoryId: 'telecom', description: 'Connexion internet', tags: [] },
  { id: 'seed-10-03', type: 'expense', amount: 120_000, date: '2026-10-20', categoryId: 'software', description: 'Abonnements logiciels', tags: ['Récurrent'] },
  { id: 'seed-10-04', type: 'income', amount: 450_000, date: '2026-10-17', categoryId: 'services', description: 'Site e-commerce', tags: ['Projet boutique'] },
  { id: 'seed-10-05', type: 'expense', amount: 150_000, date: '2026-10-12', categoryId: 'equipment', description: 'Achat de matériel', tags: [] },
  { id: 'seed-10-06', type: 'income', amount: 900_000, date: '2026-10-09', categoryId: 'services', description: 'Création de site web', tags: ['Client Teranga', 'Projet vitrine'] },
  { id: 'seed-10-07', type: 'expense', amount: 250_000, date: '2026-10-04', categoryId: 'rent', description: 'Location du bureau', tags: ['Récurrent'] },
];
