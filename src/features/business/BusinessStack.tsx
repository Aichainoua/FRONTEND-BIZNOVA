import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { BusinessStackParamList } from '../../navigation/routes';
import { colors } from '../../theme/tokens';
import { AddOperationScreen } from './screens/AddOperationScreen';
import { BudgetScreen } from './screens/BudgetScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { OperationsScreen } from './screens/OperationsScreen';
import { SetupScreen } from './screens/SetupScreen';
import { useBusinessStore } from './store';

const Stack = createNativeStackNavigator<BusinessStackParamList>();

function BusinessHomeScreen() {
  const business = useBusinessStore((state) => state.business);
  return business ? <DashboardScreen /> : <SetupScreen />;
}

export function BusinessStack() {
  return (
    <Stack.Navigator
      initialRouteName="BusinessHome"
      screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}
    >
      <Stack.Screen name="BusinessHome" component={BusinessHomeScreen} />
      <Stack.Screen name="Operations" component={OperationsScreen} />
      <Stack.Screen name="AddOperation" component={AddOperationScreen} />
      <Stack.Screen name="Budget" component={BudgetScreen} />
    </Stack.Navigator>
  );
}
