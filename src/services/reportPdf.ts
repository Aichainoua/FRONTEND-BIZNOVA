/**
 * Export PDF du rapport mensuel (exigence B5, critère R8).
 *
 * Le document est généré à partir d'une page HTML imprimée par le système
 * (`expo-print`) puis partagé via la feuille de partage native (`expo-sharing`).
 * Il reprend la période, la devise et les hypothèses de calcul (cahier des charges § 7).
 */
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { categoryLabel, sectorLabel } from '../domain/categories';
import { firstDayOf, lastDayOf, type IsoDate, type MonthKey } from '../domain/dates';
import type { ExpenseShare, MonthSummary } from '../domain/finance';
import { monthlyTakeaway, periodRange } from '../domain/insights';
import { CURRENCY, type Business, type Operation } from '../domain/types';
import { lightColors } from '../theme/colors';
import {
  formatAmount,
  formatDateLong,
  formatDayMonth,
  formatFcfa,
  formatMonthLabel,
  formatPercent,
  formatSignedFcfa,
} from '../utils/format';

export interface MonthlyReportData {
  business: Business;
  month: MonthKey;
  summary: MonthSummary;
  /** Opérations de la période, plus récentes d'abord. */
  operations: readonly Operation[];
  expenseBreakdown: readonly ExpenseShare[];
  /** Date d'établissement du rapport. */
  issuedOn: IsoDate;
}

/** Neutralise le texte saisi par l'utilisateur avant de l'insérer dans le HTML. */
const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const row = (label: string, value: string, strong = false): string =>
  `<tr class="${strong ? 'strong' : ''}"><td>${escapeHtml(label)}</td><td class="num">${escapeHtml(value)}</td></tr>`;

