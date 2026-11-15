import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ArrowRight, ListFilter, Pencil, TriangleAlert } from 'lucide-react-native';
import { PeriodSelector } from '../../components/finance/PeriodSelector';
import { AmountInput } from '../../components/forms/AmountInput';
import { PageIntro } from '../../components/layout/PageIntro';
import { Screen } from '../../components/layout/Screen';
import { Badge } from '../../components/ui/Badge';
import { BigAmount } from '../../components/ui/BigAmount';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { HeroCard } from '../../components/ui/HeroCard';
import { InfoNote } from '../../components/ui/InfoNote';
import { Divider, KeyValueRow } from '../../components/ui/KeyValueRow';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { SectionTitle } from '../../components/ui/SectionTitle';
import { Text } from '../../components/ui/Text';
import { overrunContext } from '../../domain/insights';
import { usePeriodData } from '../../hooks/useBusiness';
import type { BusinessScreenProps } from '../../navigation/types';
import { useBusinessStore } from '../../stores/businessStore';
import { useColors } from '../../theme';
import {
  countLabel,
  formatAmount,
  formatFcfa,
  formatPercent,
  formatSignedAmount,
  formatSignedFcfa,
  monthName,
  withDe,
} from '../../utils/format';

/**
 * Écrans 11 et 12 — Budget mensuel et Budget en dépassement (exigence B4, critère R7).
 * Une seule route : la présentation « dépassement » s'applique d'elle-même quand les
 * dépenses de la période dépassent le budget global.
 */
