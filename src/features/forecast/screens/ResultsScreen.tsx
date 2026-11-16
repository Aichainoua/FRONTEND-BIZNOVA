import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Badge, Banner, Button, CashLineChart, Card, Eyebrow, Helper, KpiCard, LinkButton, Screen, SectionTitle, Subtitle, Title, type ChartPoint } from '../../../components/kit';
import type { ProjectsStackParamList } from '../../../navigation/routes';
import { colors, spacing, typography } from '../../../theme/tokens';
import { getErrorMessage, getStatus } from '../../../utils/errors';
import { formatCompactFcfa, formatFcfa, formatNumber, formatPercent, formatPeriodLabel, formatSigned, ordinalMonth } from '../../../utils/format';
import { AccountHeader } from '../../common/AccountHeader';
import { useProject, useResults } from '../hooks';
import type { ForecastResults } from '../types';

type Props = NativeStackScreenProps<ProjectsStackParamList, 'ForecastResults'>;

function chartPoints(results: ForecastResults): ChartPoint[] {
  const step = results.horizonMonths <= 12 ? 3 : results.horizonMonths <= 24 ? 6 : 12;
  return results.treasury.series.map((s) => ({
    value: s.balance,
    label: s.month === 0 ? 'Départ' : s.month % step === 0 ? `M${s.month}` : undefined,
  }));
}

