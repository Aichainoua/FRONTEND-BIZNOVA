import React, { useState } from 'react';
import { StyleSheet, TextInput, type TextInputProps } from 'react-native';
import { useColors } from '../../theme';
import { textStyles } from '../../theme/typography';
import { Field, FieldBox } from '../forms/Field';
import { Text } from './Text';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label: string;
  required?: boolean;
  helper?: string;
  error?: string;
  /** Texte fixe à droite de la saisie (ex. « FCFA »). */
  suffix?: string;
  /** Élément interactif ou indicatif à droite (ex. œil du mot de passe, coche de validité). */
  trailing?: React.ReactNode;
}

/** Champ de saisie texte. */
export const Input: React.FC<InputProps> = ({
  label,
  required,
  helper,
  error,
  suffix,
  trailing,
  onFocus,
  onBlur,
  ...inputProps
}) => {
  const colors = useColors();
  const [focused, setFocused] = useState(false);

  return (
    <Field label={label} required={required} helper={helper} error={error}>
      <FieldBox focused={focused} invalid={Boolean(error)}>
        <TextInput
          accessibilityLabel={label}
          placeholderTextColor={colors.textSecondary}
          selectionColor={colors.primary}
          maxFontSizeMultiplier={1.3}
          style={[styles.input, textStyles.lead, { color: colors.text }]}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          {...inputProps}
        />
        {suffix ? (
          <Text variant="caption" tone="textSecondary">
            {suffix}
          </Text>
        ) : null}
        {trailing}
      </FieldBox>
    </Field>
  );
};

const styles = StyleSheet.create({
  input: {
    flex: 1,
    paddingVertical: 12,
  },
});