export const BudgetScreen: React.FC<BusinessScreenProps<'Budget'>> = ({ navigation }) => {
  const colors = useColors();
  const updateMonthlyBudget = useBusinessStore((state) => state.updateMonthlyBudget);
  const {
    business,
    month,
    months,
    referenceMonth,
    isCurrentMonth,
    summary,
    expenseBreakdown,
    selectMonth,
  } = usePeriodData();

  const [editing, setEditing] = useState(false);
  const [budgetDraft, setBudgetDraft] = useState<number | null>(business.monthlyBudget);

  const exceeded = summary.budgetStatus === 'exceeded';
  const periodName = monthName(month);
  const periodTitle = periodName.charAt(0).toUpperCase() + periodName.slice(1);
  const budgetFormula = `${formatAmount(summary.expense)} ÷ ${formatAmount(summary.budget)} = ${summary.budgetConsumedPercent} %`;

  const subtitle = isCurrentMonth
    ? 'Votre limite globale pour les dépenses du mois.'
    : `${periodTitle} : une période antérieure, distincte du suivi ${withDe(referenceMonth)}.`;

  const openEditor = () => {
    setBudgetDraft(business.monthlyBudget);
    setEditing(true);
  };

  const saveBudget = () => {
    if (budgetDraft === null || budgetDraft <= 0) return;
    updateMonthlyBudget(budgetDraft);
    setEditing(false);
  };

  return (
    <Screen>
      <PageIntro
        eyebrow={`Parcours B · ${business.name}`}
        title={exceeded ? 'Un dépassement à comprendre.' : 'Un budget, une vue claire.'}
        subtitle={subtitle}
      />

      <PeriodSelector
        months={months}
        value={month}
        currentMonth={referenceMonth}
        onChange={selectMonth}
      />

      <Badge
        label={isCurrentMonth ? 'Suivi réel · FCFA' : 'Période clôturée · Suivi réel'}
        tone={isCurrentMonth ? 'brand' : 'neutral'}
      />

      {exceeded ? (
        <HeroCard tone="danger" style={styles.alert}>
          <View style={styles.alertTitle}>
            <TriangleAlert size={18} color={colors.danger} />
            <Text variant="bodyStrong" tone="danger">
              {`Budget dépassé de ${formatFcfa(summary.overrun)}`}
            </Text>
          </View>
          <BigAmount value={formatSignedAmount(-summary.overrun)} tone="danger" />
          <Text variant="caption" tone="danger">
            Reste disponible négatif : il s’agit d’un dépassement, pas d’un montant encore à
            dépenser.
          </Text>
          <ProgressBar
            ratio={1}
            tone="danger"
            accessibilityLabel={`Budget consommé à ${formatPercent(summary.budgetConsumedPercent)}`}
          />
          <KeyValueRow
            label="Consommation du budget"
            value={formatPercent(summary.budgetConsumedPercent)}
            valueTone="danger"
            strong
          />
        </HeroCard>
      ) : (
        <HeroCard>
          <Text variant="caption" tone="onPrimaryMuted">
            Reste disponible
          </Text>
          <BigAmount value={formatAmount(summary.budgetRemaining)} />
          <View style={styles.heroMeta}>
            <Badge label="Dans votre budget" />
            <Text variant="captionStrong" tone="onPrimary">
              {`${formatPercent(summary.budgetConsumedPercent)} consommé`}
            </Text>
          </View>
          <ProgressBar
            ratio={summary.budgetConsumedRatio}
            tone="onDark"
            accessibilityLabel={`Budget consommé à ${formatPercent(summary.budgetConsumedPercent)}`}
          />
          <Text variant="caption" tone="onPrimaryMuted">
            {`Vous avez dépensé ${formatAmount(summary.expense)} sur ${formatFcfa(summary.budget)} prévus.`}
          </Text>
        </HeroCard>
      )}

      <Card>
        <KeyValueRow
          label={exceeded ? `Budget global ${withDe(month)}` : 'Budget global prévu'}
          value={formatFcfa(summary.budget)}
        />
        <KeyValueRow label="Dépenses réelles payées" value={formatFcfa(summary.expense)} />
        <Divider />
        {exceeded ? (
          <KeyValueRow label="Dépassement" value={formatFcfa(summary.overrun)} valueTone="danger" strong />
        ) : (
          <KeyValueRow
            label="Budget − dépenses"
            value={formatFcfa(summary.budgetRemaining)}
            valueTone="primary"
            strong
          />
        )}
        <Text variant="small" tone="textSecondary">
          {exceeded
            ? `${formatAmount(summary.budget)} − ${formatAmount(summary.expense)} = ${formatSignedFcfa(summary.budgetRemaining)} de reste. ${formatAmount(summary.expense)} ÷ ${formatAmount(summary.budget)} = ${summary.budgetConsumedPercent} % consommé.`
            : `Consommation = ${budgetFormula}`}
        </Text>
      </Card>

      {isCurrentMonth ? (
        <Button title="Modifier le budget global" variant="outline" icon={Pencil} onPress={openEditor} />
      ) : null}

      {exceeded ? (
        <>
          <SectionTitle title="Replacer l’alerte dans son contexte" />
          <Card>
            <KeyValueRow label={`Recettes ${withDe(month)}`} value={formatFcfa(summary.income)} />
            <KeyValueRow
              label="Résultat estimé"
              value={formatSignedFcfa(summary.result)}
              valueTone={summary.result >= 0 ? 'primary' : 'danger'}
            />
            <KeyValueRow label="Trésorerie au début du mois" value={formatFcfa(summary.openingCash)} />
            <KeyValueRow
              label="Trésorerie à la fin du mois"
              value={formatFcfa(summary.closingCash)}
              valueTone={summary.closingCash >= 0 ? 'primary' : 'danger'}
              strong
            />
          </Card>
          <InfoNote title={overrunContext(summary).title}>{overrunContext(summary).body}</InfoNote>
        </>
      ) : (
        <>
          <SectionTitle title="D’où viennent les dépenses ?" />
          <Card>
            <Text variant="caption" tone="textSecondary">
              Répartition des dépenses réelles, pas des budgets par catégorie.
            </Text>
            {expenseBreakdown.length === 0 ? (
              <Text variant="body" tone="textSecondary">
                Aucune dépense enregistrée sur cette période.
              </Text>
            ) : (
              expenseBreakdown.map((share) => (
                <View key={share.categoryId} style={styles.shareRow}>
                  <View style={styles.shareLabel}>
                    <Text variant="bodyStrong">{share.label}</Text>
                    <Text variant="small" tone="textSecondary">
                      {`${share.percent} % des dépenses du mois`}
                    </Text>
                  </View>
                  <Text variant="bodyStrong">{formatFcfa(share.amount)}</Text>
                </View>
              ))
            )}
            <Divider />
            <KeyValueRow
              label={`Total · ${countLabel(summary.expenseCount, 'dépense')}`}
              value={formatFcfa(summary.expense)}
              strong
            />
          </Card>
          <InfoNote title="Un seul budget pour toute l’entreprise">
            Les catégories décrivent vos paiements. Le reste disponible se calcule uniquement sur le
            budget global du mois.
          </InfoNote>
        </>
      )}

      <Button
        title={exceeded ? `Voir les dépenses ${withDe(month)}` : `Voir les opérations ${withDe(month)}`}
        icon={ListFilter}
        onPress={() => navigation.navigate('Operations', { type: exceeded ? 'expense' : 'all' })}
      />
      {exceeded && !isCurrentMonth ? (
        <Button
          title={`Revenir au budget ${withDe(referenceMonth)}`}
          variant="outline"
          icon={ArrowRight}
          onPress={() => selectMonth(referenceMonth)}
        />
      ) : null}

      <BottomSheet visible={editing} title="Modifier le budget global" onClose={() => setEditing(false)}>
        <View style={styles.sheetBody}>
          <AmountInput
            label="Budget mensuel global"
            required
            value={budgetDraft}
            onChange={setBudgetDraft}
            helper={`Un seul budget pour toute l’entreprise : il s’applique à tous les mois suivis (${periodName} compris).`}
            error={budgetDraft === null || budgetDraft <= 0 ? 'Saisissez un budget supérieur à 0.' : undefined}
          />
          <Button
            title="Enregistrer le budget"
            onPress={saveBudget}
            disabled={budgetDraft === null || budgetDraft <= 0}
          />
        </View>
      </BottomSheet>
    </Screen>
  );
};

const styles = StyleSheet.create({
  alert: {
    gap: 12,
  },
  alertTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  shareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  shareLabel: {
    flex: 1,
    gap: 2,
  },
  sheetBody: {
    gap: 16,
    paddingBottom: 8,
  },
});