export function ResultsScreen({ navigation, route }: Props) {
  const { projectId } = route.params;
  const project = useProject(projectId);
  const results = useResults(projectId);
  const editAssumptions = () => navigation.navigate('ForecastAssumptions', { projectId });

  const p = project.data;
  const r = results.data;
  const investment = p?.assumptions?.initialInvestment;

  return (
    <Screen onRefresh={() => void results.refetch()} refreshing={results.isRefetching}>
      <AccountHeader />
      <View style={styles.intro}>
        <Eyebrow>Parcours A · Étape 3 sur 3</Eyebrow>
        <Title>Votre projet en chiffres.</Title>
        {p ? <Subtitle>{`${p.name} · ${p.horizonMonths} mois · ${formatPeriodLabel(p.startDate, p.endDate)}`}</Subtitle> : null}
      </View>

      {results.isLoading ? <ActivityIndicator color={colors.primary} /> : null}

      {results.isError ? (
        getStatus(results.error) === 409 ? (
          <Banner variant="warning" title="Hypothèses à compléter" action={<LinkButton label="Compléter mes hypothèses" onPress={editAssumptions} />}>
            {getErrorMessage(results.error)}
          </Banner>
        ) : (
          <Banner variant="danger" title="Calcul indisponible" action={<LinkButton label="Réessayer" onPress={() => void results.refetch()} />}>
            {getErrorMessage(results.error)}
          </Banner>
        )
      ) : null}

      {r ? (
        <>
          <Card tone="dark">
            <View style={styles.tags}>
              <Badge label="Prévisionnel" tone="onDark" />
              <Badge label="FCFA" tone="onDark" />
            </View>
            <Text style={styles.heroLabel}>{`Résultat estimé sur ${r.horizonMonths} mois`}</Text>
            <Text style={typography.hero} accessibilityLabel={`Résultat estimé : ${formatSigned(r.netResult)} FCFA`}>
              {formatSigned(r.netResult)}
            </Text>
            <Text style={styles.heroNote}>{`Soit ${formatFcfa(r.monthlyNetResult)} par mois, avec vos hypothèses actuelles.`}</Text>
          </Card>

          <View style={styles.row}>
            <KpiCard label={r.horizonMonths === 12 ? 'Chiffre d’affaires annuel' : `Chiffre d’affaires · ${r.horizonMonths} mois`} value={formatNumber(r.revenueTotal)} unit="FCFA" />
            <KpiCard label={r.horizonMonths === 12 ? 'Charges annuelles' : `Charges · ${r.horizonMonths} mois`} value={formatNumber(r.chargesTotal)} unit="FCFA" />
          </View>

          <KpiCard label="Marge sur chiffre d’affaires" value={formatPercent(r.marginPct)} note="Résultat ÷ chiffre d’affaires. Investissement initial exclu des charges mensuelles." />

          <View style={styles.row}>
            <KpiCard
              label="Seuil de rentabilité"
              value={r.breakEvenMonthlyRevenue === null ? 'Non calculable' : formatNumber(r.breakEvenMonthlyRevenue)}
              unit={r.breakEvenMonthlyRevenue === null ? undefined : 'FCFA de revenus / mois'}
              note={r.breakEvenMonthlyRevenue === null ? 'Vos charges variables absorbent toute la marge.' : undefined}
            />
            <KpiCard label={`ROI sur ${r.horizonMonths} mois`} value={r.roiPct === null ? '—' : formatPercent(r.roiPct, 0)} note={r.roiPct === null ? 'Aucun investissement initial.' : 'Résultat ÷ investissement'} />
          </View>

          <Card>
            <SectionTitle>Quand récupérer l’apport ?</SectionTitle>
            {r.paybackMonth === null ? (
              <>
                <Text style={typography.kpi}>Pas sur cette période</Text>
                <Helper>{`Les flux cumulés restent négatifs sur ${r.horizonMonths} mois. Revoyez vos revenus, vos charges ou l’investissement.`}</Helper>
              </>
            ) : (
              <>
                <Text style={typography.kpi}>{`Au ${ordinalMonth(r.paybackMonth)} mois`}</Text>
                {r.paybackDetail ? (
                  <Text style={typography.body}>
                    {`Les flux cumulés${investment !== undefined ? `, après l’investissement de ${formatFcfa(investment)},` : ''} passent de ${formatNumber(r.paybackDetail.previousCumulative)} ${r.paybackDetail.previousMonth === 0 ? 'au départ' : `au mois ${r.paybackDetail.previousMonth}`} à ${formatSigned(r.paybackDetail.cumulative)} au mois ${r.paybackDetail.month}.`}
                  </Text>
                ) : null}
              </>
            )}
            <Helper>Calcul sur les encaissements et décaissements cumulés, à la fin de chaque mois.</Helper>
          </Card>

          <Card>
            <SectionTitle>Trésorerie prévisionnelle</SectionTitle>
            <Text style={typography.kpi}>{formatFcfa(r.treasury.endBalance)}</Text>
            <Helper>Solde disponible · après financement du lancement</Helper>
            <CashLineChart
              points={chartPoints(r)}
              endLabel={formatCompactFcfa(r.treasury.endBalance)}
              accessibilityLabel={`Courbe de trésorerie : de ${formatFcfa(r.treasury.startBalance)} au départ à ${formatFcfa(r.treasury.endBalance)} après ${r.horizonMonths} mois`}
            />
            <Helper>{`Départ : ${formatFcfa(r.treasury.startBalance)} · Entrées nettes : ${formatSigned(r.treasury.monthlyNet)} / mois. La trésorerie n’est pas le résultat.`}</Helper>
          </Card>

          {r.npv === null ? (
            <Banner variant="warning" title="VAN non calculée" action={<LinkButton label="Ajouter le taux d’actualisation" onPress={editAssumptions} />}>
              Le taux d’actualisation annuel est manquant. Ajoutez-le aux hypothèses pour calculer la valeur actuelle nette.
            </Banner>
          ) : (
            <KpiCard label="Valeur actuelle nette (VAN)" value={formatNumber(r.npv)} unit="FCFA" note={`Taux d’actualisation : ${formatPercent(r.discountRatePct ?? 0)} par an.`} />
          )}

          <Helper>Ces estimations ne garantissent pas vos résultats futurs. Elles dépendent des hypothèses saisies.</Helper>
          <Button title="Voir le rapport prévisionnel" onPress={() => navigation.navigate('ForecastReport', { projectId })} />
          <Button title="Modifier mes hypothèses" variant="secondary" onPress={editAssumptions} />
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { gap: spacing.sm },
  tags: { flexDirection: 'row', gap: spacing.sm },
  heroLabel: { fontSize: 14, fontWeight: '700', color: colors.textOnPrimaryMuted, marginTop: spacing.sm },
  heroNote: { fontSize: 14.5, lineHeight: 21, color: colors.textOnPrimaryMuted },
  row: { flexDirection: 'row', gap: spacing.md },
});
