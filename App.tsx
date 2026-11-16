import { DefaultTheme, NavigationContainer, type Theme } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { api } from './src/api/client';
import { installMocks } from './src/api/mocks';
import { queryClient } from './src/api/queryClient';
import { env } from './src/config/env';
import { RootNavigator } from './src/navigation/RootNavigator';
import { colors } from './src/theme/tokens';

// Mode démo : l'app fonctionne sans back (EXPO_PUBLIC_USE_MOCKS=true).
if (env.useMocks) installMocks(api);

const navigationTheme: Theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.background, primary: colors.primary, card: colors.surface, text: colors.text, border: colors.border },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer theme={navigationTheme}>
          <StatusBar style="dark" />
          <RootNavigator />
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
