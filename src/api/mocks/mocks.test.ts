import axios from 'axios';
import { installMocks } from './index';

// Parcours complet contre l'API de démonstration : connexion -> projet -> hypothèses -> résultats -> rapport.
describe('API de démonstration', () => {
  const client = axios.create({ baseURL: 'http://mock' });
  installMocks(client, { delay: 0 });

  const login = async () => {
    const { data } = await client.post('/auth/login', { email: 'amina.diop@email.com', password: 'Biznova2026' });
    return { headers: { Authorization: `Bearer ${data.accessToken}` } };
  };

  it('refuse un mauvais mot de passe et une requête sans token', async () => {
    await expect(client.post('/auth/login', { email: 'amina.diop@email.com', password: 'faux' })).rejects.toMatchObject({ response: { status: 401 } });
    await expect(client.get('/projects')).rejects.toMatchObject({ response: { status: 401 } });
  });

  it('refuse un email déjà utilisé à l’inscription (409)', async () => {
    await expect(client.post('/auth/register', { fullName: 'X Y', email: 'amina.diop@email.com', password: 'Abcdef12', acceptedTerms: true })).rejects.toMatchObject({ response: { status: 409 } });
  });

  it('déroule le workflow A', async () => {
    const auth = await login();
    const created = (await client.post('/projects', { name: 'Boutique Douala', sector: 'commerce', horizonMonths: 24 }, auth)).data;
    expect(created.status).toBe('draft');
    expect(created.endDate).toMatch(/-12-31$/);

    // Résultats impossibles tant que les hypothèses sont incomplètes.
    await expect(client.get(`/projects/${created.id}/results`, auth)).rejects.toMatchObject({ response: { status: 409 } });

    // Brouillon partiel accepté, version finale refusée si incomplète.
    const draft = (await client.put(`/projects/${created.id}/assumptions`, { assumptions: { monthlyRevenue: 900000 }, draft: true }, auth)).data;
    expect(draft.draftSavedAt).not.toBeNull();
    await expect(client.put(`/projects/${created.id}/assumptions`, { assumptions: {}, draft: false }, auth)).rejects.toMatchObject({ response: { status: 422 } });

    const full = { initialInvestment: 2_000_000, monthlyRevenue: 900_000, fixedCharges: 300_000, variableChargesPct: 30, ownContribution: 2_000_000, loanAmount: 0, discountRatePct: 10 };
    const saved = (await client.put(`/projects/${created.id}/assumptions`, { assumptions: full, draft: false }, auth)).data;
    expect(saved.status).toBe('assumptions_saved');
    expect(saved.resumeStep).toBe(3);

    const results = (await client.get(`/projects/${created.id}/results`, auth)).data;
    expect(results.horizonMonths).toBe(24);
    expect(results.treasury.series).toHaveLength(25);
    expect(results.npv).not.toBeNull();

    const report = (await client.get(`/projects/${created.id}/report`, auth)).data;
    expect(report.risks.length).toBeGreaterThan(0);
  });

  it('liste l’accueil avec projets et suivi réel', async () => {
    const auth = await login();
    const items = (await client.get('/me/recent-work', auth)).data as { kind: string }[];
    expect(items.some((i) => i.kind === 'forecast')).toBe(true);
    expect(items.some((i) => i.kind === 'tracking')).toBe(true);
  });
});
