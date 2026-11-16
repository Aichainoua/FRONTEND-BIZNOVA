export const NBSP = '\u00A0';

const MONTHS_LONG = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const MONTHS_SHORT = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

/** Regroupe les chiffres par 3 : 6720000 -> "6 720 000" (espaces insécables). */
export function formatNumber(value: number, separator: string = NBSP): string {
  const sign = value < 0 ? '−' : '';
  const digits = Math.abs(Math.round(value)).toString();
  return sign + digits.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

export const formatFcfa = (value: number): string => `${formatNumber(value)}${NBSP}FCFA`;

/** "+6 720 000" / "−120 000" (sans unité). */
export function formatSigned(value: number): string {
  return value > 0 ? `+${formatNumber(value)}` : formatNumber(value);
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals).replace('.', ',')}${NBSP}%`;
}

/** 6 720 000 -> "6,72 M FCFA" ; 560 000 -> "560 k FCFA". */
export function formatCompactFcfa(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? '−' : '';
  if (abs >= 1_000_000) {
    const m = (abs / 1_000_000).toFixed(2).replace(/\.?0+$/, '').replace('.', ',');
    return `${sign}${m}${NBSP}M${NBSP}FCFA`;
  }
  if (abs >= 1_000) return `${sign}${Math.round(abs / 1_000)}${NBSP}k${NBSP}FCFA`;
  return `${sign}${Math.round(abs)}${NBSP}FCFA`;
}

/** Saisie : "3000000" -> "3 000 000" (espaces simples, pour le champ). */
export function groupDigits(raw: string): string {
  return raw.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/** "1 200 000" / "12,5" -> nombre ; chaîne vide ou invalide -> undefined. */
export function parseNumber(raw: string | undefined | null): number | undefined {
  if (raw == null) return undefined;
  const cleaned = raw.replace(/[\s\u00A0\u202F]/g, '').replace(',', '.');
  if (!/^\d+(\.\d+)?$/.test(cleaned)) return undefined;
  return Number(cleaned);
}

type IsoParts = { y: number; m: number; d: number };
function parseIso(iso: string): IsoParts {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  return { y, m, d };
}

const dayLabel = (d: number) => (d === 1 ? '1er' : String(d));

/** "2026-10-31" -> "31 octobre 2026". */
export function formatDateFr(iso: string): string {
  const { y, m, d } = parseIso(iso);
  return `${dayLabel(d)} ${MONTHS_LONG[m - 1]} ${y}`;
}

/** "Du 1er janvier au 31 décembre 2027". */
export function formatPeriod(startIso: string, endIso: string): string {
  const s = parseIso(startIso);
  const e = parseIso(endIso);
  const start = `${dayLabel(s.d)} ${MONTHS_LONG[s.m - 1]}${s.y === e.y ? '' : ` ${s.y}`}`;
  return `Du ${start} au ${dayLabel(e.d)} ${MONTHS_LONG[e.m - 1]} ${e.y}`;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** "Janv.–déc. 2027" ou "Janv. 2027–déc. 2028". */
export function formatShortPeriod(startIso: string, endIso: string): string {
  const s = parseIso(startIso);
  const e = parseIso(endIso);
  if (s.y === e.y) return `${cap(MONTHS_SHORT[s.m - 1])}–${MONTHS_SHORT[e.m - 1]} ${e.y}`;
  return `${cap(MONTHS_SHORT[s.m - 1])} ${s.y}–${MONTHS_SHORT[e.m - 1]} ${e.y}`;
}

/** Libellé de période sur l'écran des résultats : "Année 2027" ou "Janv. 2027–déc. 2028". */
export function formatPeriodLabel(startIso: string, endIso: string): string {
  const s = parseIso(startIso);
  const e = parseIso(endIso);
  return s.m === 1 && e.m === 12 && s.y === e.y ? `Année ${s.y}` : formatShortPeriod(startIso, endIso);
}

/** "2026-10-31T09:40:00" -> "09:40" (heure locale). */
export function formatTime(iso: string): string {
  const date = new Date(iso);
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

/** "aujourd'hui", "hier" ou "le 12 oct.". */
export function formatUpdated(iso: string, now: Date = new Date()): string {
  const date = new Date(iso);
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffDays = Math.round((startOfDay(now) - startOfDay(date)) / 86_400_000);
  if (diffDays <= 0) return "aujourd’hui";
  if (diffDays === 1) return 'hier';
  return `le ${date.getDate()} ${MONTHS_SHORT[date.getMonth()]}`;
}

/** 1 -> "1er", 6 -> "6e". */
export const ordinalMonth = (n: number): string => (n === 1 ? '1er' : `${n}e`);

export function initials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const firstName = (fullName: string): string => fullName.trim().split(/\s+/)[0] ?? '';

/** "2027-12-31" -> "décembre". */
export function monthName(iso: string): string {
  return MONTHS_LONG[parseIso(iso).m - 1];
}
