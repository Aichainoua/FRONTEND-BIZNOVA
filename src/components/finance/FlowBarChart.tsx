import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { WeeklyFlow } from '../../domain/finance';
import { useColors } from '../../theme';
import { radius } from '../../theme/spacing';
import { formatAmount } from '../../utils/format';
import { Text } from '../ui/Text';

const MAX_BAR_HEIGHT = 100;
const MIN_BAR_HEIGHT = 2;
const BAR_WIDTH = 21;

export interface FlowBarChartProps {
  flows: readonly WeeklyFlow[];
}

const inThousands = (amount: number): string => formatAmount(Math.round(amount / 1000));

/**
 * Recettes et dépenses par tranche de jours.
 * Volontairement sans bibliothèque de graphiques : 4 groupes de 2 barres suffisent
 * et la valeur est écrite au-dessus de chaque barre (lisible sans interaction).
 */
export const FlowBarChart: React.FC<FlowBarChartProps> = ({ flows }) => {
  const colors = useColors();
  const max = Math.max(1, ...flows.flatMap((flow) => [flow.income, flow.expense]));
  const heightOf = (amount: number): number =>
    amount <= 0 ? MIN_BAR_HEIGHT : Math.max(MIN_BAR_HEIGHT, (amount / max) * MAX_BAR_HEIGHT);

  const summary = flows
    .map(
      (flow) =>
        `Jours ${flow.label} : recettes ${inThousands(flow.income)} milliers, dépenses ${inThousands(flow.expense)} milliers de FCFA`,
    )
    .join(' ; ');

  return (
    <View accessible accessibilityRole="image" accessibilityLabel={`Flux du mois. ${summary}`}>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: colors.primary }]} />
          <Text variant="small" tone="primary">
            Recettes
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: colors.primaryTint }]} />
          <Text variant="small" tone="textSecondary">
            Dépenses
          </Text>
        </View>
      </View>
      <Text variant="micro" tone="textSecondary" style={styles.unit}>
        En milliers de FCFA · valeur au-dessus des barres
      </Text>

      <View style={styles.chart}>
        {flows.map((flow) => (
          <View key={flow.label} style={styles.group}>
            <View style={styles.bars}>
              <View style={styles.bar}>
                <Text variant="chart" tone="textSecondary">
                  {inThousands(flow.income)}
                </Text>
                <View
                  style={[
                    styles.fill,
                    { height: heightOf(flow.income), backgroundColor: colors.primary },
                  ]}
                />
              </View>
              <View style={styles.bar}>
                <Text variant="chart" tone="textSecondary">
                  {inThousands(flow.expense)}
                </Text>
                <View
                  style={[
                    styles.fill,
                    { height: heightOf(flow.expense), backgroundColor: colors.primaryTint },
                  ]}
                />
              </View>
            </View>
            <Text variant="micro" tone="textSecondary">
              {flow.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  legend: {
    flexDirection: 'row',
    gap: 18,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radius.pill,
  },
  unit: {
    marginTop: 8,
    marginBottom: 14,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  group: {
    width: 66,
    alignItems: 'center',
    gap: 8,
  },
  bars: {
    height: MAX_BAR_HEIGHT + 26,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  bar: {
    alignItems: 'center',
    gap: 4,
  },
  fill: {
    width: BAR_WIDTH,
    borderRadius: radius.xs,
  },
});
