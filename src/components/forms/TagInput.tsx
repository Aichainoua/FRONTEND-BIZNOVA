import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Plus, Tag } from 'lucide-react-native';
import { normalizeTag, tagKey } from '../../domain/finance';
import { useColors } from '../../theme';
import { textStyles } from '../../theme/typography';
import { Text } from '../ui/Text';
import { TagChip } from '../ui/TagChip';
import { Field, FieldBox } from './Field';

export interface TagInputProps {
  label: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  /** Étiquettes déjà utilisées, proposées pendant la frappe. */
  suggestions: readonly string[];
  helper?: string;
}

const MAX_SUGGESTIONS = 5;

/** Saisie d'étiquettes libres, réutilisables, avec suggestions (exigence § 5.2). */
export const TagInput: React.FC<TagInputProps> = ({ label, tags, onChange, suggestions, helper }) => {
  const colors = useColors();
  const [text, setText] = useState('');
  const [focused, setFocused] = useState(false);

  const selectedKeys = useMemo(() => new Set(tags.map(tagKey)), [tags]);
  const draft = normalizeTag(text);
  const draftKey = tagKey(draft);

  const matches = useMemo(
    () =>
      suggestions
        .filter((tag) => !selectedKeys.has(tagKey(tag)))
        .filter((tag) => !draftKey || tagKey(tag).includes(draftKey))
        .slice(0, MAX_SUGGESTIONS),
    [suggestions, selectedKeys, draftKey],
  );

  const canCreate =
    draft.length > 0 &&
    !selectedKeys.has(draftKey) &&
    !suggestions.some((tag) => tagKey(tag) === draftKey);

  const add = (tag: string) => {
    const clean = normalizeTag(tag);
    if (!clean || selectedKeys.has(tagKey(clean))) return;
    onChange([...tags, clean]);
    setText('');
  };

  const remove = (tag: string) => onChange(tags.filter((item) => tagKey(item) !== tagKey(tag)));

  const showSuggestions = focused || draft.length > 0;

  return (
    <Field label={label} helper={helper}>
      {tags.length > 0 ? (
        <View style={styles.chips}>
          {tags.map((tag) => (
            <TagChip key={tagKey(tag)} mode="removable" label={tag} onRemove={() => remove(tag)} />
          ))}
        </View>
      ) : null}

      <FieldBox focused={focused}>
        <Tag size={16} color={colors.textSecondary} />
        <TextInput
          accessibilityLabel={label}
          value={text}
          onChangeText={setText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onSubmitEditing={() => add(draft)}
          returnKeyType="done"
          blurOnSubmit={false}
          autoCapitalize="sentences"
          placeholder="Rechercher ou créer une étiquette"
          placeholderTextColor={colors.textSecondary}
          selectionColor={colors.primary}
          maxFontSizeMultiplier={1.3}
          style={[styles.input, textStyles.body, { color: colors.text }]}
        />
        <Pressable
          onPress={() => add(draft)}
          disabled={!canCreate}
          accessibilityRole="button"
          accessibilityLabel="Ajouter l’étiquette"
          hitSlop={10}
          style={!canCreate && styles.disabled}
        >
          <Plus size={18} color={colors.primary} />
        </Pressable>
      </FieldBox>

      {showSuggestions && (matches.length > 0 || canCreate) ? (
        <View style={styles.chips}>
          {matches.map((tag) => (
            <TagChip
              key={tagKey(tag)}
              mode="filter"
              label={tag}
              selected={false}
              onToggle={() => add(tag)}
            />
          ))}
          {canCreate ? (
            <Pressable
              onPress={() => add(draft)}
              accessibilityRole="button"
              accessibilityLabel={`Créer l’étiquette ${draft}`}
              style={[styles.create, { borderColor: colors.primary }]}
            >
              <Plus size={14} color={colors.primary} />
              <Text variant="small" tone="primary">{`Créer « ${draft} »`}</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </Field>
  );
};

const styles = StyleSheet.create({
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
  },
  disabled: {
    opacity: 0.35,
  },
  create: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 34,
    paddingHorizontal: 12,
    borderRadius: 100,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
});
