import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { forecastApi } from './api';
import { DEFAULT_SECTORS } from './sectors';
import type { Project, ProjectPayload, SaveAssumptionsPayload } from './types';

export const forecastKeys = {
  sectors: ['sectors'] as const,
  recentWork: ['recent-work'] as const,
  projects: ['projects'] as const,
  project: (id: string) => ['projects', id] as const,
  results: (id: string) => ['projects', id, 'results'] as const,
  report: (id: string) => ['projects', id, 'report'] as const,
};

export const useSectors = () =>
  useQuery({
    queryKey: forecastKeys.sectors,
    queryFn: forecastApi.sectors,
    staleTime: 60 * 60 * 1000,
    placeholderData: DEFAULT_SECTORS, // le formulaire reste utilisable même si l'API de config tarde
  });

export const useRecentWork = () =>
  useQuery({ queryKey: forecastKeys.recentWork, queryFn: forecastApi.recentWork });

export const useProjects = () => useQuery({ queryKey: forecastKeys.projects, queryFn: forecastApi.listProjects });

export const useProject = (id: string | undefined) =>
  useQuery({
    queryKey: forecastKeys.project(id ?? 'new'),
    queryFn: () => forecastApi.getProject(id as string),
    enabled: Boolean(id),
  });

export const useResults = (id: string) =>
  useQuery({ queryKey: forecastKeys.results(id), queryFn: () => forecastApi.getResults(id), retry: false });

export const useReport = (id: string) =>
  useQuery({ queryKey: forecastKeys.report(id), queryFn: () => forecastApi.getReport(id), retry: false });

function useAfterProjectChange() {
  const queryClient = useQueryClient();
  return (project: Project) => {
    queryClient.setQueryData(forecastKeys.project(project.id), project);
    // Les hypothèses ont pu changer : résultats et rapport doivent être recalculés par le serveur.
    queryClient.removeQueries({ queryKey: forecastKeys.results(project.id) });
    queryClient.removeQueries({ queryKey: forecastKeys.report(project.id) });
    void queryClient.invalidateQueries({ queryKey: forecastKeys.projects, exact: true });
    void queryClient.invalidateQueries({ queryKey: forecastKeys.recentWork });
  };
}

export function useCreateProject() {
  const after = useAfterProjectChange();
  return useMutation({ mutationFn: (payload: ProjectPayload) => forecastApi.createProject(payload), onSuccess: after });
}

export function useUpdateProject(id: string) {
  const after = useAfterProjectChange();
  return useMutation({
    mutationFn: (payload: Partial<ProjectPayload>) => forecastApi.updateProject(id, payload),
    onSuccess: after,
  });
}

export function useSaveAssumptions(id: string) {
  const after = useAfterProjectChange();
  return useMutation({
    mutationFn: (payload: SaveAssumptionsPayload) => forecastApi.saveAssumptions(id, payload),
    onSuccess: after,
  });
}
