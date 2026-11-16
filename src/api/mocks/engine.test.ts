import { buildRisks, computeForecast } from './engine';
import type { Assumptions } from '../../features/forecast/types';

// Valeurs de la maquette « Studio web Dakar » : réutilisables comme cas de test pour le moteur de B1.
const studio: Assumptions = {
  initialInvestment: 3_000_000,
  monthlyRevenue: 1_200_000,
  fixedCharges: 400_000,
  variableChargesPct: 20,
  ownContribution: 3_000_000,
  loanAmount: 0,
  discountRatePct: null,
};

describe('computeForecast — maquette Studio web Dakar (12 mois)', () => {
  const r = computeForecast(12, studio);

  it('retrouve les indicateurs de l’écran 5', () => {
    expect(r.revenueTotal).toBe(14_400_000);
    expect(r.chargesTotal).toBe(7_680_000);
    expect(r.netResult).toBe(6_720_000);
    expect(r.monthlyNetResult).toBe(560_000);
    expect(r.marginPct).toBeCloseTo(46.67, 2);
    expect(r.roiPct).toBeCloseTo(224, 0);
    expect(r.breakEvenMonthlyRevenue).toBe(500_000);
  });

  it('récupère l’apport au 6e mois (−200 000 puis +360 000)', () => {
    expect(r.paybackMonth).toBe(6);
    expect(r.paybackDetail).toEqual({ previousMonth: 5, previousCumulative: -200_000, month: 6, cumulative: 360_000 });
  });

  it('calcule la trésorerie : départ 0, fin 6 720 000', () => {
    expect(r.treasury.startBalance).toBe(0);
    expect(r.treasury.endBalance).toBe(6_720_000);
    expect(r.treasury.series).toHaveLength(13);
  });

  it('ne calcule pas la VAN sans taux, et la calcule avec', () => {
    expect(r.npv).toBeNull();
    expect(computeForecast(12, { ...studio, discountRatePct: 10 }).npv).toBeGreaterThan(0);
  });
});

describe('cas limites', () => {
  it('apport jamais récupéré', () => {
    const r = computeForecast(12, { ...studio, initialInvestment: 20_000_000 });
    expect(r.paybackMonth).toBeNull();
    expect(buildRisks({ ...studio, initialInvestment: 20_000_000 }, r).map((x) => x.id)).toContain('no-payback');
  });

  it('financement insuffisant : trésorerie de départ négative', () => {
    const r = computeForecast(12, { ...studio, ownContribution: 1_000_000 });
    expect(r.treasury.startBalance).toBe(-2_000_000);
    expect(buildRisks({ ...studio, ownContribution: 1_000_000 }, r).map((x) => x.id)).toContain('low-reserve');
  });

  it('charges variables à 100 % : seuil non calculable', () => {
    expect(computeForecast(12, { ...studio, variableChargesPct: 100 }).breakEvenMonthlyRevenue).toBeNull();
  });
});
