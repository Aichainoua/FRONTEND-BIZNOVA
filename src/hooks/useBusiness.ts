import { useMemo } from 'react';
import { listMonths, type MonthKey } from '../domain/dates';
import {
  buildExpenseBreakdown,
  buildMonthSummary,
  buildWeeklyFlows,
  collectKnownTags,
  operationsInMonth,
  sortOperationsNewestFirst,
  type MonthSummary,
} from '../domain/finance';
import type { Business, Operation } from '../domain/types';
import { selectableMonthBounds, useBusinessStore } from '../stores/businessStore';
import { useSessionStore } from '../stores/sessionStore';
import { identityFromEmail, type UserIdentity } from '../utils/identity';

/** Entreprise configurée. À n'utiliser que dans les écrans affichés une fois la configuration faite. */
export const useBusiness = (): Business => {
  const business = useBusinessStore((state) => state.business);
  if (!business) {
    throw new Error('useBusiness : aucune entreprise configurée.');
  }
  return business;
};

export interface PeriodData {
  business: Business;
  month: MonthKey;
  referenceMonth: MonthKey;
  isCurrentMonth: boolean;
  /** Mois disponibles dans le sélecteur, du plus ancien au plus récent. */
  months: MonthKey[];
  summary: MonthSummary;
  /** Opérations de la période, plus récentes d'abord. */
  operations: Operation[];
  expenseBreakdown: ReturnType<typeof buildExpenseBreakdown>;
  weeklyFlows: ReturnType<typeof buildWeeklyFlows>;
  selectMonth: (month: MonthKey) => void;
}

/** Données dérivées de la période sélectionnée (calculées une seule fois par rendu). */
export const usePeriodData = (monthOverride?: MonthKey): PeriodData => {
  const business = useBusiness();
  const allOperations = useBusinessStore((state) => state.operations);
  const selectedMonth = useBusinessStore((state) => state.selectedMonth);
  const referenceMonth = useBusinessStore((state) => state.referenceMonth);
  const selectMonth = useBusinessStore((state) => state.selectMonth);

  const month = monthOverride ?? selectedMonth;

  return useMemo(() => {
    const { first, last } = selectableMonthBounds(business, referenceMonth);
    return {
      business,
      month,
      referenceMonth,
      isCurrentMonth: month === last,
      months: listMonths(first, last),
      summary: buildMonthSummary(business, allOperations, month),
      operations: sortOperationsNewestFirst(operationsInMonth(allOperations, month)),
      expenseBreakdown: buildExpenseBreakdown(allOperations, month),
      weeklyFlows: buildWeeklyFlows(allOperations, month),
      selectMonth,
    };
  }, [business, allOperations, month, referenceMonth, selectMonth]);
};

/** Étiquettes déjà utilisées (pour la suggestion et le filtre). */
export const useKnownTags = (): string[] => {
  const operations = useBusinessStore((state) => state.operations);
  return useMemo(() => collectKnownTags(operations), [operations]);
};

/**
 * Utilisateur connecté (prénom et initiales).
 * TODO(auth) : lire le profil renvoyé par l'API quand l'authentification sera développée.
 */
export const useCurrentUser = (): UserIdentity => {
  const email = useSessionStore((state) => state.email);
  return useMemo(() => identityFromEmail(email), [email]);
};
