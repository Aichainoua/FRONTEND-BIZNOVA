import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useColors } from '../../theme';
import { radius } from '../../theme/spacing';
import { Text, type TextTone } from './Text';

export interface BadgeProps {
  label: string;
  /** `brand` : état positif / repère. `neutral` : information. `danger` : alerte. */
  tone?: 'brand' | 'neutral' | 'danger';
}

/** Pastille d'état (ex. « Suivi réel », « Dans votre budget »). */
export const Badge: React.FC<BadgeProps> = ({ label, tone = 'brand' }) => {
  const colors = useColors();

  const palette: Record<NonNullable<BadgeProps['tone']>, { background: string; text: TextTone }> = {
    brand: { background: colors.primarySoft, text: 'primary' },
    neutral: { background: colors.surfaceMuted, text: 'textSecondary' },
    danger: { background: colors.dangerSoft, text: 'danger' },
  };
  const { background, text } = palette[tone];

  return (
    <View style={[styles.badge, { backgroundColor: background }]}>
      <Text variant="smallStrong" tone={text}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
});
