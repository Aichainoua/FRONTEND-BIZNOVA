import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabBar } from '../components/layout/TabBar';
import { WorkspaceScreen } from '../screens/home/WorkspaceScreen';
import { ProjectsScreen } from '../screens/projects/ProjectsScreen';
import { MonthlyReportScreen } from '../screens/reports/MonthlyReportScreen';
import { BusinessNavigator } from './BusinessNavigator';
import { TABS } from './routes';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

/** Navigation principale : Accueil · Projets · Entreprise · Rapports. */
export const MainTabs: React.FC = () => (
  <Tab.Navigator
    // « history » : la flèche retour ramène à l'onglet d'où l'on vient.
    backBehavior="history"
    tabBar={(props) => <TabBar {...props} />}
    screenOptions={{ headerShown: false }}
  >
    <Tab.Screen name={TABS.HOME} component={WorkspaceScreen} options={{ tabBarLabel: 'Accueil' }} />
    <Tab.Screen name={TABS.PROJECTS} component={ProjectsScreen} options={{ tabBarLabel: 'Projets' }} />
    <Tab.Screen
      name={TABS.BUSINESS}
      component={BusinessNavigator}
      options={{ tabBarLabel: 'Entreprise' }}
    />
    <Tab.Screen
      name={TABS.REPORTS}
      component={MonthlyReportScreen}
      options={{ tabBarLabel: 'Rapports' }}
    />
  </Tab.Navigator>
);
