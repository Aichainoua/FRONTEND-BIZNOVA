import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Square, SquareCheck, X } from 'lucide-react-native';
import { useColors } from '../../theme';
import { radius } from '../../theme/spacing';
import { Text } from './Text';

interface BaseProps {
  label: string;
}

/** Étiquette en lecture seule (liste des opérations). */
export interface DisplayTagProps extends BaseProps {
  mode: 'display';
}

/** Étiquette sélectionnée dans un formulaire, avec bouton de retrait. */
export interface RemovableTagProps extends BaseProps {
  mode: 'removable';
  onRemove: () => void;
}

/** Étiquette de filtre à cocher. */
export interface FilterTagProps extends BaseProps {
  mode: 'filter';
  selected: boolean;
  onToggle: () => void;
}

export type TagChipProps = DisplayTagProps | RemovableTagProps | FilterTagProps;

export const TagChip: React.FC<TagChipProps> = (props) => {
  const colors = useColors();

  if (props.mode === 'display') {
    return (
      <View style={[styles.display, { backgroundColor: colors.primarySoft }]}>
        <Text variant="micro" tone="primary" style={styles.displayText}>{`# ${props.label}`}</Text>
      </View>
    );
  }

  if (props.mode === 'removable') {
    return (
      <View style={[styles.removable, { backgroundColor: colors.primarySoft }]}>
        <Text variant="captionStrong" tone="primary">{`# ${props.label}`}</Text>
        <Pressable
          onPress={props.onRemove}
          accessibilityRole="button"
          accessibilityLabel={`Retirer l’étiquette ${props.label}`}
          hitSlop={10}
        >
          <X size={14} color={colors.primary} />
        </Pressable>
      </View>
    );
  }

  const Icon = props.selected ? SquareCheck : Square;
  return (
    <Pressable
      onPress={props.onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: props.selected }}
      accessibilityLabel={`Étiquette ${props.label}`}
      style={[
        styles.filter,
        {
          backgroundColor: props.selected ? colors.primarySoft : colors.surface,
          borderColor: props.selected ? colors.primary : colors.border,
        },
      ]}
    >
      <Icon size={14} color={props.selected ? colors.primary : colors.textSecondary} />
      <Text variant="small" tone={props.selected ? 'primary' : 'textSecondary'}>
        {props.label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  display: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  displayText: {
    letterSpacing: 0.1,
  },
  removable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 12,
    paddingRight: 10,
    paddingVertical: 8,
    borderRadius: radius.md,
  },
  filter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 34,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
});
