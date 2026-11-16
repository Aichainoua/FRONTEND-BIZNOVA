import type { NavigatorScreenParams } from '@react-navigation/native';

export const ROUTES = {
  HOME: 'Home',
  DETAILS: 'Details',
} as const;

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type ProjectsStackParamList = {
  ProjectList: undefined;
  WorkflowA: undefined;
  WorkflowADetail: undefined;
  ForecastProject: { projectId?: string }; // étape 1 sur 3
  ForecastAssumptions: { projectId: string }; // étape 2 sur 3
  ForecastResults: { projectId: string }; // étape 3 sur 3
  ForecastReport: { projectId: string };
};

export type AppTabParamList = {
  Home: undefined;
  Projects: NavigatorScreenParams<ProjectsStackParamList> | undefined;
  Company: undefined; // écrans de F2
  Reports: undefined; // écrans de F2
};
