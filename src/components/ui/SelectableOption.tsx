import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Circle, CircleCheck } from 'lucide-react-native';
import { useColors } from '../../theme';
import { radius } from '../../theme/spacing';
import { Text } from './Text';

export interface SelectableOptionProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

/** Choix exclusif présenté sous forme de carte (ex. secteur d'activité). */
export const SelectableOption: React.FC<SelectableOptionProps> = ({ label, selected, onPress }) => {
  const colors = useColors();
  const Icon = selected ? CircleCheck : Circle;

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[
        styles.option,
        {
          backgroundColor: selected ? colors.primarySoft : colors.surface,
          borderColor: selected ? colors.primary : colors.border,
        },
      ]}
    >
      <Icon size={18} color={selected ? colors.primary : colors.textSecondary} />
      <Text variant={selected ? 'label' : 'body'} style={styles.label}>
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  label: {
    flex: 1,
  },
});
