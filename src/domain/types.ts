import type { IsoDate } from './dates';

/** Devise unique du MVP (exigence T1 du cahier des charges). */
export const CURRENCY = 'FCFA' as const;

export type OperationType = 'income' | 'expense';

export type SectorId = 'commerce' | 'it_services' | 'personal_services';

export interface Sector {
  id: SectorId;
  label: string;
}

export interface Category {
  id: string;
  label: string;
  type: OperationType;
}

/** Entreprise suivie dans le workflow B (exigence B1). */
export interface Business {
  name: string;
  sector: SectorId;
  /** Premier jour du suivi : aucune opération antérieure n'est acceptée. */
  trackingStart: IsoDate;
  /** Budget global mensuel, en FCFA (un seul budget, pas d'enveloppes par catégorie). */
  monthlyBudget: number;
  /** Trésorerie disponible au premier jour du suivi, en FCFA. */
  initialCash: number;
}

/** Opération réelle (déjà encaissée ou payée) — exigence B2. */
export interface Operation {
  id: string;
  type: OperationType;
  /** Montant strictement positif, en FCFA entiers. Le signe est porté par `type`. */
  amount: number;
  date: IsoDate;
  categoryId: string;
  description?: string;
  /** Étiquettes facultatives : classement et filtrage uniquement, jamais de calcul. */
  tags: string[];
}

export type OperationTypeFilter = 'all' | OperationType;
