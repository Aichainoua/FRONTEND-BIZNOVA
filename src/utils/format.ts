/**
 * Formatage des montants et des dates en français (FCFA).
 *
 * `Intl` n'est pas utilisé volontairement : son support des locales varie selon
 * la version d'Android (Hermes) alors que l'app vise Android 7+.
 */
import { CURRENCY } from '../domain/types';
import { parseIsoDate, parseMonthKey, type IsoDate, type MonthKey } from '../domain/dates';

/** Espace insécable : évite qu'un montant soit coupé en fin de ligne. */
const NBSP = ' ';
/** Vrai signe moins typographique. */
const MINUS = '−';

const MONTHS_LONG = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
] as const;

const MONTHS_SHORT = [
  'janv.',
  'févr.',
  'mars',
  'avr.',
  'mai',
  'juin',
  'juil.',
  'août',
  'sept.',
  'oct.',
  'nov.',
  'déc.',
] as const;

const capitalize = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);

/** 1250000 → « 1 250 000 » ; les négatifs utilisent le signe moins typographique. */
export const formatAmount = (value: number): string => {
  const rounded = Math.round(Math.abs(value));
  const grouped = String(rounded).replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
  return value < 0 && rounded !== 0 ? `${MINUS}${grouped}` : grouped;
};

export const formatFcfa = (value: number): string => `${formatAmount(value)}${NBSP}${CURRENCY}`;

/** Ajoute « + » devant les montants strictement positifs. */
export const formatSignedAmount = (value: number): string =>
  `${value > 0 ? '+' : ''}${formatAmount(value)}`;

export const formatSignedFcfa = (value: number): string =>
  `${formatSignedAmount(value)}${NBSP}${CURRENCY}`;

export const formatPercent = (value: number): string => `${Math.round(value)}${NBSP}%`;

/** « 27 oct. » */
export const formatDayMonth = (iso: IsoDate): string => {
  const { month, day } = parseIsoDate(iso);
  return `${day}${NBSP}${MONTHS_SHORT[month - 1] ?? ''}`;
};

/** « 27 / 10 / 2026 » */
export const formatDateField = (iso: IsoDate): string => {
  const { year, month, day } = parseIsoDate(iso);
  return `${String(day).padStart(2, '0')} / ${String(month).padStart(2, '0')} / ${year}`;
};

/** « 1er septembre 2026 » */
export const formatDateLong = (iso: IsoDate): string => {
  const { year, month, day } = parseIsoDate(iso);
  const dayLabel = day === 1 ? '1er' : String(day);
  return `${dayLabel} ${MONTHS_LONG[month - 1] ?? ''} ${year}`;
};

/** « 31 octobre » */
export const formatDayMonthLong = (iso: IsoDate): string => {
  const { month, day } = parseIsoDate(iso);
  return `${day === 1 ? '1er' : day} ${MONTHS_LONG[month - 1] ?? ''}`;
};

/** « octobre » */
export const monthName = (key: MonthKey): string => MONTHS_LONG[parseMonthKey(key).month - 1] ?? '';

/** « Octobre 2026 » */
export const formatMonthLabel = (key: MonthKey): string =>
  `${capitalize(monthName(key))} ${parseMonthKey(key).year}`;

/** « d’octobre », « de septembre » (élision devant une voyelle). */
export const withDe = (key: MonthKey): string => {
  const name = monthName(key);
  return /^[aeiouyéèh]/i.test(name) ? `d’${name}` : `de ${name}`;
};

/** « 3 opérations », « 1 opération » (le zéro s'accorde au singulier en français). */
export const countLabel = (count: number, singular: string, plural = `${singular}s`): string =>
  `${count} ${count > 1 ? plural : singular}`;

/** Chiffres uniquement → nombre (ou null si vide). */
export const parseAmountInput = (text: string): number | null => {
  const digits = text.replace(/\D/g, '');
  if (!digits) return null;
  const value = Number(digits);
  return Number.isSafeInteger(value) ? value : null;
};

export const initialsOf = (fullName: string): string =>
  fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
