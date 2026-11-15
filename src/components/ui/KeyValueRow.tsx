import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useColors } from '../../theme';
import { Text, type TextTone } from './Text';

export interface KeyValueRowProps {
  label: string;
  value: string;
  /** Couleur de la valeur (vert pour un résultat positif, rouge pour un dépassement). */
  valueTone?: Extract<TextTone, 'text' | 'primary' | 'danger'>;
  /** Valeur en gras : à réserver à la ligne de conclusion d'un bloc. */
  strong?: boolean;
}

/** Ligne « libellé … valeur » des cartes de synthèse. */
export const KeyValueRow: React.FC<KeyValueRowProps> = ({
  label,
  value,
  valueTone = 'text',
  strong = false,
}) => (
  <View style={styles.row} accessible accessibilityLabel={`${label} : ${value}`}>
    <Text variant="body" tone="textSecondary" style={styles.label}>
      {label}
    </Text>
    <Text variant={strong ? 'valueStrong' : 'bodyStrong'} tone={valueTone}>
      {value}
    </Text>
  </View>
);

/** Filet de séparation entre deux blocs d'une carte. */
export const Divider: React.FC = () => {
  const colors = useColors();
  return <View style={[styles.divider, { backgroundColor: colors.border }]} />;
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  label: {
    flex: 1,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
  },
});
