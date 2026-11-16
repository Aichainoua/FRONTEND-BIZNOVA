import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import type { AuthResponse, User } from '../../features/auth/types';
import { defaultStartDate, endOfPeriod } from '../../features/forecast/period';
import { DEFAULT_SECTORS } from '../../features/forecast/sectors';
import type {
  Assumptions,
  ForecastReport,
  Project,
  ProjectPayload,
  ProjectSummary,
  RecentWorkItem,
  SaveAssumptionsPayload,
} from '../../features/forecast/types';
import { buildRisks, computeForecast } from './engine';

// Compte de démonstration : amina.diop@email.com / Biznova2026
const DEMO_USER: User = { id: 'u-1', fullName: 'Amina Diop', email: 'amina.diop@email.com' };
const DEMO_PASSWORD = 'Biznova2026';

type Failure = [number, { message: string }];
const fail = (status: number, message: string): Failure => [status, { message }];
const idFromUrl = (config: AxiosRequestConfig) => (config.url ?? '').split('/')[2];

function summarize(p: Project): ProjectSummary {
  const { id, name, sector, horizonMonths, status, resumeStep, updatedAt } = p;
  return { id, name, sector, horizonMonths, status, resumeStep, updatedAt };
}

function isComplete(a: Partial<Assumptions> | null): a is Assumptions {
  return !!a && ['initialInvestment', 'monthlyRevenue', 'fixedCharges', 'variableChargesPct', 'ownContribution'].every((k) => typeof a[k as keyof Assumptions] === 'number');
}

