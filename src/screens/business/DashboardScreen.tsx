import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { FileText, Plus } from 'lucide-react-native';
import { FlowBarChart } from '../../components/finance/FlowBarChart';
import { PeriodSelector } from '../../components/finance/PeriodSelector';
import { PageIntro } from '../../components/layout/PageIntro';
import { Screen } from '../../components/layout/Screen';
import { Badge } from '../../components/ui/Badge';
import { BigAmount } from '../../components/ui/BigAmount';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { HeroCard } from '../../components/ui/HeroCard';
import { InfoNote } from '../../components/ui/InfoNote';
import { KeyValueRow } from '../../components/ui/KeyValueRow';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { SectionTitle } from '../../components/ui/SectionTitle';
import { StatCard } from '../../components/ui/StatCard';
import { Text } from '../../components/ui/Text';
import { categoryLabel } from '../../domain/categories';
import { asOfLabel } from '../../domain/insights';
import { usePeriodData } from '../../hooks/useBusiness';
import type { BusinessScreenProps } from '../../navigation/types';
import {
  countLabel,
  formatAmount,
  formatDayMonth,
  formatFcfa,
  formatPercent,
  formatSignedFcfa,
} from '../../utils/format';

/** Écran 08 — Tableau de bord financier (exigences B3 et B4). */
export const DashboardScreen: React.FC<BusinessScreenProps<'Dashboard'>> = ({ navigation }) => {
  const { business, month, months, referenceMonth, summary, operations, weeklyFlows, selectMonth } =
    usePeriodData();

  const exceeded = summary.budgetStatus === 'exceeded';
  const recent = operations.slice(0, 3);
  const resultSign = summary.result < 0 ? '−' : '+';
  const cashDetail = `${formatAmount(summary.openingCash)} au départ ${resultSign} ${formatAmount(
    Math.abs(summary.result),
  )} ce mois-ci`;

  return (
    <Screen>
      <PageIntro eyebrow={`Parcours B · ${business.name}`} title="Votre activité, en clair." />

      <View style={styles.contextRow}>
        <Badge label="Suivi réel" />
        <Text variant="small" tone="textSecondary">
          Tous les montants en FCFA
        </Text>
      </View>

      <PeriodSelector
        months={months}
        value={month}
        currentMonth={referenceMonth}
        onChange={selectMonth}
      />

      <HeroCard>
        <Text variant="caption" tone="onPrimaryMuted">
          {`Trésorerie estimée · ${asOfLabel(month)}`}
        </Text>
        <BigAmount value={formatAmount(summary.closingCash)} />
        <Text variant="caption" tone="onPrimaryMuted">
          {cashDetail}
        </Text>
      </HeroCard>

      {summary.operationCount === 0 ? (
        <InfoNote title="Aucune opération sur cette période">
          Ajoutez une recette ou une dépense pour calculer vos indicateurs. Des montants à zéro ne
          permettent pas de conclure sur la santé de votre activité.
        </InfoNote>
      ) : null}

      <View style={styles.twoColumns}>
        <StatCard
          label="Recettes encaissées"
          value={formatAmount(summary.income)}
          caption={countLabel(summary.incomeCount, 'opération')}
        />
        <StatCard
          label="Dépenses payées"
          value={formatAmount(summary.expense)}
          caption={countLabel(summary.expenseCount, 'opération')}
        />
      </View>

      <Card>
        <KeyValueRow
          label="Résultat estimé du mois"
          value={formatSignedFcfa(summary.result)}
          valueTone={summary.result >= 0 ? 'primary' : 'danger'}
          strong
        />
        <Text variant="caption" tone="textSecondary">
          Recettes − dépenses. Ce résultat est distinct de votre solde de trésorerie.
        </Text>
      </Card>

      <Card>
        <View style={styles.cardHeader}>
          <Text variant="label">Votre budget mensuel</Text>
          <Pressable
            onPress={() => navigation.navigate('Budget')}
            accessibilityRole="link"
            hitSlop={12}
          >
            <Text variant="captionStrong" tone="primary">
              Voir le budget
            </Text>
          </Pressable>
        </View>
        <ProgressBar
          ratio={summary.budgetConsumedRatio}
          tone={exceeded ? 'danger' : 'brand'}
          accessibilityLabel={`Budget consommé à ${formatPercent(summary.budgetConsumedPercent)}`}
        />
        <View style={styles.cardHeader}>
          <Text variant="caption" tone="textSecondary">
            {`${formatAmount(summary.expense)} sur ${formatFcfa(summary.budget)}`}
          </Text>
          <Text variant="captionStrong" tone={exceeded ? 'danger' : 'text'}>
            {formatPercent(summary.budgetConsumedPercent)}
          </Text>
        </View>
        <KeyValueRow
          label={exceeded ? 'Dépassement' : 'Encore disponible'}
          value={formatFcfa(exceeded ? summary.overrun : summary.budgetRemaining)}
          valueTone={exceeded ? 'danger' : 'primary'}
          strong
        />
      </Card>

      <Button
        title="Ajouter une opération"
        icon={Plus}
        onPress={() => navigation.navigate('AddOperation')}
      />

      <Card>
        <Text variant="heading" accessibilityRole="header">
          Les flux du mois
        </Text>
        <FlowBarChart flows={weeklyFlows} />
      </Card>

      <SectionTitle
        title="Activité récente"
        actionLabel="Tout voir"
        onActionPress={() => navigation.navigate('Operations', { type: 'all' })}
      />
      <Card>
        {recent.length === 0 ? (
          <Text variant="body" tone="textSecondary">
            Aucune opération enregistrée sur cette période.
          </Text>
        ) : (
          recent.map((operation) => (
            <KeyValueRow
              key={operation.id}
              label={`${formatDayMonth(operation.date)} · ${
                operation.description?.trim() || categoryLabel(operation.categoryId)
              }`}
              value={`${operation.type === 'income' ? '+' : '−'}${formatAmount(operation.amount)}`}
              valueTone={operation.type === 'income' ? 'primary' : 'text'}
            />
          ))
        )}
      </Card>

      <Button
        title="Consulter le rapport mensuel"
        variant="outline"
        icon={FileText}
        onPress={() => navigation.navigate('Reports')}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  contextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  twoColumns: {
    flexDirection: 'row',
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
});
