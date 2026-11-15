import React from 'react';
import { StyleSheet } from 'react-native';
import { Card } from './Card';
import { Text } from './Text';

export interface StatCardProps {
  label: string;
  value: string;
  caption?: string;
}

/** Indicateur clé : une valeur, son libellé et un complément (ex. nombre d'opérations). */
export const StatCard: React.FC<StatCardProps> = ({ label, value, caption }) => (
  <Card style={styles.card} accessible accessibilityLabel={`${label} : ${value}. ${caption ?? ''}`}>
    <Text variant="caption" tone="textSecondary">
      {label}
    </Text>
    <Text variant="metric">{value}</Text>
    {caption ? (
      <Text variant="small" tone="textSecondary">
        {caption}
      </Text>
    ) : null}
  </Card>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 15,
    gap: 8,
    borderRadius: 16,
  },
});
