import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Check, ChevronDown } from 'lucide-react-native';
import { useColors } from '../../theme';
import { BottomSheet } from '../ui/BottomSheet';
import { Text } from '../ui/Text';
import { Field, FieldBox } from './Field';

export interface SelectOption {
  value: string;
  label: string;
}

/** Liste de choix affichée dans une feuille modale (réutilisée par le sélecteur de période). */
export interface OptionSheetProps {
  visible: boolean;
  title: string;
  options: readonly SelectOption[];
  value: string | null;
  onSelect: (value: string) => void;
  onClose: () => void;
}

export const OptionSheet: React.FC<OptionSheetProps> = ({
  visible,
  title,
  options,
  value,
  onSelect,
  onClose,
}) => {
  const colors = useColors();

  return (
    <BottomSheet visible={visible} title={title} onClose={onClose}>
      <View style={styles.list}>
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <Pressable
              key={option.value}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => {
                onSelect(option.value);
                onClose();
              }}
              style={[styles.option, selected && { backgroundColor: colors.primarySoft }]}
            >
              <Text variant={selected ? 'label' : 'body'} style={styles.optionLabel}>
                {option.label}
              </Text>
              {selected ? <Check size={18} color={colors.primary} /> : null}
            </Pressable>
          );
        })}
      </View>
    </BottomSheet>
  );
};

export interface SelectFieldProps {
  label: string;
  options: readonly SelectOption[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  helper?: string;
  error?: string;
}

/** Champ à choix unique (ex. catégorie). */
export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Sélectionner',
  required,
  helper,
  error,
}) => {
  const colors = useColors();
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <Field label={label} required={required} helper={helper} error={error}>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`${label} : ${selected?.label ?? 'non renseigné'}`}
        accessibilityHint="Ouvre la liste des choix"
      >
        <FieldBox focused={open} invalid={Boolean(error)}>
          <Text variant="lead" tone={selected ? 'text' : 'textSecondary'} style={styles.value}>
            {selected?.label ?? placeholder}
          </Text>
          <ChevronDown size={16} color={colors.textSecondary} />
        </FieldBox>
      </Pressable>
      <OptionSheet
        visible={open}
        title={label}
        options={options}
        value={value}
        onSelect={onChange}
        onClose={() => setOpen(false)}
      />
    </Field>
  );
};

const styles = StyleSheet.create({
  value: {
    flex: 1,
    paddingVertical: 12,
  },
  list: {
    gap: 4,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    paddingHorizontal: 14,
    borderRadius: 12,
    gap: 12,
  },
  optionLabel: {
    flex: 1,
  },
});
