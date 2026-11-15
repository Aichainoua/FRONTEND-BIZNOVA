import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { useColors } from '../../theme';
import { layout, radius, shadows } from '../../theme/spacing';
import { Text } from './Text';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  /** `primary` : action principale de l'écran. `outline` : action secondaire. */
  variant?: 'primary' | 'outline';
  /** Icône Lucide affichée après le libellé. */
  icon?: LucideIcon;
  disabled?: boolean;
  loading?: boolean;
  /** Ombre portée (réservée aux actions de sortie comme l'export PDF). */
  elevated?: boolean;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  icon: Icon,
  disabled = false,
  loading = false,
  elevated = false,
  accessibilityHint,
  style,
}) => {
  const colors = useColors();
  const isPrimary = variant === 'primary';
  const inactive = disabled || loading;

  const backgroundColor = isPrimary ? colors.primary : colors.surface;
  const borderColor = isPrimary ? colors.primary : colors.border;
  const foreground = isPrimary ? colors.onPrimary : colors.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: inactive, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor, borderColor, opacity: inactive ? 0.5 : pressed ? 0.88 : 1 },
        elevated && isPrimary ? shadows.elevatedAction : null,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={foreground} />
      ) : (
        <View style={styles.content}>
          <Text variant="bodyStrong" style={{ color: foreground }}>
            {title}
          </Text>
          {Icon ? <Icon size={18} color={foreground} strokeWidth={2} /> : null}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    minHeight: layout.controlHeight,
    borderRadius: radius.lg,
    borderWidth: 1,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
});
