import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { CURRENCY } from '../../domain/types';
import { useColors } from '../../theme';
import { radius } from '../../theme/spacing';
import { textStyles } from '../../theme/typography';
import { formatAmount, parseAmountInput } from '../../utils/format';
import { Text } from '../ui/Text';
import { Field, FieldBox } from './Field';

export interface AmountInputProps {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  required?: boolean;
  helper?: string;
  error?: string;
}

/** Champ de montant en FCFA : chiffres uniquement, espaces de milliers automatiques. */
export const AmountInput: React.FC<AmountInputProps> = ({
  label,
  value,
  onChange,
  required,
  helper,
  error,
}) => {
  const colors = useColors();
  const [focused, setFocused] = useState(false);

  return (
    <Field label={label} required={required} helper={helper} error={error}>
      <FieldBox focused={focused} invalid={Boolean(error)}>
        <TextInput
          accessibilityLabel={label}
          keyboardType="number-pad"
          inputMode="numeric"
          placeholder="0"
          placeholderTextColor={colors.textSecondary}
          selectionColor={colors.primary}
          maxFontSizeMultiplier={1.3}
          value={value === null ? '' : formatAmount(value)}
          onChangeText={(text) => onChange(parseAmountInput(text))}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[styles.input, textStyles.lead, { color: colors.text }]}
        />
        <Text variant="caption" tone="textSecondary">
          {CURRENCY}
        </Text>
      </FieldBox>
    </Field>
  );
};

export interface AmountHeroProps {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  /** `income` : fond vert clair. `expense` : fond neutre. */
  tone: 'income' | 'expense';
  helper: string;
  error?: string;
}

/** Saisie du montant d'une opération : le champ le plus important du formulaire, donc le plus grand. */
export const AmountHero: React.FC<AmountHeroProps> = ({ label, value, onChange, tone, helper, error }) => {
  const colors = useColors();
  const [focused, setFocused] = useState(false);

  return (
    <View
      style={[
        styles.hero,
        {
          backgroundColor: tone === 'income' ? colors.primarySoft : colors.surfaceMuted,
          borderColor: error ? colors.danger : focused ? colors.primary : 'transparent',
        },
      ]}
    >
      <Text variant="label">{`${label} *`}</Text>
      <View style={styles.amountRow}>
        <TextInput
          accessibilityLabel={label}
          keyboardType="number-pad"
          inputMode="numeric"
          placeholder="0"
          placeholderTextColor={colors.textSecondary}
          selectionColor={colors.primary}
          maxFontSizeMultiplier={1.2}
          value={value === null ? '' : formatAmount(value)}
          onChangeText={(text) => onChange(parseAmountInput(text))}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[styles.heroInput, textStyles.display, { color: colors.text }]}
        />
        <Text variant="label" tone="primary">
          {CURRENCY}
        </Text>
      </View>
      {error ? (
        <Text variant="caption" tone="danger" accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : (
        <Text variant="caption" tone="textSecondary">
          {helper}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    flex: 1,
    paddingVertical: 12,
  },
  hero: {
    borderRadius: radius.xxl,
    borderWidth: 1.5,
    padding: 22,
    gap: 10,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
  },
  heroInput: {
    flex: 1,
    paddingVertical: 0,
  },
});
