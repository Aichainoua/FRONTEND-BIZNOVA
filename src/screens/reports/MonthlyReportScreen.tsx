import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Download } from 'lucide-react-native';
import { PeriodSelector } from '../../components/finance/PeriodSelector';
import { PageIntro } from '../../components/layout/PageIntro';
import { Screen } from '../../components/layout/Screen';
import { Badge } from '../../components/ui/Badge';
import { BigAmount } from '../../components/ui/BigAmount';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { HeroCard } from '../../components/ui/HeroCard';
import { InfoNote } from '../../components/ui/InfoNote';
import { Divider, KeyValueRow } from '../../components/ui/KeyValueRow';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { SectionTitle } from '../../components/ui/SectionTitle';
import { Text } from '../../components/ui/Text';
import { sectorLabel } from '../../domain/categories';
import { firstDayOf, lastDayOf, todayIso } from '../../domain/dates';
import { monthlyTakeaway, periodRange, reportFootnote, resultHeadline } from '../../domain/insights';
import { usePeriodData } from '../../hooks/useBusiness';
import type { TabScreenProps } from '../../navigation/types';
import { exportMonthlyReportPdf } from '../../services/reportPdf';
import { useBusinessStore } from '../../stores/businessStore';
import {
  countLabel,
  formatAmount,
  formatDayMonthLong,
  formatFcfa,
  formatPercent,
  formatSignedAmount,
  formatSignedFcfa,
} from '../../utils/format';

/** Contenu du rapport : monté seulement quand une entreprise est configurée. */
const ReportContent: React.FC = () => {
  const {
    business,
    month,
    months,
    referenceMonth,
    isCurrentMonth,
    summary,
    operations,
    expenseBreakdown,
    selectMonth,
  } = usePeriodData();
  const [exporting, setExporting] = useState(false);

  const exceeded = summary.budgetStatus === 'exceeded';
  const settled = summary.operationCount > 1 ? 'réglées' : 'réglée';
  const issuedOn = todayIso();

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportMonthlyReportPdf({ business, month, summary, operations, expenseBreakdown, issuedOn });
    } catch {
      Alert.alert(
        'Export impossible',
        'Le rapport PDF n’a pas pu être généré. Réessayez dans un instant.',
      );
    } finally {
      setExporting(false);
    }
  };

  return (
    <Screen>
      <PageIntro
        eyebrow="Parcours B · Rapport"
        title="Votre mois, en perspective."
        subtitle={`${business.name} · ${sectorLabel(business.sector)}`}
      />

      <PeriodSelector
        months={months}
        value={month}
        currentMonth={referenceMonth}
        onChange={selectMonth}
      />

      <View style={styles.contextRow}>
        <Badge label="Suivi réel" />
        <Text variant="small" tone="textSecondary">
          Devise · FCFA
        </Text>
      </View>

      <HeroCard>
        <Text variant="caption" tone="onPrimaryMuted">
          {`Résultat estimé · ${periodRange(month)}`}
        </Text>
        <BigAmount value={formatSignedAmount(summary.result)} />
        <Text variant="caption" tone="onPrimaryMuted">
          {resultHeadline(summary, isCurrentMonth)}
        </Text>
      </HeroCard>

      <SectionTitle title="Recettes & dépenses" />
      <Card>
        <KeyValueRow
          label={`Recettes encaissées · ${summary.incomeCount}`}
          value={formatFcfa(summary.income)}
        />
        <KeyValueRow
          label={`Dépenses payées · ${summary.expenseCount}`}
          value={formatFcfa(summary.expense)}
        />
        <Divider />
        <KeyValueRow
          label="Résultat estimé"
          value={formatSignedFcfa(summary.result)}
          valueTone={summary.result >= 0 ? 'primary' : 'danger'}
          strong
        />
        <Text variant="small" tone="textSecondary">
          {`${formatAmount(summary.income)} − ${formatAmount(summary.expense)} = ${formatAmount(summary.result)} FCFA. Calcul sur ${countLabel(summary.operationCount, 'opération')} ${settled}.`}
        </Text>
      </Card>

      <SectionTitle title="Votre trésorerie" />
      <Card>
        <KeyValueRow
          label={`Solde au ${formatDayMonthLong(firstDayOf(month))}`}
          value={formatFcfa(summary.openingCash)}
        />
        <KeyValueRow label="Variation du mois" value={formatSignedFcfa(summary.result)} />
        <Divider />
        <KeyValueRow
          label={`Solde estimé au ${formatDayMonthLong(lastDayOf(month))}`}
          value={formatFcfa(summary.closingCash)}
          valueTone={summary.closingCash >= 0 ? 'primary' : 'danger'}
          strong
        />
        <Text variant="small" tone="textSecondary">
          Solde initial + recettes − dépenses. La trésorerie inclut l’argent disponible avant ce mois.
        </Text>
      </Card>

      <SectionTitle title="État du budget global" />
      <Card>
        <View style={styles.contextRow}>
          <Badge label={exceeded ? 'Budget dépassé' : 'Budget respecté'} tone={exceeded ? 'danger' : 'brand'} />
          <Text variant="bodyStrong" tone={exceeded ? 'danger' : 'text'}>
            {formatPercent(summary.budgetConsumedPercent)}
          </Text>
        </View>
        <ProgressBar
          ratio={summary.budgetConsumedRatio}
          tone={exceeded ? 'danger' : 'brand'}
          accessibilityLabel={`Budget consommé à ${formatPercent(summary.budgetConsumedPercent)}`}
        />
        <KeyValueRow label="Budget mensuel prévu" value={formatFcfa(summary.budget)} />
        <KeyValueRow label="Dépenses réelles" value={formatFcfa(summary.expense)} />
        <KeyValueRow
          label={exceeded ? 'Dépassement' : 'Reste disponible'}
          value={formatFcfa(exceeded ? summary.overrun : summary.budgetRemaining)}
          valueTone={exceeded ? 'danger' : 'primary'}
          strong
        />
      </Card>

      <InfoNote title="À retenir">{monthlyTakeaway(summary)}</InfoNote>

      <Text variant="small" tone="textSecondary">
        {reportFootnote(month, issuedOn)}
      </Text>

      <Button
        title="Exporter en PDF"
        icon={Download}
        elevated
        loading={exporting}
        onPress={handleExport}
        accessibilityHint="Génère le rapport au format PDF et ouvre le partage"
      />
    </Screen>
  );
};

/** Écran 13 — Rapport mensuel (exigence B5, critère R8). */
export const MonthlyReportScreen: React.FC<TabScreenProps<'Reports'>> = ({ navigation }) => {
  const isConfigured = useBusinessStore((state) => state.business !== null);

  if (isConfigured) return <ReportContent />;

  return (
    <Screen>
      <PageIntro
        eyebrow="Parcours B · Rapport"
        title="Votre mois, en perspective."
        subtitle="Le rapport mensuel résume vos recettes, vos dépenses, votre trésorerie et votre budget."
      />
      <Card>
        <Text variant="heading">Aucun rapport pour l’instant</Text>
        <Text variant="body" tone="textSecondary">
          Configurez votre entreprise et enregistrez vos premières opérations : le rapport se
          construit à partir d’elles.
        </Text>
      </Card>
      <Button title="Configurer mon entreprise" onPress={() => navigation.navigate('Business')} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  contextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
