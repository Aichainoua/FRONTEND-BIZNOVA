import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../../theme/tokens';

type Variant = 'info' | 'warning' | 'danger' | 'success';

const THEME = {
  info: { bg: colors.infoBg, border: colors.infoBorder, fg: colors.primary, Icon: Info },
  warning: { bg: colors.warningBg, border: colors.warningBorder, fg: colors.warningText, Icon: TriangleAlert },
  danger: { bg: colors.dangerBg, border: colors.dangerBorder, fg: colors.dangerText, Icon: CircleAlert },
  success: { bg: colors.successBg, border: colors.infoBorder, fg: colors.primary, Icon: CircleCheck },
} as const;

interface Props {
  variant?: Variant;
  title?: string;
  children?: ReactNode;
  action?: ReactNode;
}

export function Banner({ variant = 'info', title, children, action }: Props) {
  const t = THEME[variant];
  return (
    <View accessibilityRole={variant === 'danger' ? 'alert' : undefined} style={[styles.box, { backgroundColor: t.bg, borderColor: t.border }]}>
      <t.Icon size={20} color={t.fg} style={styles.icon} />
      <View style={styles.body}>
        {title ? <Text style={[styles.title, { color: t.fg }]}>{title}</Text> : null}
        {children ? <Text style={[styles.text, { color: variant === 'info' || variant === 'success' ? colors.text : t.fg }]}>{children}</Text> : null}
        {action}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flexDirection: 'row', gap: spacing.md, padding: spacing.lg, borderRadius: radius.md, borderWidth: 1 },
  icon: { marginTop: 1 },
  body: { flex: 1, gap: 4 },
  title: { fontSize: 15, fontWeight: '800' },
  text: { fontSize: 13.5, lineHeight: 19 },
});