export function installMocks(client: AxiosInstance, options: { delay?: number } = {}): MockAdapter {
  const mock = new MockAdapter(client, { delayResponse: options.delay ?? 350 });

  const users = new Map<string, { user: User; password: string }>([[DEMO_USER.email, { user: DEMO_USER, password: DEMO_PASSWORD }]]);
  const projects = new Map<string, Project>();
  let counter = 1;

  const now = () => new Date().toISOString();
  const seedStart = defaultStartDate();
  projects.set('p-1', {
    id: 'p-1',
    name: 'Studio web Dakar',
    sector: 'it_services',
    horizonMonths: 12,
    status: 'assumptions_saved',
    resumeStep: 3,
    updatedAt: now(),
    startDate: seedStart,
    endDate: endOfPeriod(seedStart, 12),
    draftSavedAt: now(),
    assumptions: {
      initialInvestment: 3_000_000,
      monthlyRevenue: 1_200_000,
      fixedCharges: 400_000,
      variableChargesPct: 20,
      ownContribution: 3_000_000,
      loanAmount: 0,
      discountRatePct: null,
    },
  });

  const userFrom = (config: AxiosRequestConfig): User | null => {
    const header = String(config.headers?.Authorization ?? '');
    const id = header.replace('Bearer mock-access-', '');
    return header.startsWith('Bearer mock-access-') ? [...users.values()].map((u) => u.user).find((u) => u.id === id) ?? null : null;
  };
  const tokensFor = (user: User) => ({ accessToken: `mock-access-${user.id}`, refreshToken: `mock-refresh-${user.id}` });
  const authed = (handler: (config: AxiosRequestConfig, user: User) => [number, unknown] | Failure) => (config: AxiosRequestConfig) => {
    const user = userFrom(config);
    return user ? handler(config, user) : fail(401, 'Session expirée. Reconnectez-vous.');
  };
  const body = <T,>(config: AxiosRequestConfig): T => JSON.parse((config.data as string) ?? '{}') as T;

  // ---- Auth -------------------------------------------------------------
  mock.onPost('/auth/login').reply((config) => {
    const { email, password } = body<{ email: string; password: string }>(config);
    const account = users.get(email.trim().toLowerCase());
    if (!account || account.password !== password) return fail(401, 'Adresse email ou mot de passe incorrect.');
    const res: AuthResponse = { user: account.user, ...tokensFor(account.user) };
    return [200, res];
  });
  mock.onPost('/auth/register').reply((config) => {
    const { fullName, email, password } = body<{ fullName: string; email: string; password: string }>(config);
    const key = email.trim().toLowerCase();
    if (users.has(key)) return fail(409, 'Un compte existe déjà avec cette adresse email.');
    const user: User = { id: `u-${users.size + 1}`, fullName: fullName.trim(), email: key };
    users.set(key, { user, password });
    const res: AuthResponse = { user, ...tokensFor(user) };
    return [201, res];
  });
  mock.onPost('/auth/forgot-password').reply(204);
  mock.onPost('/auth/logout').reply(204);
  mock.onPost('/auth/refresh').reply((config) => {
    const { refreshToken } = body<{ refreshToken: string }>(config);
    const id = refreshToken.replace('mock-refresh-', '');
    const user = [...users.values()].map((u) => u.user).find((u) => u.id === id);
    return user ? [200, tokensFor(user)] : fail(401, 'Session expirée.');
  });
  mock.onGet('/auth/me').reply(authed((_c, user) => [200, user]));

  // ---- Configuration sectorielle ------------------------------------------
  mock.onGet('/config/sectors').reply(authed(() => [200, DEFAULT_SECTORS]));

  // ---- Projets ------------------------------------------------------------
  mock.onGet('/projects').reply(authed(() => [200, [...projects.values()].map(summarize).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))]));

  mock.onPost('/projects').reply(authed((config) => {
    const payload = body<ProjectPayload>(config);
    counter += 1;
    const start = defaultStartDate();
    const project: Project = {
      id: `p-${counter}`,
      name: payload.name.trim(),
      sector: payload.sector,
      horizonMonths: payload.horizonMonths,
      status: 'draft',
      resumeStep: payload.sector ? 2 : 1,
      updatedAt: now(),
      startDate: start,
      endDate: endOfPeriod(start, payload.horizonMonths),
      assumptions: null,
      draftSavedAt: null,
    };
    projects.set(project.id, project);
    return [201, project];
  }));

  mock.onGet(/^\/projects\/[^/]+$/).reply(authed((config) => {
    const project = projects.get(idFromUrl(config));
    return project ? [200, project] : fail(404, 'Projet introuvable.');
  }));

  mock.onPatch(/^\/projects\/[^/]+$/).reply(authed((config) => {
    const project = projects.get(idFromUrl(config));
    if (!project) return fail(404, 'Projet introuvable.');
    const patch = body<Partial<ProjectPayload>>(config);
    Object.assign(project, patch, { updatedAt: now() });
    project.endDate = endOfPeriod(project.startDate, project.horizonMonths);
    project.resumeStep = project.status === 'assumptions_saved' ? 3 : project.sector ? 2 : 1;
    return [200, project];
  }));

  mock.onPut(/^\/projects\/[^/]+\/assumptions$/).reply(authed((config) => {
    const project = projects.get(idFromUrl(config));
    if (!project) return fail(404, 'Projet introuvable.');
    const { assumptions, draft } = body<SaveAssumptionsPayload>(config);
    const merged = { loanAmount: 0, ...(project.assumptions ?? {}), ...assumptions };
    if (!draft && !isComplete(merged)) return fail(422, 'Hypothèses incomplètes : renseignez tous les champs obligatoires.');
    project.assumptions = merged;
    project.status = draft ? 'draft' : 'assumptions_saved';
    project.resumeStep = draft ? 2 : 3;
    project.draftSavedAt = now();
    project.updatedAt = now();
    return [200, project];
  }));

  mock.onGet(/^\/projects\/[^/]+\/results$/).reply(authed((config) => {
    const project = projects.get(idFromUrl(config));
    if (!project) return fail(404, 'Projet introuvable.');
    if (!isComplete(project.assumptions)) return fail(409, 'Complétez vos hypothèses pour voir les résultats.');
    return [200, computeForecast(project.horizonMonths, project.assumptions)];
  }));

  mock.onGet(/^\/projects\/[^/]+\/report$/).reply(authed((config) => {
    const project = projects.get(idFromUrl(config));
    if (!project) return fail(404, 'Projet introuvable.');
    if (!isComplete(project.assumptions)) return fail(409, 'Complétez vos hypothèses pour générer le rapport.');
    const results = computeForecast(project.horizonMonths, project.assumptions);
    const report: ForecastReport = {
      generatedAt: now(),
      version: 1,
      project: { id: project.id, name: project.name, sector: project.sector, horizonMonths: project.horizonMonths, startDate: project.startDate, endDate: project.endDate },
      assumptions: project.assumptions,
      results,
      risks: buildRisks(project.assumptions, results),
    };
    return [200, report];
  }));

  // ---- Accueil -------------------------------------------------------------
  mock.onGet('/me/recent-work').reply(authed(() => {
    const forecasts: RecentWorkItem[] = [...projects.values()]
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, 3)
      .map((p) => ({ kind: 'forecast', id: p.id, name: p.name, horizonMonths: p.horizonMonths, updatedAt: p.updatedAt, status: p.status, resumeStep: p.resumeStep }));
    const tracking: RecentWorkItem = { kind: 'tracking', id: 'c-1', name: 'Nova Studio', periodLabel: 'Octobre 2026', operationsCount: 7 };
    return [200, [...forecasts, tracking]];
  }));

  return mock;
}
