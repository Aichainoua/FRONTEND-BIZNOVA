import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useColors } from '../../theme';
import { layout, radius } from '../../theme/spacing';
import { Text } from '../ui/Text';

export interface FieldProps {
  label: string;
  required?: boolean;
  helper?: string;
  error?: string;
  children: React.ReactNode;
}

/** Enveloppe commune des champs : libellé, zone de saisie, aide et message d'erreur. */
export const Field: React.FC<FieldProps> = ({ label, required = false, helper, error, children }) => (
  <View style={styles.field}>
    <Text variant="label">{required ? `${label} *` : label}</Text>
    {children}
    {error ? (
      <Text variant="caption" tone="danger" accessibilityLiveRegion="polite">
        {error}
      </Text>
    ) : helper ? (
      <Text variant="caption" tone="textSecondary">
        {helper}
      </Text>
    ) : null}
  </View>
);

export interface FieldBoxProps {
  focused?: boolean;
  invalid?: boolean;
  children: React.ReactNode;
}

/** Cadre visuel d'un champ (bordure, rayon, hauteur) — partagé par tous les types de champ. */
export const FieldBox: React.FC<FieldBoxProps> = ({ focused = false, invalid = false, children }) => {
  const colors = useColors();
  return (
    <View
      style={[
        styles.box,
        {
          backgroundColor: colors.surface,
          borderColor: invalid ? colors.danger : focused ? colors.primary : colors.border,
        },
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  field: {
    gap: 8,
  },
  box: {
    minHeight: layout.controlHeight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
});
