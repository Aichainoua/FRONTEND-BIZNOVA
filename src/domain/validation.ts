/**
 * Contrôles de saisie (critère de recette R2 : les données obligatoires sont
 * vérifiées avant enregistrement). Les messages s'adressent à un non-spécialiste.
 */
import { isValidIsoDate, type IsoDate } from './dates';
import { formatDateField } from '../utils/format';
import type { OperationType, SectorId } from './types';

export interface OperationDraft {
  type: OperationType;
  amount: number | null;
  date: IsoDate | null;
  categoryId: string | null;
  description: string;
  tags: string[];
}

export type OperationErrors = Partial<Record<'amount' | 'date' | 'categoryId', string>>;

export const validateOperationDraft = (
  draft: OperationDraft,
  context: { trackingStart: IsoDate; today: IsoDate },
): OperationErrors => {
  const errors: OperationErrors = {};

  if (draft.amount === null || !Number.isFinite(draft.amount) || draft.amount <= 0) {
    errors.amount = 'Saisissez un montant strictement supérieur à 0.';
  }

  if (!draft.date || !isValidIsoDate(draft.date)) {
    errors.date = 'Choisissez une date.';
  } else if (draft.date < context.trackingStart || draft.date > context.today) {
    errors.date = `La date doit être comprise entre le ${formatDateField(context.trackingStart)} et aujourd’hui.`;
  }

  if (!draft.categoryId) {
    errors.categoryId = 'Choisissez une catégorie.';
  }

  return errors;
};

export interface BusinessSetupDraft {
  name: string;
  sector: SectorId | null;
  trackingStart: IsoDate | null;
  monthlyBudget: number | null;
  initialCash: number | null;
}

export type BusinessSetupErrors = Partial<Record<keyof BusinessSetupDraft, string>>;

export const validateBusinessSetup = (
  draft: BusinessSetupDraft,
  context: { today: IsoDate },
): BusinessSetupErrors => {
  const errors: BusinessSetupErrors = {};

  if (!draft.name.trim()) errors.name = 'Indiquez le nom de votre entreprise.';
  if (!draft.sector) errors.sector = 'Choisissez votre secteur d’activité.';

  if (!draft.trackingStart || !isValidIsoDate(draft.trackingStart)) {
    errors.trackingStart = 'Choisissez la date de début du suivi.';
  } else if (draft.trackingStart > context.today) {
    errors.trackingStart = 'Le suivi ne peut pas commencer à une date future.';
  }

  if (draft.monthlyBudget === null || draft.monthlyBudget <= 0) {
    errors.monthlyBudget = 'Saisissez un budget mensuel supérieur à 0.';
  }

  if (draft.initialCash === null || draft.initialCash < 0) {
    errors.initialCash = 'Saisissez votre trésorerie de départ (0 si vous partez de zéro).';
  }

  return errors;
};
