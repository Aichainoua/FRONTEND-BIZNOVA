import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FileDown } from 'lucide-react-native';
import { useState, type ReactNode } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { Badge, Banner, Button, Card, Eyebrow, Helper, LinkButton, Screen, SectionTitle, Subtitle, Title } from '../../../components/kit';
import { endpoints } from '../../../api/endpoints';
import { env } from '../../../config/env';
import type { ProjectsStackParamList } from '../../../navigation/routes';
import { colors, spacing } from '../../../theme/tokens';
import { getErrorMessage, getStatus } from '../../../utils/errors';
import { formatDateFr, formatFcfa, formatNumber, formatPercent, formatShortPeriod, monthName, ordinalMonth } from '../../../utils/format';
import { downloadAndSharePdf } from '../../../utils/pdf';
import { AccountHeader } from '../../common/AccountHeader';
import { useReport } from '../hooks';
import { sectorLabel } from '../sectors';

type Props = NativeStackScreenProps<ProjectsStackParamList, 'ForecastReport'>;

function Row({ label, value, strong }: { label: string; value: ReactNode; strong?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, strong && styles.rowStrong]}>{value}</Text>
    </View>
  );
}

const slug = (name: string) => name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();

export function ReportScreen({ navigation, route }: Props) {
  const { projectId } = route.params;
  const report = useReport(projectId);
  const [exporting, setExporting] = useState(false);
  const rep = report.data;

  const onExport = async () => {
    if (!rep) return;
    if (env.useMocks) {
      Alert.alert('Export indisponible en mode démo', 'Le PDF est généré par le serveur. Désactivez EXPO_PUBLIC_USE_MOCKS pour tester l’export.');
      return;
    }
    setExporting(true);
    try {
      await downloadAndSharePdf(endpoints.projects.reportPdf(projectId), `rapport-${slug(rep.project.name) || 'previsionnel'}.pdf`);
    } catch (error) {
      Alert.alert('Export impossible', getErrorMessage(error, 'Le PDF n’a pas pu être préparé. Réessayez.'));
    } finally {
      setExporting(false);
    }
  };

  return (
    <Screen>
      <AccountHeader />
      <View style={styles.intro}>
        <Eyebrow>Parcours A · Rapport</Eyebrow>
        <Title>Le cap de votre projet.</Title>
        <Subtitle>Un résumé de vos hypothèses et des points à surveiller.</Subtitle>
        <Badge label="Prévisionnel" tone="green" />
      </View>

      {report.isLoading ? <ActivityIndicator color={colors.primary} /> : null}
      {report.isError ? (
        <Banner
          variant={getStatus(report.error) === 409 ? 'warning' : 'danger'}
          title="Rapport indisponible"
          action={<LinkButton label={getStatus(report.error) === 409 ? 'Compléter mes hypothèses' : 'Réessayer'} onPress={() => (getStatus(report.error) === 409 ? navigation.navigate('ForecastAssumptions', { projectId }) : void report.refetch())} />}
        >
          {getErrorMessage(report.error)}
        </Banner>
      ) : null}

      {rep ? (
        <>
          <Card>
            <Text style={styles.projectName}>{rep.project.name}</Text>
            <Helper>{sectorLabel(rep.project.sector)}</Helper>
            <Row label="Période" value={formatShortPeriod(rep.project.startDate, rep.project.endDate)} />
            <Row label="Devise" value="FCFA" />
            <Helper>{`Établi le ${formatDateFr(rep.generatedAt)} · Version enregistrée`}</Helper>
          </Card>

          <Card>
            <SectionTitle>Hypothèses utilisées</SectionTitle>
            <Row label="Investissement au lancement" value={formatNumber(rep.assumptions.initialInvestment)} />
            <Row label="Apport / emprunt" value={`${formatNumber(rep.assumptions.ownContribution)} / ${formatNumber(rep.assumptions.loanAmount)}`} />
            <Row label="Revenus mensuels" value={formatNumber(rep.assumptions.monthlyRevenue)} />
            <Row label="Charges fixes mensuelles" value={formatNumber(rep.assumptions.fixedCharges)} />
            <Row label="Charges variables" value={`${formatPercent(rep.assumptions.variableChargesPct, rep.assumptions.variableChargesPct % 1 === 0 ? 0 : 1)} des revenus`} />
            <Row label="Taux d’actualisation" value={rep.assumptions.discountRatePct === null ? 'Non renseigné' : `${formatPercent(rep.assumptions.discountRatePct)} / an`} />
            <Helper>{`Montants en FCFA. Hypothèses constantes sur ${rep.project.horizonMonths} mois, règlements dans le mois ; aucune valeur de revente.`}</Helper>
          </Card>

          <Card>
            <SectionTitle>{`Indicateurs sur ${rep.results.horizonMonths} mois`}</SectionTitle>
            <Row label="Chiffre d’affaires" value={formatFcfa(rep.results.revenueTotal)} />
            <Row label="Charges" value={formatFcfa(rep.results.chargesTotal)} />
            <Row label="Résultat estimé" value={formatFcfa(rep.results.netResult)} strong />
            <Row label="Marge / ROI" value={`${formatPercent(rep.results.marginPct)} / ${rep.results.roiPct === null ? '—' : formatPercent(rep.results.roiPct, 0)}`} />
            <Row label="Seuil de rentabilité mensuel" value={rep.results.breakEvenMonthlyRevenue === null ? 'Non calculable' : formatFcfa(rep.results.breakEvenMonthlyRevenue)} />
            <Row label="Récupération de l’apport" value={rep.results.paybackMonth === null ? 'Hors période' : `${ordinalMonth(rep.results.paybackMonth)} mois`} />
            <Row label={`Trésorerie fin ${monthName(rep.project.endDate)}`} value={formatFcfa(rep.results.treasury.endBalance)} />
            <Row label="Valeur actuelle nette" value={rep.results.npv === null ? 'Non calculée' : formatFcfa(rep.results.npv)} />
            <Helper>VAN : taux d’actualisation requis. Récupération : premier mois où les flux cumulés, investissement inclus, deviennent positifs.</Helper>
          </Card>

          <SectionTitle>Risques & pistes d’amélioration</SectionTitle>
          {rep.risks.map((risk) => (
            <Card key={risk.id} tone="soft">
              <Text style={styles.riskTitle}>{risk.title}</Text>
              <Text style={styles.riskText}>{risk.message}</Text>
            </Card>
          ))}
          <Helper>Repères fondés sur les hypothèses saisies et des règles de calcul fixes.</Helper>

          <Banner variant="warning" title="Une estimation, pas une garantie">
            Ce rapport ne constitue pas un conseil financier. Les résultats réels peuvent différer ; vérifiez les hypothèses avant toute décision.
          </Banner>
          <Button title="Exporter en PDF" icon={FileDown} onPress={onExport} loading={exporting} />
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { gap: spacing.sm },
  projectName: { fontSize: 20, fontWeight: '800', color: colors.text },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing.md, paddingVertical: 6, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  rowLabel: { flex: 1, fontSize: 14, color: colors.textMuted },
  rowValue: { flexShrink: 1, fontSize: 14.5, fontWeight: '700', color: colors.text, textAlign: 'right' },
  rowStrong: { fontSize: 16, fontWeight: '800', color: colors.primary },
  riskTitle: { fontSize: 15, fontWeight: '800', color: colors.text },
  riskText: { fontSize: 14, lineHeight: 20, color: colors.text },
});
