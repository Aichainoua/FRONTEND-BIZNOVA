import { Check } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme/tokens';

interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
  error?: string;
}

export function Checkbox({ checked, onChange, children, error }: Props) {
  return (
    <View style={styles.wrap}>
      <Pressable accessibilityRole="checkbox" accessibilityState={{ checked }} onPress={() => onChange(!checked)} style={styles.row}>
        <View style={[styles.box, checked && styles.boxChecked, Boolean(error) && !checked && styles.boxError]}>
          {checked ? <Check size={16} color={colors.textOnPrimary} strokeWidth={3} /> : null}
        </View>
        <Text style={[typography.helper, styles.label]}>{children}</Text>
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  box: { width: 24, height: 24, borderRadius: 6, borderWidth: 1.5, borderColor: colors.borderStrong, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  boxChecked: { backgroundColor: colors.primary, borderColor: colors.primary },
  boxError: { borderColor: colors.dangerText },
  label: { flex: 1, color: colors.text },
  error: { fontSize: 12.5, color: colors.dangerText, fontWeight: '600', marginLeft: 36 },
});
