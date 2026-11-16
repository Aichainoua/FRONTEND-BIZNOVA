import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../../theme/tokens';

interface Props {
  current: number;
  total?: number;
  label?: string;
}

export function Stepper({ current, total = 3, label }: Props) {
  return (
    <View style={styles.wrap} accessible accessibilityLabel={`Étape ${current} sur ${total}${label ? `, ${label}` : ''}`}>
      <View style={styles.bars}>
        {Array.from({ length: total }, (_, i) => (
          <View key={i} style={[styles.bar, i < current && styles.barDone]} />
        ))}
      </View>
      {label ? (
        <Text style={styles.label}>
          Étape {current} sur {total} · {label}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm, flex: 1 },
  bars: { flexDirection: 'row', gap: 6 },
  bar: { flex: 1, height: 6, borderRadius: radius.pill, backgroundColor: colors.border },
  barDone: { backgroundColor: colors.primary },
  label: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
});
