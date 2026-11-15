import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Plus, Search } from 'lucide-react-native';
import { OperationRow } from '../../components/finance/OperationRow';
import { PeriodSelector } from '../../components/finance/PeriodSelector';
import { FieldBox } from '../../components/forms/Field';
import { PageIntro } from '../../components/layout/PageIntro';
import { Screen } from '../../components/layout/Screen';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Divider, KeyValueRow } from '../../components/ui/KeyValueRow';
import { SegmentedControl, type SegmentOption } from '../../components/ui/SegmentedControl';
import { TagChip } from '../../components/ui/TagChip';
import { Text } from '../../components/ui/Text';
import {
  collectKnownTags,
  filterOperations,
  tagKey,
  totalsByType,
} from '../../domain/finance';
import type { OperationTypeFilter } from '../../domain/types';
import { usePeriodData } from '../../hooks/useBusiness';
import type { BusinessScreenProps } from '../../navigation/types';
import { useColors } from '../../theme';
import { textStyles } from '../../theme/typography';
import { countLabel, formatAmount } from '../../utils/format';

const TYPE_OPTIONS: readonly SegmentOption<OperationTypeFilter>[] = [
  { value: 'all', label: 'Tout' },
  { value: 'income', label: 'Recettes' },
  { value: 'expense', label: 'Dépenses' },
];

/** Écran 09 — Opérations : recherche, filtre par type et par étiquettes (critère R5). */
export const OperationsScreen: React.FC<BusinessScreenProps<'Operations'>> = ({
  navigation,
  route,
}) => {
  const colors = useColors();
  const { business, month, months, referenceMonth, operations, selectMonth } = usePeriodData();

  const [type, setType] = useState<OperationTypeFilter>(route.params?.type ?? 'all');
  const [query, setQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Un lien profond (ex. « Voir les dépenses de septembre ») impose le filtre de type.
  useEffect(() => {
    if (route.params?.type) setType(route.params.type);
  }, [route.params]);

  // Étiquettes de la période, plus celles déjà cochées (pour ne jamais masquer un filtre actif).
  const tagChoices = useMemo(() => {
    const periodTags = collectKnownTags(operations);
    const known = new Set(periodTags.map(tagKey));
    return [...periodTags, ...selectedTags.filter((tag) => !known.has(tagKey(tag)))];
  }, [operations, selectedTags]);

  const filtered = useMemo(
    () => filterOperations(operations, { type, tags: selectedTags, query }),
    [operations, type, selectedTags, query],
  );
  const totals = useMemo(() => totalsByType(filtered), [filtered]);

  const toggleTag = (tag: string) =>
    setSelectedTags((current) =>
      current.some((item) => tagKey(item) === tagKey(tag))
        ? current.filter((item) => tagKey(item) !== tagKey(tag))
        : [...current, tag],
    );

  const hasActiveFilter = type !== 'all' || selectedTags.length > 0 || query.trim().length > 0;

  return (
    <Screen>
      <PageIntro
        eyebrow={`Parcours B · ${business.name}`}
        title="Vos opérations."
        subtitle="Les recettes encaissées et les dépenses payées, au même endroit. Montants en FCFA."
      />

      <FieldBox>
        <Search size={18} color={colors.textSecondary} />
        <TextInput
          accessibilityLabel="Rechercher une opération"
          value={query}
          onChangeText={setQuery}
          placeholder="Rechercher une opération"
          placeholderTextColor={colors.textSecondary}
          selectionColor={colors.primary}
          returnKeyType="search"
          maxFontSizeMultiplier={1.3}
          style={[styles.search, textStyles.lead, { color: colors.text }]}
        />
      </FieldBox>

      <PeriodSelector
        months={months}
        value={month}
        currentMonth={referenceMonth}
        onChange={selectMonth}
      />

      <SegmentedControl
        options={TYPE_OPTIONS}
        value={type}
        onChange={setType}
        accessibilityLabel="Type d’opération"
      />

      <Card>
        <View style={styles.tagsHeader}>
          <Text variant="label">Étiquettes</Text>
          {selectedTags.length > 0 ? (
            <Pressable
              onPress={() => setSelectedTags([])}
              accessibilityRole="button"
              hitSlop={12}
            >
              <Text variant="captionStrong" tone="primary">
                Réinitialiser
              </Text>
            </Pressable>
          ) : null}
        </View>
        {tagChoices.length > 0 ? (
          <View style={styles.tags}>
            {tagChoices.map((tag) => (
              <TagChip
                key={tagKey(tag)}
                mode="filter"
                label={tag}
                selected={selectedTags.some((item) => tagKey(item) === tagKey(tag))}
                onToggle={() => toggleTag(tag)}
              />
            ))}
          </View>
        ) : (
          <Text variant="caption" tone="textSecondary">
            Aucune étiquette sur cette période. Vous pouvez en créer lors de la saisie d’une opération.
          </Text>
        )}
        <Text variant="small" tone="textSecondary">
          {selectedTags.length === 0
            ? 'Aucune sélection : toutes les opérations.'
            : 'Avec plusieurs sélections : au moins une étiquette correspondante.'}
        </Text>
      </Card>

      <Button
        title="Ajouter une opération"
        icon={Plus}
        onPress={() => navigation.navigate('AddOperation')}
      />

      <Card>
        <KeyValueRow
          label={`Recettes · ${countLabel(totals.income.count, 'opération')}`}
          value={formatAmount(totals.income.total)}
          strong
        />
        <KeyValueRow
          label={`Dépenses · ${countLabel(totals.expense.count, 'opération')}`}
          value={formatAmount(totals.expense.total)}
          strong
        />
      </Card>

      <Card style={styles.listCard}>
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text variant="bodyStrong">Aucune opération à afficher</Text>
            <Text variant="caption" tone="textSecondary">
              {hasActiveFilter
                ? 'Aucune opération ne correspond à vos filtres. Modifiez ou réinitialisez-les.'
                : 'Aucune opération n’est enregistrée sur cette période.'}
            </Text>
            {hasActiveFilter ? (
              <Button
                title="Effacer les filtres"
                variant="outline"
                onPress={() => {
                  setType('all');
                  setQuery('');
                  setSelectedTags([]);
                }}
              />
            ) : null}
          </View>
        ) : (
          filtered.map((operation, index) => (
            <Fragment key={operation.id}>
              {index > 0 ? <Divider /> : null}
              <OperationRow operation={operation} />
            </Fragment>
          ))
        )}
      </Card>
    </Screen>
  );
};

const styles = StyleSheet.create({
  search: {
    flex: 1,
    paddingVertical: 12,
  },
  tagsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  listCard: {
    gap: 0,
    paddingVertical: 4,
  },
  empty: {
    gap: 10,
    paddingVertical: 14,
  },
});
