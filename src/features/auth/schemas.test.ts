import { loginSchema, registerSchema } from './schemas';

const valid = { fullName: 'Amina Diop', email: 'amina.diop@email.com', password: 'Biznova2026', confirmPassword: 'Biznova2026', acceptedTerms: true };

describe('registerSchema', () => {
  it('accepte une inscription valide', () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it('refuse un mot de passe sans chiffre ou trop court', () => {
    expect(registerSchema.safeParse({ ...valid, password: 'motdepasse', confirmPassword: 'motdepasse' }).success).toBe(false);
    expect(registerSchema.safeParse({ ...valid, password: 'abc1', confirmPassword: 'abc1' }).success).toBe(false);
  });

  it('refuse deux mots de passe différents', () => {
    const result = registerSchema.safeParse({ ...valid, confirmPassword: 'Autre2026' });
    expect(result.success).toBe(false);
    expect(result.success ? [] : result.error.issues.map((i) => i.path[0])).toContain('confirmPassword');
  });

  it('exige l’acceptation des conditions', () => {
    expect(registerSchema.safeParse({ ...valid, acceptedTerms: false }).success).toBe(false);
  });
});

describe('loginSchema', () => {
  it('valide l’email et exige un mot de passe', () => {
    expect(loginSchema.safeParse({ email: 'pas-un-email', password: 'x' }).success).toBe(false);
    expect(loginSchema.safeParse({ email: 'a@b.cm', password: '' }).success).toBe(false);
    expect(loginSchema.safeParse({ email: 'a@b.cm', password: 'x' }).success).toBe(true);
  });
});
