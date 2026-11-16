import {
  formatCompactFcfa,
  formatFcfa,
  formatPercent,
  formatPeriod,
  formatPeriodLabel,
  formatShortPeriod,
  formatSigned,
  formatUpdated,
  initials,
  monthName,
  NBSP,
  ordinalMonth,
  parseNumber,
} from './format';

describe('format', () => {
  it('formate les montants en FCFA avec espaces insécables', () => {
    expect(formatFcfa(6720000)).toBe(`6${NBSP}720${NBSP}000${NBSP}FCFA`);
    expect(formatFcfa(0)).toBe(`0${NBSP}FCFA`);
    expect(formatFcfa(-120000)).toBe(`−120${NBSP}000${NBSP}FCFA`);
  });

  it('affiche le signe des résultats', () => {
    expect(formatSigned(6720000)).toBe(`+6${NBSP}720${NBSP}000`);
    expect(formatSigned(-200000)).toBe(`−200${NBSP}000`);
  });

  it('formate les pourcentages à la française', () => {
    expect(formatPercent(46.6666)).toBe(`46,7${NBSP}%`);
    expect(formatPercent(224, 0)).toBe(`224${NBSP}%`);
  });

  it('abrège les grands montants pour le graphique', () => {
    expect(formatCompactFcfa(6720000)).toBe(`6,72${NBSP}M${NBSP}FCFA`);
    expect(formatCompactFcfa(2000000)).toBe(`2${NBSP}M${NBSP}FCFA`);
    expect(formatCompactFcfa(560000)).toBe(`560${NBSP}k${NBSP}FCFA`);
  });

  it('lit les saisies utilisateur', () => {
    expect(parseNumber('1 200 000')).toBe(1200000);
    expect(parseNumber('12,5')).toBe(12.5);
    expect(parseNumber('')).toBeUndefined();
    expect(parseNumber('abc')).toBeUndefined();
    expect(parseNumber('-5')).toBeUndefined();
  });

  it('formate les périodes', () => {
    expect(formatPeriod('2027-01-01', '2027-12-31')).toBe('Du 1er janvier au 31 décembre 2027');
    expect(formatPeriod('2027-01-01', '2028-12-31')).toBe('Du 1er janvier 2027 au 31 décembre 2028');
    expect(formatShortPeriod('2027-01-01', '2027-12-31')).toBe('Janv.–déc. 2027');
    expect(formatPeriodLabel('2027-01-01', '2027-12-31')).toBe('Année 2027');
    expect(formatPeriodLabel('2027-01-01', '2028-12-31')).toBe('Janv. 2027–déc. 2028');
    expect(monthName('2027-12-31')).toBe('décembre');
  });

  it('formate les dates relatives', () => {
    const now = new Date(2026, 9, 31, 12, 0, 0);
    expect(formatUpdated(new Date(2026, 9, 31, 8, 0, 0).toISOString(), now)).toBe('aujourd’hui');
    expect(formatUpdated(new Date(2026, 9, 30, 20, 0, 0).toISOString(), now)).toBe('hier');
    expect(formatUpdated(new Date(2026, 9, 12, 9, 0, 0).toISOString(), now)).toBe('le 12 oct.');
  });

  it('gère ordinaux et initiales', () => {
    expect(ordinalMonth(1)).toBe('1er');
    expect(ordinalMonth(6)).toBe('6e');
    expect(initials('Amina Diop')).toBe('AD');
    expect(initials('Amina')).toBe('AM');
  });
});
