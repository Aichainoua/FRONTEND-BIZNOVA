/**
 * Utilitaires de dates du domaine.
 *
 * Les dates métier sont des chaînes ISO « AAAA-MM-JJ » (jour civil, sans fuseau)
 * et les périodes des clés « AAAA-MM ». On évite volontairement `Date` pour
 * toutes les comparaisons afin de n'avoir aucun décalage lié au fuseau horaire.
 */

export type IsoDate = string;
export type MonthKey = string;

const pad = (value: number): string => String(value).padStart(2, '0');

export const toIsoDate = (date: Date): IsoDate =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const todayIso = (): IsoDate => toIsoDate(new Date());

export const monthKeyOf = (iso: IsoDate): MonthKey => iso.slice(0, 7);

export const makeMonthKey = (year: number, month: number): MonthKey => `${year}-${pad(month)}`;

export const parseMonthKey = (key: MonthKey): { year: number; month: number } => ({
  year: Number(key.slice(0, 4)),
  month: Number(key.slice(5, 7)),
});

export const parseIsoDate = (iso: IsoDate): { year: number; month: number; day: number } => ({
  year: Number(iso.slice(0, 4)),
  month: Number(iso.slice(5, 7)),
  day: Number(iso.slice(8, 10)),
});

export const daysInMonth = (year: number, month: number): number =>
  new Date(year, month, 0).getDate();

export const firstDayOf = (key: MonthKey): IsoDate => `${key}-01`;

export const lastDayOf = (key: MonthKey): IsoDate => {
  const { year, month } = parseMonthKey(key);
  return `${key}-${pad(daysInMonth(year, month))}`;
};

export const addMonths = (key: MonthKey, delta: number): MonthKey => {
  const { year, month } = parseMonthKey(key);
  const index = year * 12 + (month - 1) + delta;
  return makeMonthKey(Math.floor(index / 12), (index % 12) + 1);
};

/** Liste les mois de `from` à `to` inclus (vide si `from` > `to`). */
export const listMonths = (from: MonthKey, to: MonthKey): MonthKey[] => {
  const months: MonthKey[] = [];
  for (let month = from; month <= to; month = addMonths(month, 1)) {
    months.push(month);
  }
  return months;
};

export const clampMonth = (key: MonthKey, min: MonthKey, max: MonthKey): MonthKey =>
  key < min ? min : key > max ? max : key;

export const isValidIsoDate = (value: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const { year, month, day } = parseIsoDate(value);
  return month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth(year, month);
};
