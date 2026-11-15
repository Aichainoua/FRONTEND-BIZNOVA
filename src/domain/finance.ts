/**
 * Règles de calcul du workflow B (cahier des charges § 5 et § 7).
 *
 * Fonctions pures et déterministes : aucune dépendance à React, au store ou à
 * l'horloge. Elles peuvent donc être testées seules et, le moment venu,
 * remplacées par les valeurs calculées par le back-end sans toucher à l'UI.
 */
import { categoryLabel } from './categories';
import {
  firstDayOf,
  lastDayOf,
  monthKeyOf,
  parseIsoDate,
  type IsoDate,
  type MonthKey,
} from './dates';
import type { Business, Operation, OperationType, OperationTypeFilter } from './types';

export type BudgetStatus = 'within' | 'exceeded';

export interface MonthSummary {
  month: MonthKey;
  income: number;
  expense: number;
  incomeCount: number;
  expenseCount: number;
  operationCount: number;
  /** Résultat estimé = recettes − dépenses de la période. */
  result: number;
  /** Trésorerie au premier jour de la période. */
  openingCash: number;
  /** Trésorerie estimée au dernier jour de la période (distincte du résultat). */
  closingCash: number;
  budget: number;
  /** Budget − dépenses. Une valeur négative indique un dépassement. */
  budgetRemaining: number;
  /** Dépenses ÷ budget (peut dépasser 1). */
  budgetConsumedRatio: number;
  budgetConsumedPercent: number;
  budgetStatus: BudgetStatus;
  /** Montant du dépassement (0 si le budget est respecté). */
  overrun: number;
}

export interface ExpenseShare {
  categoryId: string;
  label: string;
  amount: number;
  /** Part des dépenses de la période, en % arrondi. */
  percent: number;
}

export interface WeeklyFlow {
  label: string;
  income: number;
  expense: number;
}

export interface OperationFilters {
  type: OperationTypeFilter;
  /** Étiquettes sélectionnées : une opération est retenue si elle en porte AU MOINS UNE. */
  tags: readonly string[];
  /** Recherche libre (description, catégorie, étiquettes). */
  query: string;
}

const signedAmount = (operation: Operation): number =>
  operation.type === 'income' ? operation.amount : -operation.amount;

export const operationsInMonth = (
  operations: readonly Operation[],
  month: MonthKey,
): Operation[] => operations.filter((operation) => monthKeyOf(operation.date) === month);

/** Plus récentes d'abord ; à date égale, la dernière saisie d'abord. */
export const sortOperationsNewestFirst = (operations: readonly Operation[]): Operation[] =>
  operations
    .map((operation, index) => ({ operation, index }))
    .sort((a, b) =>
      a.operation.date === b.operation.date
        ? b.index - a.index
        : a.operation.date < b.operation.date
          ? 1
          : -1,
    )
    .map(({ operation }) => operation);

export const buildMonthSummary = (
  business: Business,
  operations: readonly Operation[],
  month: MonthKey,
): MonthSummary => {
  const start = firstDayOf(month);
  const end = lastDayOf(month);

  let income = 0;
  let expense = 0;
  let incomeCount = 0;
  let expenseCount = 0;
  let netBeforeMonth = 0;

  for (const operation of operations) {
    if (operation.date < business.trackingStart) continue;
    if (operation.date < start) {
      netBeforeMonth += signedAmount(operation);
      continue;
    }
    if (operation.date > end) continue;

    if (operation.type === 'income') {
      income += operation.amount;
      incomeCount += 1;
    } else {
      expense += operation.amount;
      expenseCount += 1;
    }
  }

  const budget = business.monthlyBudget;
  const budgetRemaining = budget - expense;
  const budgetConsumedRatio = budget > 0 ? expense / budget : 0;
  const openingCash = business.initialCash + netBeforeMonth;

  return {
    month,
    income,
    expense,
    incomeCount,
    expenseCount,
    operationCount: incomeCount + expenseCount,
    result: income - expense,
    openingCash,
    closingCash: openingCash + income - expense,
    budget,
    budgetRemaining,
    budgetConsumedRatio,
    budgetConsumedPercent: Math.round(budgetConsumedRatio * 100),
    budgetStatus: expense > budget ? 'exceeded' : 'within',
    overrun: Math.max(0, expense - budget),
  };
};

