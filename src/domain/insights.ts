/**
 * Phrases de synthèse du workflow B, générées de façon déterministe à partir
 * des indicateurs (l'IA ne fait pas partie du MVP — cahier des charges § 7).
 * Elles décrivent la situation, sans jamais promettre un résultat.
 */
import { lastDayOf, type IsoDate } from './dates';
import type { MonthSummary } from './finance';
import { formatDayMonthLong, formatDateLong, formatFcfa, monthName } from '../utils/format';

export interface InfoMessage {
  title: string;
  body: string;
}

/** Phrase sous le résultat estimé du rapport mensuel. */
export const resultHeadline = (summary: MonthSummary, isCurrentMonth: boolean): string => {
  if (summary.operationCount === 0) {
    return 'Aucune opération enregistrée sur cette période.';
  }
  const when = isCurrentMonth ? 'ce mois-ci' : 'ce mois-là';
  return summary.result >= 0
    ? `Vos recettes ont couvert vos dépenses ${when}.`
    : `Vos dépenses ont dépassé vos recettes ${when}.`;
};

/** Encart « À retenir » du rapport mensuel. */
export const monthlyTakeaway = (summary: MonthSummary): string => {
  if (summary.operationCount === 0) {
    return 'Aucune opération n’est enregistrée sur cette période : les indicateurs sont à zéro et ne permettent pas de conclure.';
  }

  const positive = summary.result >= 0;

  if (summary.budgetStatus === 'within') {
    const left = Math.max(0, 100 - summary.budgetConsumedPercent);
    const lead = positive
      ? 'Le résultat est positif et le budget global est respecté.'
      : 'Le résultat est négatif (les dépenses dépassent les recettes), même si le budget global est respecté.';
    return `${lead} Il reste ${left} % du budget prévu, soit ${formatFcfa(summary.budgetRemaining)} non dépensés.`;
  }

  const lead = positive
    ? `Le résultat est positif, mais le budget global est dépassé de ${formatFcfa(summary.overrun)} (${summary.budgetConsumedPercent} % consommé).`
    : `Le résultat est négatif et le budget global est dépassé de ${formatFcfa(summary.overrun)} (${summary.budgetConsumedPercent} % consommé).`;
  const cash =
    summary.closingCash >= 0
      ? 'Votre trésorerie estimée reste positive : vérifiez vos paiements avant de définir le prochain budget.'
      : 'Votre trésorerie estimée est négative : surveillez vos prochains encaissements.';
  return `${lead} ${cash}`;
};

/** Encart pédagogique sur l'écran Budget lorsqu'il est dépassé. */
export const overrunContext = (summary: MonthSummary): InfoMessage =>
  summary.closingCash >= 0
    ? {
        title: 'Budget dépassé ≠ trésorerie négative',
        body: 'Les dépenses ont dépassé la limite prévue, mais le solde de trésorerie reste positif. Vérifiez les paiements avant de définir votre prochain budget.',
      }
    : {
        title: 'Budget dépassé et trésorerie négative',
        body: 'Les dépenses ont dépassé la limite prévue et le solde de trésorerie estimé est négatif. Priorisez vos prochains encaissements avant tout nouvel achat.',
      };

/** Note de bas de rapport : date d'établissement et réserve sur l'exhaustivité. */
export const reportFootnote = (month: string, today: IsoDate): string => {
  const end = lastDayOf(month);
  const issuedOn = today < end ? today : end;
  return `Synthèse établie le ${formatDateLong(issuedOn)} à partir des opérations saisies. Les montants estimés dépendent de l’exhaustivité de vos enregistrements.`;
};

/** « 1er–31 octobre 2026 » (utilisé dans l'en-tête du résultat estimé). */
export const periodRange = (month: string): string => {
  const end = lastDayOf(month);
  const year = month.slice(0, 4);
  return `1er–${formatDayMonthLong(end).replace(/^1er/, '1')} ${year}`;
};

/** « au 31 octobre » */
export const asOfLabel = (month: string): string => `au ${formatDayMonthLong(lastDayOf(month))}`;

export { monthName };
