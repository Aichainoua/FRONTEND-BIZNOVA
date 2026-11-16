import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Building2, FileText, FolderOpen, House } from 'lucide-react-native';
import { ComingSoonScreen } from '../features/common/ComingSoonScreen';
import { HomeScreen } from '../features/home/HomeScreen';
import { colors } from '../theme/tokens';
import { ProjectsStack } from './ProjectsStack';
import type { AppTabParamList } from './routes';

const Tab = createBottomTabNavigator<AppTabParamList>();

// F2 remplacera ces deux écrans temporaires par le suivi réel et la liste des rapports.
const CompanyScreen = () => <ComingSoonScreen title="Entreprise" description="Le suivi réel de votre entreprise arrive bientôt." />;
const ReportsScreen = () => <ComingSoonScreen title="Rapports" description="Retrouvez ici tous vos rapports enregistrés." />;

export function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 12, fontWeight: '700' },
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Accueil', tabBarIcon: ({ color, size }) => <House color={color} size={size} /> }} />
      <Tab.Screen name="Projects" component={ProjectsStack} options={{ title: 'Projets', tabBarIcon: ({ color, size }) => <FolderOpen color={color} size={size} /> }} />
      <Tab.Screen name="Company" component={CompanyScreen} options={{ title: 'Entreprise', tabBarIcon: ({ color, size }) => <Building2 color={color} size={size} /> }} />
      <Tab.Screen name="Reports" component={ReportsScreen} options={{ title: 'Rapports', tabBarIcon: ({ color, size }) => <FileText color={color} size={size} /> }} />
    </Tab.Navigator>
  );
}
