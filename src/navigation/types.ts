import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OperationType, OperationTypeFilter } from '../domain/types';

/** Pile « Entreprise » : configuration, puis tableau de bord et ses écrans. */
export type BusinessStackParamList = {
  BusinessSetup: undefined;
  Dashboard: undefined;
  /** `type` pré-sélectionne le filtre Tout / Recettes / Dépenses. */
  Operations: { type?: OperationTypeFilter } | undefined;
  AddOperation: { type?: OperationType } | undefined;
  Budget: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Projects: undefined;
  Business: NavigatorScreenParams<BusinessStackParamList> | undefined;
  Reports: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
};

export type RootScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

/** Props d'un écran d'onglet : permet aussi de naviguer vers les autres onglets. */
export type TabScreenProps<T extends keyof MainTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, T>,
  RootScreenProps<keyof RootStackParamList>
>;

/** Props d'un écran de la pile Entreprise : pile locale + onglets + racine. */
export type BusinessScreenProps<T extends keyof BusinessStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<BusinessStackParamList, T>,
  TabScreenProps<'Business'>
>;
