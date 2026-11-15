import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { useSessionStore } from '../stores/sessionStore';
import { MainTabs } from './MainTabs';
import { ROOT_SCREENS } from './routes';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

/** Pile racine : connexion tant que la session est fermée, application ensuite. */
export const AppNavigator: React.FC = () => {
  const isSignedIn = useSessionStore((state) => state.status === 'signedIn');

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      {isSignedIn ? (
        <Stack.Screen name={ROOT_SCREENS.MAIN} component={MainTabs} />
      ) : (
        <Stack.Screen name={ROOT_SCREENS.LOGIN} component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};
