import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react-native';
import { categoryLabel } from '../../domain/categories';
import type { Operation } from '../../domain/types';
import { useColors } from '../../theme';
import { radius } from '../../theme/spacing';
import { formatAmount, formatDayMonth } from '../../utils/format';
import { TagChip } from '../ui/TagChip';
import { Text } from '../ui/Text';

export interface OperationRowProps {
  operation: Operation;
}

/** Ligne d'opération : titre, date et statut, catégorie, étiquettes et montant signé. */
export const OperationRow: React.FC<OperationRowProps> = ({ operation }) => {
  const colors = useColors();
  const isIncome = operation.type === 'income';
  const Icon = isIncome ? ArrowDownLeft : ArrowUpRight;
  const title = operation.description?.trim() || categoryLabel(operation.categoryId);
  const status = isIncome ? 'Encaissée' : 'Payée';
  const signed = `${isIncome ? '+' : '−'}${formatAmount(operation.amount)}`;

  return (
    <View
      accessible
      accessibilityLabel={`${title}, ${isIncome ? 'recette' : 'dépense'} de ${formatAmount(operation.amount)} FCFA, ${formatDayMonth(operation.date)}, catégorie ${categoryLabel(operation.categoryId)}${operation.tags.length ? `, étiquettes ${operation.tags.join(', ')}` : ''}`}
      style={styles.row}
    >
      <View
        style={[
          styles.icon,
          { backgroundColor: isIncome ? colors.primarySoft : colors.surfaceMuted },
        ]}
      >
        <Icon size={16} color={isIncome ? colors.primary : colors.textSecondary} />
      </View>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text variant="bodyStrong" style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <Text variant="bodyStrong" tone={isIncome ? 'primary' : 'text'}>
            {signed}
          </Text>
        </View>
        <Text variant="caption" tone="textSecondary">
          {`${formatDayMonth(operation.date)} · ${status}`}
        </Text>
        <Text variant="caption" tone="textSecondary" style={styles.category}>
          {`Catégorie : ${categoryLabel(operation.categoryId)}`}
        </Text>
        {operation.tags.length > 0 ? (
          <View style={styles.tags}>
            {operation.tags.map((tag) => (
              <TagChip key={tag} mode="display" label={tag} />
            ))}
          </View>
        ) : (
          <Text variant="small" tone="textSecondary">
            Aucune étiquette
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 14,
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    flex: 1,
  },
  category: {
    marginTop: 4,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
});
