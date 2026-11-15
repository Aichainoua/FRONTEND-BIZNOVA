import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AddOperationScreen } from '../screens/business/AddOperationScreen';
import { BudgetScreen } from '../screens/business/BudgetScreen';
import { DashboardScreen } from '../screens/business/DashboardScreen';
import { OperationsScreen } from '../screens/business/OperationsScreen';
import { SetupScreen } from '../screens/business/SetupScreen';
import { useBusinessStore } from '../stores/businessStore';
import { BUSINESS_SCREENS } from './routes';
import type { BusinessStackParamList } from './types';

const Stack = createNativeStackNavigator<BusinessStackParamList>();

/**
 * Pile du parcours B (suivi d'une entreprise).
 * Tant qu'aucune entreprise n'est configurée, seul l'écran de configuration existe ;
 * une fois créée, la pile bascule d'elle-même sur le tableau de bord.
 */
export const BusinessNavigator: React.FC = () => {
  const isConfigured = useBusinessStore((state) => state.business !== null);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      {isConfigured ? (
        <>
          <Stack.Screen name={BUSINESS_SCREENS.DASHBOARD} component={DashboardScreen} />
          <Stack.Screen name={BUSINESS_SCREENS.OPERATIONS} component={OperationsScreen} />
          <Stack.Screen name={BUSINESS_SCREENS.ADD_OPERATION} component={AddOperationScreen} />
          <Stack.Screen name={BUSINESS_SCREENS.BUDGET} component={BudgetScreen} />
        </>
      ) : (
        <Stack.Screen name={BUSINESS_SCREENS.SETUP} component={SetupScreen} />
      )}
    </Stack.Navigator>
  );
};
