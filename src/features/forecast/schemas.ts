import { z } from 'zod';
import { parseNumber } from '../../utils/format';
import type { Assumptions } from './types';

// ---- Étape 1 : le projet -------------------------------------------------
export const projectSchema = z.object({
  name: z.string().trim().min(2, 'Donnez un nom à votre projet (2 caractères minimum).'),
  sector: z.string().min(1, 'Choisissez un secteur d’activité.'),
  horizonMonths: z.number(),
});
export type ProjectFormValues = z.infer<typeof projectSchema>;

// ---- Étape 2 : les hypothèses (toutes les valeurs du formulaire sont des chaînes) ----
const MONEY_RE = /^\d+$/;
const PERCENT_RE = /^\d+([.,]\d{1,2})?$/;

const requiredMoney = (subject: string) =>
  z
    .string()
    .trim()
    .refine((v) => v.length > 0, `${subject} : saisissez un montant.`)
    .refine((v) => v === '' || MONEY_RE.test(v), 'Saisissez uniquement des chiffres.');

const optionalMoney = z
  .string()
  .trim()
  .refine((v) => v === '' || MONEY_RE.test(v), 'Saisissez uniquement des chiffres.');

export const assumptionsSchema = z.object({
  initialInvestment: requiredMoney('Investissement initial'),
  monthlyRevenue: requiredMoney('Revenus prévisionnels').refine(
    (v) => v === '' || Number(v) > 0,
    'Les revenus mensuels doivent être supérieurs à 0.',
  ),
  fixedCharges: requiredMoney('Charges fixes'),
  variableChargesPct: z
    .string()
    .trim()
    .refine((v) => v.length > 0, 'Charges variables : saisissez un pourcentage (0 si aucune).')
    .refine((v) => v === '' || PERCENT_RE.test(v), 'Saisissez un pourcentage, par exemple 20 ou 12,5.')
    .refine((v) => v === '' || !PERCENT_RE.test(v) || (parseNumber(v) ?? 0) < 100, 'Le pourcentage doit être inférieur à 100.'),
  ownContribution: requiredMoney('Apport personnel'),
  loanAmount: optionalMoney,
  discountRatePct: z
    .string()
    .trim()
    .refine((v) => v === '' || PERCENT_RE.test(v), 'Saisissez un pourcentage, par exemple 10 ou 12,5.')
    .refine((v) => v === '' || !PERCENT_RE.test(v) || (parseNumber(v) ?? 0) <= 100, 'Le taux doit être compris entre 0 et 100.'),
});
export type AssumptionsFormValues = z.infer<typeof assumptionsSchema>;

export const EMPTY_ASSUMPTIONS_FORM: AssumptionsFormValues = {
  initialInvestment: '',
  monthlyRevenue: '',
  fixedCharges: '',
  variableChargesPct: '',
  ownContribution: '',
  loanAmount: '',
  discountRatePct: '',
};

const str = (n: number | null | undefined) => (n == null ? '' : String(n).replace('.', ','));

export function toFormValues(a: Partial<Assumptions> | null | undefined): AssumptionsFormValues {
  if (!a) return EMPTY_ASSUMPTIONS_FORM;
  return {
    initialInvestment: str(a.initialInvestment),
    monthlyRevenue: str(a.monthlyRevenue),
    fixedCharges: str(a.fixedCharges),
    variableChargesPct: str(a.variableChargesPct),
    ownContribution: str(a.ownContribution),
    loanAmount: a.loanAmount ? str(a.loanAmount) : '',
    discountRatePct: str(a.discountRatePct),
  };
}

/** Brouillon : on n'envoie que les champs lisibles, sans bloquer sur les champs vides. */
export function toPartialAssumptions(v: AssumptionsFormValues): Partial<Assumptions> {
  const out: Partial<Assumptions> = {};
  const set = <K extends keyof Assumptions>(key: K, raw: string) => {
    const n = parseNumber(raw);
    if (n !== undefined) (out as Record<string, number>)[key] = n;
  };
  set('initialInvestment', v.initialInvestment);
  set('monthlyRevenue', v.monthlyRevenue);
  set('fixedCharges', v.fixedCharges);
  set('variableChargesPct', v.variableChargesPct);
  set('ownContribution', v.ownContribution);
  set('loanAmount', v.loanAmount);
  out.discountRatePct = parseNumber(v.discountRatePct) ?? null;
  return out;
}

/** À n'appeler qu'après validation par assumptionsSchema. */
export function toAssumptions(v: AssumptionsFormValues): Assumptions {
  return {
    initialInvestment: parseNumber(v.initialInvestment) ?? 0,
    monthlyRevenue: parseNumber(v.monthlyRevenue) ?? 0,
    fixedCharges: parseNumber(v.fixedCharges) ?? 0,
    variableChargesPct: parseNumber(v.variableChargesPct) ?? 0,
    ownContribution: parseNumber(v.ownContribution) ?? 0,
    loanAmount: parseNumber(v.loanAmount) ?? 0,
    discountRatePct: parseNumber(v.discountRatePct) ?? null,
  };
}
