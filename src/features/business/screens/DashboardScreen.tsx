import { ArrowRight, Plus } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Badge, Button, Card, Eyebrow, Helper, KpiCard, Screen, SectionTitle, Subtitle, Title } from '../../../components/kit';
import type { BusinessStackParamList } from '../../../navigation/routes';
import { formatFcfa } from '../../../utils/format';
import { operationsForMonth } from '../finance';
import { useBusinessStore } from '../store';

export function DashboardScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<BusinessStackParamList>>();
  const business = useBusinessStore((state) => state.business);
  const allOperations = useBusinessStore((state) => state.operations);
  const operations = operationsForMonth(allOperations);
  const income = operations.filter((item) => item.type === 'income').reduce((sum, item) => sum + item.amount, 0);
  const expense = operations.filter((item) => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0);
  const cash = (business?.initialCash ?? 0) + income - expense;
  const recent = operations.slice(0, 3);

  if (!business) return null;

  return (
    <Screen>
      <Eyebrow>{`Parcours B · ${business.name}`}</Eyebrow>
      <Title>Votre activité, en clair.</Title>
      <Subtitle>{business.sector} · Tous les montants en FCFA</Subtitle>
      <Card tone="dark">
        <Helper style={styles.heroLabel}>Trésorerie estimée</Helper>
        <Text style={styles.heroAmount}>{formatFcfa(cash)}</Text>
        <Helper style={styles.heroLabel}>{`${formatFcfa(business.initialCash)} au départ + recettes − dépenses`}</Helper>
      </Card>
      <View style={styles.kpis}>
        <KpiCard label="Recettes" value={formatFcfa(income)} />
        <KpiCard label="Dépenses" value={formatFcfa(expense)} />
      </View>
      <Card>
        <View style={styles.row}>
          <SectionTitle>Budget mensuel</SectionTitle>
          <Badge label={expense > business.monthlyBudget ? 'Dépassé' : 'En cours'} tone={expense > business.monthlyBudget ? 'amber' : 'green'} />
        </View>
        <Helper>{`${formatFcfa(expense)} dépensés sur ${formatFcfa(business.monthlyBudget)}`}</Helper>
        <Helper>{`Reste : ${formatFcfa(business.monthlyBudget - expense)}`}</Helper>
        <Button title="Gérer le budget" variant="secondary" onPress={() => navigation.navigate('Budget')} />
      </Card>
      <Button title="Ajouter une opération" icon={Plus} onPress={() => navigation.navigate('AddOperation')} />
      <SectionTitle>Activité récente</SectionTitle>
      <Card>
        {recent.length ? recent.map((item) => (
          <View key={item.id} style={styles.operation}>
            <Text style={styles.operationText}>{`${item.date} · ${item.description || item.category}`}</Text>
            <Helper>{`${item.type === 'income' ? '+' : '−'}${formatFcfa(item.amount)}`}</Helper>
          </View>
        )) : <Helper>Aucune opération enregistrée pour l’instant.</Helper>}
      </Card>
      <Button title="Voir toutes les opérations" variant="secondary" icon={ArrowRight} onPress={() => navigation.navigate('Operations')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroLabel: { color: '#BFDACB' },
  heroAmount: { color: '#FFFFFF', fontSize: 32, fontWeight: '800' },
  kpis: { flexDirection: 'row', gap: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  operation: { gap: 4, paddingVertical: 6 },
  operationText: { color: '#14261E', fontSize: 14, fontWeight: '600' },
});
