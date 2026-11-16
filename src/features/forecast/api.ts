import { api } from '../../api/client';
import { endpoints } from '../../api/endpoints';
import type {
  ForecastReport,
  ForecastResults,
  Project,
  ProjectPayload,
  ProjectSummary,
  RecentWorkItem,
  SaveAssumptionsPayload,
  SectorConfig,
} from './types';

export const forecastApi = {
  sectors: async () => (await api.get<SectorConfig[]>(endpoints.sectors)).data,
  recentWork: async () => (await api.get<RecentWorkItem[]>(endpoints.home.recentWork)).data,
  listProjects: async () => (await api.get<ProjectSummary[]>(endpoints.projects.list)).data,
  getProject: async (id: string) => (await api.get<Project>(endpoints.projects.detail(id))).data,
  createProject: async (payload: ProjectPayload) => (await api.post<Project>(endpoints.projects.list, payload)).data,
  updateProject: async (id: string, payload: Partial<ProjectPayload>) =>
    (await api.patch<Project>(endpoints.projects.detail(id), payload)).data,
  saveAssumptions: async (id: string, payload: SaveAssumptionsPayload) =>
    (await api.put<Project>(endpoints.projects.assumptions(id), payload)).data,
  getResults: async (id: string) => (await api.get<ForecastResults>(endpoints.projects.results(id))).data,
  getReport: async (id: string) => (await api.get<ForecastReport>(endpoints.projects.report(id))).data,
};