/** Répartition des dépenses réelles par catégorie (décroissante). Pas de budget par catégorie. */
export const buildExpenseBreakdown = (
  operations: readonly Operation[],
  month: MonthKey,
): ExpenseShare[] => {
  const totals = new Map<string, number>();
  let total = 0;

  for (const operation of operationsInMonth(operations, month)) {
    if (operation.type !== 'expense') continue;
    totals.set(operation.categoryId, (totals.get(operation.categoryId) ?? 0) + operation.amount);
    total += operation.amount;
  }

  return [...totals.entries()]
    .map(([categoryId, amount]) => ({
      categoryId,
      label: categoryLabel(categoryId),
      amount,
      percent: total > 0 ? Math.round((amount / total) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
};

/** Flux du mois par tranche de jours : 1–7, 8–14, 15–21, 22–fin de mois. */
export const buildWeeklyFlows = (
  operations: readonly Operation[],
  month: MonthKey,
): WeeklyFlow[] => {
  const lastDay = parseIsoDate(lastDayOf(month)).day;
  const flows: WeeklyFlow[] = [
    { label: '1–7', income: 0, expense: 0 },
    { label: '8–14', income: 0, expense: 0 },
    { label: '15–21', income: 0, expense: 0 },
    { label: `22–${lastDay}`, income: 0, expense: 0 },
  ];

  for (const operation of operationsInMonth(operations, month)) {
    const { day } = parseIsoDate(operation.date);
    const bucket = flows[day <= 7 ? 0 : day <= 14 ? 1 : day <= 21 ? 2 : 3];
    if (!bucket) continue;
    if (operation.type === 'income') bucket.income += operation.amount;
    else bucket.expense += operation.amount;
  }

  return flows;
};

/* -------------------------------------------------------------------------- */
/* Étiquettes                                                                  */
/* -------------------------------------------------------------------------- */

/** Nettoie une étiquette saisie : espaces, « # » initial, espaces multiples. */
export const normalizeTag = (raw: string): string =>
  raw.replace(/^[#\s]+/, '').replace(/\s+/g, ' ').trim();

export const tagKey = (tag: string): string => normalizeTag(tag).toLocaleLowerCase('fr');

/** Étiquettes distinctes (insensibles à la casse), triées par ordre alphabétique. */
export const collectKnownTags = (operations: readonly Operation[]): string[] => {
  const byKey = new Map<string, string>();
  for (const operation of operations) {
    for (const tag of operation.tags) {
      const key = tagKey(tag);
      if (key && !byKey.has(key)) byKey.set(key, normalizeTag(tag));
    }
  }
  return [...byKey.values()].sort((a, b) => a.localeCompare(b, 'fr'));
};

export const filterOperations = (
  operations: readonly Operation[],
  filters: OperationFilters,
): Operation[] => {
  const selected = new Set(filters.tags.map(tagKey));
  const query = filters.query.trim().toLocaleLowerCase('fr');

  return operations.filter((operation) => {
    if (filters.type !== 'all' && operation.type !== filters.type) return false;

    if (selected.size > 0 && !operation.tags.some((tag) => selected.has(tagKey(tag)))) {
      return false;
    }

    if (query) {
      const haystack = [operation.description ?? '', categoryLabel(operation.categoryId), ...operation.tags]
        .join(' ')
        .toLocaleLowerCase('fr');
      if (!haystack.includes(query)) return false;
    }

    return true;
  });
};

export const totalsByType = (
  operations: readonly Operation[],
): Record<OperationType, { total: number; count: number }> => {
  const totals = {
    income: { total: 0, count: 0 },
    expense: { total: 0, count: 0 },
  };
  for (const operation of operations) {
    totals[operation.type].total += operation.amount;
    totals[operation.type].count += 1;
  }
  return totals;
};

export type { IsoDate };
