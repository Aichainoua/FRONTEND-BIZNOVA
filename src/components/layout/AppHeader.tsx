import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { useCurrentUser } from '../../hooks/useBusiness';
import { useColors } from '../../theme';
import { layout, radius } from '../../theme/spacing';
import { Text } from '../ui/Text';

/** En-tête commun : retour (si possible), marque, avatar de l'utilisateur. */
export const AppHeader: React.FC = () => {
  const colors = useColors();
  const navigation = useNavigation();
  const { initials } = useCurrentUser();
  const canGoBack = navigation.canGoBack();

  return (
    <View style={styles.header}>
      <View style={styles.left}>
        {canGoBack ? (
          <Pressable
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Retour"
            hitSlop={12}
            style={styles.back}
          >
            <ArrowLeft size={20} color={colors.primary} />
          </Pressable>
        ) : null}
        <Text variant="brand" tone="primary" accessibilityRole="header">
          biznova
        </Text>
      </View>
      <View
        accessible
        accessibilityLabel={`Profil ${initials}`}
        style={[styles.avatar, { backgroundColor: colors.primarySoft }]}
      >
        <Text variant="microStrong" tone="primary" style={styles.initials}>
          {initials}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 56,
    paddingHorizontal: layout.screenPadding,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  back: {
    minWidth: 24,
    minHeight: layout.minTouchTarget,
    justifyContent: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontSize: 11,
    textTransform: 'none',
    letterSpacing: 0,
  },
});
