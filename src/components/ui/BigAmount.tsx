import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CURRENCY } from '../../domain/types';
import { Text, type TextTone } from './Text';

export interface BigAmountProps {
  /** Montant déjà formaté (voir `formatAmount` / `formatSignedAmount`). */
  value: string;
  /** `onPrimary` sur un bandeau vert profond, `danger` sur une alerte. */
  tone?: Extract<TextTone, 'onPrimary' | 'danger' | 'text'>;
  variant?: 'display' | 'metric';
}

const CURRENCY_TONE: Record<NonNullable<BigAmountProps['tone']>, TextTone> = {
  onPrimary: 'onPrimaryMuted',
  danger: 'danger',
  text: 'textSecondary',
};

/** Montant mis en avant, suivi de la devise en petit. */
export const BigAmount: React.FC<BigAmountProps> = ({
  value,
  tone = 'onPrimary',
  variant = 'display',
}) => (
  <View style={styles.row} accessible accessibilityLabel={`${value} ${CURRENCY}`}>
    <Text variant={variant} tone={tone}>
      {value}
    </Text>
    <Text variant="label" tone={CURRENCY_TONE[tone]}>
      {CURRENCY}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
});
