import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColors } from '../../theme';
import { layout } from '../../theme/spacing';
import { AppHeader } from './AppHeader';

export interface ScreenProps {
  children: React.ReactNode;
  /** Masque l'en-tête (écrans plein cadre). */
  hideHeader?: boolean;
}

/**
 * Gabarit de tous les écrans : zone sûre, en-tête de marque, contenu défilant
 * avec les marges et l'espacement vertical de la maquette (24 px / 16 px).
 */
export const Screen: React.FC<ScreenProps> = ({ children, hideHeader = false }) => {
  const colors = useColors();

  return (
    <SafeAreaView edges={['top']} style={[styles.root, { backgroundColor: colors.background }]}>
      {hideHeader ? null : <AppHeader />}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: 18,
    paddingBottom: 28,
    gap: 16,
  },
});
