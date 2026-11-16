import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AssumptionsScreen } from '../features/forecast/screens/AssumptionsScreen';
import { ProjectListScreen } from '../features/forecast/screens/ProjectListScreen';
import { ProjectStep1Screen } from '../features/forecast/screens/ProjectStep1Screen';
import { ReportScreen } from '../features/forecast/screens/ReportScreen';
import { ResultsScreen } from '../features/forecast/screens/ResultsScreen';
import { WorkflowADetailScreen } from '../features/workflowA/WorkflowADetailScreen';
import { WorkflowAScreen } from '../features/workflowA/WorkflowAScreen';
import { colors } from '../theme/tokens';
import type { ProjectsStackParamList } from './routes';

const Stack = createNativeStackNavigator<ProjectsStackParamList>();

export function ProjectsStack() {
  return (
    <Stack.Navigator initialRouteName="ProjectList" screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
      <Stack.Screen name="ProjectList" component={ProjectListScreen} />
      <Stack.Screen name="WorkflowA" component={WorkflowAScreen} />
      <Stack.Screen name="WorkflowADetail" component={WorkflowADetailScreen} />
      <Stack.Screen name="ForecastProject" component={ProjectStep1Screen} />
      <Stack.Screen name="ForecastAssumptions" component={AssumptionsScreen} />
      <Stack.Screen name="ForecastResults" component={ResultsScreen} />
      <Stack.Screen name="ForecastReport" component={ReportScreen} />
    </Stack.Navigator>
  );
}
