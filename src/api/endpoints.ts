// Contrat proposé : à aligner avec le fichier OpenAPI de B1 / B2 (sprint 0).
export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    forgotPassword: '/auth/forgot-password',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    me: '/auth/me',
  },
  home: { recentWork: '/me/recent-work' },
  sectors: '/config/sectors',
  projects: {
    list: '/projects',
    detail: (id: string) => `/projects/${id}`,
    assumptions: (id: string) => `/projects/${id}/assumptions`,
    results: (id: string) => `/projects/${id}/results`,
    report: (id: string) => `/projects/${id}/report`,
    reportPdf: (id: string) => `/projects/${id}/report/pdf`,
  },
} as const;
