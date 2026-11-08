import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  type TouchableOpacityProps,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { useThemeStore } from '../../stores/themeStore';
import { spacing, typography } from '../../theme/spacing';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  style,
  textStyle,
  ...props
}) => {
  const { colors } = useThemeStore();

  const getBackgroundColor = () => {
    if (disabled) return colors.border;
    if (variant === 'primary') return colors.primary;
    if (variant === 'secondary') return colors.surface;
    if (variant === 'danger') return colors.danger;
    return 'transparent';
  };

  const getTextColor = () => {
    if (disabled) return colors.textSecondary;
    if (variant === 'primary' || variant === 'danger') return '#FFFFFF';
    if (variant === 'outline') return colors.text;
    return colors.text;
  };

  const getPadding = () => {
    if (size === 'sm') return { paddingVertical: spacing.xs + 2, paddingHorizontal: spacing.sm };
    if (size === 'lg') return { paddingVertical: spacing.md, paddingHorizontal: spacing.lg };
    return { paddingVertical: spacing.sm + 4, paddingHorizontal: spacing.md };
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getPadding(),
        {
          backgroundColor: getBackgroundColor(),
          borderColor: variant === 'outline' ? colors.border : 'transparent',
          borderWidth: variant === 'outline' ? 1 : 0,
        },
        style,
      ]}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <Text
          style={[
            styles.text,
            {
              color: getTextColor(),
              fontSize: size === 'sm' ? typography.fontSize.sm : typography.fontSize.md,
            },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    fontWeight: '600',
  },
});
