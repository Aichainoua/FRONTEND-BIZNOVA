import { StyleSheet, Text } from 'react-native';
import { colors, typography } from '../../theme/tokens';
import { Card } from './Card';

interface Props {
  label: string;
  value: string;
  unit?: string;
  note?: string;
}

export function KpiCard({ label, value, unit, note }: Props) {
  return (
    <Card style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={typography.kpi} accessibilityLabel={`${label} : ${value}${unit ? ` ${unit}` : ''}`}>
        {value}
      </Text>
      {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      {note ? <Text style={typography.helper}>{note}</Text> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, gap: 4 },
  label: { fontSize: 13.5, fontWeight: '700', color: colors.textMuted },
  unit: { fontSize: 12.5, fontWeight: '700', color: colors.textMuted },
});
