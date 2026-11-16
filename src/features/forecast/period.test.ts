import { defaultStartDate, endOfPeriod } from './period';

describe('period', () => {
  it('commence le 1er janvier de l’année suivante', () => {
    expect(defaultStartDate(new Date(2026, 9, 31))).toBe('2027-01-01');
  });

  it('calcule le dernier jour de la période', () => {
    expect(endOfPeriod('2027-01-01', 12)).toBe('2027-12-31');
    expect(endOfPeriod('2027-01-01', 24)).toBe('2028-12-31');
    expect(endOfPeriod('2027-01-01', 36)).toBe('2029-12-31');
    expect(endOfPeriod('2027-03-01', 12)).toBe('2028-02-29');
  });
});
