import { StyleSheet, Text } from 'react-native';
import { Card, Eyebrow, Helper, KpiCard, Screen, SectionTitle, Subtitle, Title } from '../../../components/kit';
import { formatFcfa } from '../../../utils/format';
import { operationsForMonth } from '../finance';
import { useBusinessStore } from '../store';

export function MonthlyReportScreen() {
  const business = useBusinessStore((state) => state.business);
  const allOperations = useBusinessStore((state) => state.operations);
  const operations = operationsForMonth(allOperations);
  const income = operations.filter((item) => item.type === 'income').reduce((sum, item) => sum + item.amount, 0);
  const expense = operations.filter((item) => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0);

  if (!business) {
    return (
      <Screen>
        <Eyebrow>Parcours B · Rapport</Eyebrow>
        <Title>Votre mois, en perspective.</Title>
        <Card><Helper>Configurez votre entreprise et enregistrez des opérations pour construire votre rapport.</Helper></Card>
      </Screen>
    );
  }

  return (
    <Screen>
      <Eyebrow>Parcours B · Rapport mensuel</Eyebrow>
      <Title>Votre mois, en perspective.</Title>
      <Subtitle>{`${business.name} · Tous les montants en FCFA`}</Subtitle>
      <Card tone="dark">
        <Helper style={styles.muted}>Résultat estimé</Helper>
        <Text style={styles.total}>{formatFcfa(income - expense)}</Text>
        <Helper style={styles.muted}>Recettes − dépenses</Helper>
      </Card>
      <SectionTitle>Recettes et dépenses</SectionTitle>
      <KpiCard label="Recettes encaissées" value={formatFcfa(income)} />
      <KpiCard label="Dépenses payées" value={formatFcfa(expense)} />
      <SectionTitle>Trésorerie</SectionTitle>
      <Card>
        <Helper>{`Trésorerie initiale : ${formatFcfa(business.initialCash)}`}</Helper>
        <Helper>{`Trésorerie estimée : ${formatFcfa(business.initialCash + income - expense)}`}</Helper>
      </Card>
      <SectionTitle>Budget mensuel</SectionTitle>
      <Card>
        <Helper>{`Budget prévu : ${formatFcfa(business.monthlyBudget)}`}</Helper>
        <Helper>{`Dépenses : ${formatFcfa(expense)}`}</Helper>
        <Helper>{`Reste : ${formatFcfa(business.monthlyBudget - expense)}`}</Helper>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  muted: { color: '#BFDACB' },
  total: { color: '#FFFFFF', fontSize: 32, fontWeight: '800' },
});
