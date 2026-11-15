import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useColors } from '../../theme';
import { radius } from '../../theme/spacing';

export interface ProgressBarProps {
  /** Ratio consommé (1 = 100 %). Au-delà de 1, la jauge reste pleine. */
  ratio: number;
  /** `onDark` : sur un bandeau vert profond. `danger` : budget dépassé. */
  tone?: 'brand' | 'onDark' | 'danger';
  accessibilityLabel?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  ratio,
  tone = 'brand',
  accessibilityLabel,
}) => {
  const colors = useColors();

  const palette = {
    brand: { track: colors.surfaceMuted, trackOpacity: 1, fill: colors.primary },
    onDark: { track: colors.onPrimaryMuted, trackOpacity: 0.25, fill: colors.primaryTint },
    danger: { track: colors.danger, trackOpacity: 0.18, fill: colors.danger },
  }[tone];

  const clamped = Math.max(0, Math.min(1, Number.isFinite(ratio) ? ratio : 0));

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
      style={styles.container}
    >
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: palette.track, opacity: palette.trackOpacity },
        ]}
      />
      <View
        style={[styles.fill, { width: `${clamped * 100}%`, backgroundColor: palette.fill }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 8,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  fill: {
    height: 8,
    borderRadius: radius.pill,
  },
});