export const buildMonthlyReportHtml = (data: MonthlyReportData): string => {
  const { business, month, summary, operations, expenseBreakdown, issuedOn } = data;
  const exceeded = summary.budgetStatus === 'exceeded';

  const operationRows = operations
    .map((operation) => {
      const sign = operation.type === 'income' ? '+' : '−';
      const title = operation.description?.trim() || categoryLabel(operation.categoryId);
      const tags = operation.tags.length > 0 ? ` · ${operation.tags.map((tag) => `#${tag}`).join(' ')}` : '';
      return `<tr>
        <td>${escapeHtml(formatDayMonth(operation.date))}</td>
        <td>${escapeHtml(title)}<div class="muted">${escapeHtml(categoryLabel(operation.categoryId) + tags)}</div></td>
        <td>${operation.type === 'income' ? 'Recette' : 'Dépense'}</td>
        <td class="num">${escapeHtml(`${sign}${formatAmount(operation.amount)}`)}</td>
      </tr>`;
    })
    .join('');

  const breakdownRows = expenseBreakdown
    .map((share) => row(`${share.label} (${share.percent} %)`, formatFcfa(share.amount)))
    .join('');

  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  @page { margin: 28px; }
  body { font-family: -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: ${lightColors.text}; font-size: 13px; line-height: 1.5; }
  h1 { font-size: 24px; margin: 4px 0 2px; letter-spacing: -0.5px; }
  h2 { font-size: 15px; margin: 24px 0 8px; color: ${lightColors.primary}; }
  .brand { color: ${lightColors.primary}; font-weight: 700; font-size: 18px; }
  .meta { color: ${lightColors.textSecondary}; }
  .hero { background: ${lightColors.primaryDeep}; color: #fff; border-radius: 14px; padding: 18px 20px; margin: 18px 0; }
  .hero .label { color: ${lightColors.primaryTint}; font-size: 12px; }
  .hero .amount { font-size: 32px; font-weight: 700; letter-spacing: -1px; }
  table { width: 100%; border-collapse: collapse; }
  td { padding: 7px 0; border-bottom: 1px solid ${lightColors.border}; vertical-align: top; }
  td.num { text-align: right; white-space: nowrap; font-weight: 600; }
  tr.strong td { font-weight: 700; color: ${lightColors.primary}; }
  .muted { color: ${lightColors.textSecondary}; font-size: 11px; }
  .alert { color: ${lightColors.danger}; font-weight: 600; }
  .note { background: ${lightColors.surfaceMuted}; border-radius: 10px; padding: 12px 14px; margin-top: 16px; }
  .foot { margin-top: 28px; color: ${lightColors.textSecondary}; font-size: 11px; }
</style>
</head>
<body>
  <div class="brand">biznova</div>
  <h1>Rapport mensuel · ${escapeHtml(formatMonthLabel(month))}</h1>
  <div class="meta">${escapeHtml(business.name)} · ${escapeHtml(sectorLabel(business.sector))}<br/>
  Période : ${escapeHtml(periodRange(month))} · Devise : ${CURRENCY}</div>

  <div class="hero">
    <div class="label">Résultat estimé</div>
    <div class="amount">${escapeHtml(formatSignedFcfa(summary.result))}</div>
  </div>

  <h2>Recettes et dépenses</h2>
  <table>
    ${row(`Recettes encaissées (${summary.incomeCount})`, formatFcfa(summary.income))}
    ${row(`Dépenses payées (${summary.expenseCount})`, formatFcfa(summary.expense))}
    ${row('Résultat estimé', formatSignedFcfa(summary.result), true)}
  </table>

  <h2>Trésorerie</h2>
  <table>
    ${row(`Solde au ${formatDateLong(firstDayOf(month))}`, formatFcfa(summary.openingCash))}
    ${row('Variation du mois', formatSignedFcfa(summary.result))}
    ${row(`Solde estimé au ${formatDateLong(lastDayOf(month))}`, formatFcfa(summary.closingCash), true)}
  </table>

  <h2>Budget global</h2>
  <table>
    ${row('Budget mensuel prévu', formatFcfa(summary.budget))}
    ${row('Dépenses réelles', formatFcfa(summary.expense))}
    ${row(exceeded ? 'Dépassement' : 'Reste disponible', formatFcfa(exceeded ? summary.overrun : summary.budgetRemaining), true)}
    ${row('Consommation du budget', formatPercent(summary.budgetConsumedPercent))}
  </table>
  ${exceeded ? '<p class="alert">Le budget global de la période est dépassé.</p>' : ''}

  ${breakdownRows ? `<h2>Répartition des dépenses</h2><table>${breakdownRows}</table>` : ''}

  <h2>Opérations de la période</h2>
  ${
    operationRows
      ? `<table>${operationRows}</table>`
      : '<p class="muted">Aucune opération enregistrée sur cette période.</p>'
  }

  <div class="note"><strong>À retenir.</strong> ${escapeHtml(monthlyTakeaway(summary))}</div>

  <div class="foot">
    Rapport établi le ${escapeHtml(formatDateLong(issuedOn))} à partir des opérations saisies dans BizNova.
    Hypothèses : montants en ${CURRENCY}, opérations déjà encaissées ou payées uniquement, un budget global
    unique par mois. Le résultat estimé (recettes − dépenses) et la trésorerie sont deux indicateurs distincts.
    Ces résultats sont des estimations d'aide à la décision et ne constituent pas une garantie de rentabilité.
  </div>
</body>
</html>`;
};

/** Génère le PDF puis ouvre la feuille de partage (enregistrer, envoyer, imprimer…). */
export const exportMonthlyReportPdf = async (data: MonthlyReportData): Promise<void> => {
  const { uri } = await Print.printToFileAsync({ html: buildMonthlyReportHtml(data) });

  if (!(await Sharing.isAvailableAsync())) {
    throw new Error('Le partage de fichiers n’est pas disponible sur cet appareil.');
  }

  await Sharing.shareAsync(uri, {
    mimeType: 'application/pdf',
    UTI: 'com.adobe.pdf',
    dialogTitle: `Rapport ${formatMonthLabel(data.month)}`,
  });
};
