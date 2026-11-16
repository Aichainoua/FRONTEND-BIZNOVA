import { assumptionsSchema, EMPTY_ASSUMPTIONS_FORM, projectSchema, toAssumptions, toFormValues, toPartialAssumptions } from './schemas';

const valid = {
  initialInvestment: '3000000',
  monthlyRevenue: '1200000',
  fixedCharges: '400000',
  variableChargesPct: '20',
  ownContribution: '3000000',
  loanAmount: '',
  discountRatePct: '',
};

const firstMessage = (values: Record<string, string>, field: string) => {
  const result = assumptionsSchema.safeParse(values);
  if (result.success) return undefined;
  return result.error.issues.find((i) => i.path[0] === field)?.message;
};

describe('assumptionsSchema', () => {
  it('accepte les hypothèses de la maquette', () => {
    expect(assumptionsSchema.safeParse(valid).success).toBe(true);
  });

  it('signale les champs obligatoires vides', () => {
    const result = assumptionsSchema.safeParse(EMPTY_ASSUMPTIONS_FORM);
    expect(result.success).toBe(false);
    const fields = result.success ? [] : result.error.issues.map((i) => i.path[0]);
    expect(fields).toEqual(expect.arrayContaining(['initialInvestment', 'monthlyRevenue', 'fixedCharges', 'variableChargesPct', 'ownContribution']));
    expect(fields).not.toContain('loanAmount');
    expect(fields).not.toContain('discountRatePct');
  });

  it('refuse des revenus à 0 et des charges variables >= 100 %', () => {
    expect(firstMessage({ ...valid, monthlyRevenue: '0' }, 'monthlyRevenue')).toMatch(/supérieurs à 0/);
    expect(firstMessage({ ...valid, variableChargesPct: '100' }, 'variableChargesPct')).toMatch(/inférieur à 100/);
    expect(firstMessage({ ...valid, variableChargesPct: 'abc' }, 'variableChargesPct')).toBeDefined();
  });

  it('accepte les décimales avec virgule', () => {
    expect(assumptionsSchema.safeParse({ ...valid, variableChargesPct: '12,5', discountRatePct: '10,25' }).success).toBe(true);
  });
});

describe('conversions', () => {
  it('convertit formulaire <-> hypothèses', () => {
    const a = toAssumptions({ ...valid, loanAmount: '500000', discountRatePct: '12,5' });
    expect(a).toEqual({
      initialInvestment: 3000000,
      monthlyRevenue: 1200000,
      fixedCharges: 400000,
      variableChargesPct: 20,
      ownContribution: 3000000,
      loanAmount: 500000,
      discountRatePct: 12.5,
    });
    expect(toFormValues(a).discountRatePct).toBe('12,5');
  });

  it('un brouillon n’envoie que les champs lisibles', () => {
    expect(toPartialAssumptions({ ...EMPTY_ASSUMPTIONS_FORM, monthlyRevenue: '1200000' })).toEqual({ monthlyRevenue: 1200000, discountRatePct: null });
  });
});

describe('projectSchema', () => {
  it('exige un nom et un secteur', () => {
    expect(projectSchema.safeParse({ name: 'S', sector: '', horizonMonths: 12 }).success).toBe(false);
    expect(projectSchema.safeParse({ name: 'Studio web Dakar', sector: 'it_services', horizonMonths: 12 }).success).toBe(true);
  });
});
