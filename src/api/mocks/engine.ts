import type { Assumptions, ForecastResults, ReportRisk } from '../../features/forecast/types';

const round = (n: number) => Math.round(n);

/**
 * Moteur de démonstration : sert de référence tant que le moteur de B1 n'est pas livré.
 * Hypothèses du cahier des charges : montants constants, encaissé / payé dans le mois,
 * pas de croissance, pas de valeur de revente, aucun intérêt d'emprunt.
 */
export function computeForecast(horizonMonths: number, a: Assumptions): ForecastResults {
  const months = horizonMonths;
  const variableMonthly = (a.monthlyRevenue * a.variableChargesPct) / 100;
  const monthlyNet = a.monthlyRevenue - a.fixedCharges - variableMonthly;

  const revenueTotal = a.monthlyRevenue * months;
  const chargesTotal = (a.fixedCharges + variableMonthly) * months;
  const netResult = revenueTotal - chargesTotal;
  const marginPct = revenueTotal > 0 ? (netResult / revenueTotal) * 100 : 0;
  const roiPct = a.initialInvestment > 0 ? (netResult / a.initialInvestment) * 100 : null;

  const marginRate = 1 - a.variableChargesPct / 100;
  const breakEven = marginRate > 0 ? a.fixedCharges / marginRate : null;

  // Flux cumulés, investissement inclus : mois 0 = -investissement.
  const cumulative = (m: number) => -a.initialInvestment + monthlyNet * m;
  let paybackMonth: number | null = null;
  for (let m = 1; m <= months; m += 1) {
    if (cumulative(m) >= 0) {
      paybackMonth = m;
      break;
    }
  }
  const paybackDetail =
    paybackMonth === null
      ? null
      : {
          previousMonth: paybackMonth - 1,
          previousCumulative: round(cumulative(paybackMonth - 1)),
          month: paybackMonth,
          cumulative: round(cumulative(paybackMonth)),
        };

  const startBalance = a.ownContribution + a.loanAmount - a.initialInvestment;
  const series = Array.from({ length: months + 1 }, (_, m) => ({ month: m, balance: round(startBalance + monthlyNet * m) }));

  let npv: number | null = null;
  if (a.discountRatePct != null) {
    const monthlyRate = Math.pow(1 + a.discountRatePct / 100, 1 / 12) - 1;
    let total = -a.initialInvestment;
    for (let m = 1; m <= months; m += 1) total += monthlyNet / Math.pow(1 + monthlyRate, m);
    npv = round(total);
  }

  return {
    horizonMonths: months,
    revenueTotal: round(revenueTotal),
    chargesTotal: round(chargesTotal),
    netResult: round(netResult),
    monthlyNetResult: round(monthlyNet),
    marginPct,
    roiPct,
    breakEvenMonthlyRevenue: breakEven === null ? null : round(breakEven),
    paybackMonth,
    paybackDetail,
    treasury: { startBalance: round(startBalance), endBalance: series[series.length - 1].balance, monthlyNet: round(monthlyNet), series },
    npv,
    discountRatePct: a.discountRatePct,
  };
}

/** Règles fixes (pas d'IA) pour « Risques & pistes d'amélioration ». */
export function buildRisks(a: Assumptions, r: ForecastResults): ReportRisk[] {
  const risks: ReportRisk[] = [
    {
      id: 'revenue-to-confirm',
      title: 'Un revenu à confirmer',
      message: 'Vos revenus mensuels reposent sur une estimation. Validez ce volume par des devis et des échanges commerciaux.',
    },
  ];
  if (r.treasury.startBalance <= 0) {
    risks.push({
      id: 'low-reserve',
      title: 'Peu de réserve au départ',
      message: 'Après le lancement, le solde est nul ou négatif. Prévoyez une réserve pour absorber un retard d’encaissement.',
    });
  }
  if (r.breakEvenMonthlyRevenue !== null && a.monthlyRevenue < r.breakEvenMonthlyRevenue * 1.2) {
    risks.push({
      id: 'thin-margin',
      title: 'Marge de sécurité faible',
      message: 'Vos revenus sont proches du seuil de rentabilité. Une baisse de ventes vous mettrait vite en perte.',
    });
  }
  if (r.paybackMonth === null) {
    risks.push({
      id: 'no-payback',
      title: 'Apport non récupéré sur la période',
      message: 'Les flux cumulés restent négatifs sur toute la période. Revoyez vos revenus, vos charges ou l’investissement.',
    });
  }
  return risks;
}
