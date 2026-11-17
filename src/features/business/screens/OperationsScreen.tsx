import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Card, Eyebrow, Helper, Screen, SegmentedControl, Subtitle, Title } from '../../../components/kit';
import type { BusinessStackParamList } from '../../../navigation/routes';
import { formatFcfa } from '../../../utils/format';
import { useBusinessStore, isOperationType } from '../store';
import type { OperationType } from '../../../navigation/routes';

const FILTERS = [
  { value: 'all', label: 'Tout' },
  { value: 'income', label: 'Recettes' },
  { value: 'expense', label: 'Dépenses' },
];

export function OperationsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<BusinessStackParamList>>();
  const operations = useBusinessStore((state) => state.operations);
  const [filter, setFilter] = useState<'all' | OperationType>('all');
  const filtered = useMemo(() => operations.filter((item) => filter === 'all' || item.type === filter), [operations, filter]);
  return (
    <Screen>
      <Eyebrow>Parcours B · Activité</Eyebrow>
      <Title>Vos opérations.</Title>
      <Subtitle>Les recettes et dépenses enregistrées pour votre entreprise.</Subtitle>
      <SegmentedControl options={FILTERS} value={filter} onChange={(value) => setFilter(value === 'all' || isOperationType(value) ? value : 'all')} />
      {filtered.length ? filtered.map((item) => (
        <Card key={item.id}>
          <View style={styles.row}>
            <Text style={styles.title}>{item.description || item.category}</Text>
            <Text style={styles.amount}>{`${item.type === 'income' ? '+' : '−'}${formatFcfa(item.amount)}`}</Text>
          </View>
          <Helper>{`${item.date} · ${item.category}`}</Helper>
        </Card>
      )) : <Card><Helper>Aucune opération à afficher.</Helper></Card>}
      <Button title="Ajouter une opération" onPress={() => navigation.navigate('AddOperation')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  title: { flex: 1, color: '#14261E', fontWeight: '700' },
  amount: { color: '#0E5C45', fontWeight: '700' },
});
