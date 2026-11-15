import { create } from 'zustand';
import {
  addMonths,
  clampMonth,
  monthKeyOf,
  todayIso,
  type MonthKey,
} from '../domain/dates';
import { normalizeTag } from '../domain/finance';
import type { Business, Operation, OperationType, SectorId } from '../domain/types';
import type { BusinessSetupDraft } from '../domain/validation';
import { SEED_REFERENCE_MONTH, seedBusiness, seedOperations } from '../mocks/seed';

/**
 * Charge le jeu de démonstration (chiffres de la maquette) au lieu d'un état vide.
 * Variable inlinée par Expo au build : voir `.env.example`.
 */
const USE_SEED_DATA = process.env.EXPO_PUBLIC_SEED_DATA === 'true';

export interface NewBusinessInput {
  name: string;
  sector: SectorId;
  trackingStart: string;
  monthlyBudget: number;
  initialCash: number;
}

export interface NewOperationInput {
  type: OperationType;
  amount: number;
  date: string;
  categoryId: string;
  description?: string;
  tags: string[];
}

interface BusinessState {
  business: Business | null;
  operations: Operation[];
  /** Période affichée par le tableau de bord, les opérations, le budget et le rapport. */
  selectedMonth: MonthKey;
  /** Mois « en cours » : borne haute du sélecteur de période. */
  referenceMonth: MonthKey;
  /** Brouillon de la configuration (« Enregistrer et quitter »). */
  setupDraft: BusinessSetupDraft | null;

  configureBusiness: (input: NewBusinessInput) => void;
  saveSetupDraft: (draft: BusinessSetupDraft) => void;
  addOperation: (input: NewOperationInput) => Operation;
  updateMonthlyBudget: (amount: number) => void;
  selectMonth: (month: MonthKey) => void;
}

const createOperationId = (): string =>
  `op_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

/** Supprime les doublons d'étiquettes (insensible à la casse) en gardant la première graphie. */
const uniqueTags = (tags: readonly string[]): string[] => {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const raw of tags) {
    const tag = normalizeTag(raw);
    const key = tag.toLocaleLowerCase('fr');
    if (tag && !seen.has(key)) {
      seen.add(key);
      result.push(tag);
    }
  }
  return result;
};

const buildInitialState = (): Pick<
  BusinessState,
  'business' | 'operations' | 'selectedMonth' | 'referenceMonth' | 'setupDraft'
> => {
  if (USE_SEED_DATA) {
    return {
      business: seedBusiness,
      operations: seedOperations,
      selectedMonth: SEED_REFERENCE_MONTH,
      referenceMonth: SEED_REFERENCE_MONTH,
      setupDraft: null,
    };
  }
  const currentMonth = monthKeyOf(todayIso());
  return {
    business: null,
    operations: [],
    selectedMonth: currentMonth,
    referenceMonth: currentMonth,
    setupDraft: null,
  };
};

export const useBusinessStore = create<BusinessState>((set, get) => ({
  ...buildInitialState(),

  configureBusiness: (input) => {
    const { referenceMonth } = get();
    const startMonth = monthKeyOf(input.trackingStart);
    set({
      business: {
        name: input.name.trim(),
        sector: input.sector,
        trackingStart: input.trackingStart,
        monthlyBudget: input.monthlyBudget,
        initialCash: input.initialCash,
      },
      operations: [],
      selectedMonth: clampMonth(referenceMonth, startMonth, referenceMonth),
      setupDraft: null,
    });
  },

  saveSetupDraft: (draft) => set({ setupDraft: draft }),

  addOperation: (input) => {
    const operation: Operation = {
      id: createOperationId(),
      type: input.type,
      amount: Math.round(input.amount),
      date: input.date,
      categoryId: input.categoryId,
      description: input.description?.trim() || undefined,
      tags: uniqueTags(input.tags),
    };
    set((state) => ({
      operations: [...state.operations, operation],
      // On affiche la période de l'opération pour que l'utilisateur la voie immédiatement.
      selectedMonth: monthKeyOf(operation.date),
    }));
    return operation;
  },

  updateMonthlyBudget: (amount) =>
    set((state) =>
      state.business ? { business: { ...state.business, monthlyBudget: amount } } : state,
    ),

  selectMonth: (month) => set({ selectedMonth: month }),
}));

/** Mois sélectionnables : du début du suivi au mois en cours (jamais dans le futur). */
export const selectableMonthBounds = (
  business: Business,
  referenceMonth: MonthKey,
): { first: MonthKey; last: MonthKey } => {
  const first = monthKeyOf(business.trackingStart);
  return { first, last: referenceMonth < first ? first : referenceMonth };
};

export { addMonths };
