const pad = (n: number) => String(n).padStart(2, '0');

/** Début par défaut : le 1er janvier de l'année suivante (maquette : créé en 2026 -> 2027). */
export function defaultStartDate(now: Date = new Date()): string {
  return `${now.getFullYear() + 1}-01-01`;
}

/** Dernier jour de la période : début + N mois - 1 jour. */
export function endOfPeriod(startIso: string, months: number): string {
  const [y, m] = startIso.split('-').map(Number);
  const end = new Date(Date.UTC(y, m - 1 + months, 0)); // jour 0 = dernier jour du mois précédent
  return `${end.getUTCFullYear()}-${pad(end.getUTCMonth() + 1)}-${pad(end.getUTCDate())}`;
}
