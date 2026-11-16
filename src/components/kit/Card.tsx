import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radius, spacing } from '../../theme/tokens';

interface Props {
  children: ReactNode;
  tone?: 'default' | 'dark' | 'soft';
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

export function Card({ children, tone = 'default', onPress, accessibilityLabel, style }: Props) {
  const toneStyle = tone === 'dark' ? styles.dark : tone === 'soft' ? styles.soft : styles.default;
  if (onPress) {
    return (
      <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel} onPress={onPress} style={({ pressed }) => [styles.base, toneStyle, pressed && styles.pressed, style]}>
        {children}
      </Pressable>
    );
  }
  return <View style={[styles.base, toneStyle, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  base: { borderRadius: radius.lg, padding: spacing.lg, gap: spacing.sm },
  default: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  soft: { backgroundColor: colors.primarySoft, borderWidth: 1, borderColor: colors.infoBorder },
  dark: { backgroundColor: colors.primary },
  pressed: { opacity: 0.85 },
});
