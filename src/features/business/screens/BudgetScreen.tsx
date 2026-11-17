import { useState } from 'react';
import { Alert } from 'react-native';
import { Badge, Button, Card, Eyebrow, Helper, NumberField, Screen, Subtitle, Title } from '../../../components/kit';
import { formatFcfa } from '../../../utils/format';
import { operationsForMonth } from '../finance';
import { useBusinessStore } from '../store';

export function BudgetScreen() {
  const business = useBusinessStore((state) => state.business);
  const allOperations = useBusinessStore((state) => state.operations);
  const updateMonthlyBudget = useBusinessStore((state) => state.updateMonthlyBudget);
  const [draft, setDraft] = useState('');
  const expense = operationsForMonth(allOperations)
    .filter((item) => item.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0);
  if (!business) return null;

  const save = async () => {
    const amount = Number(draft);
    if (!Number.isFinite(amount) || amount <= 0) {
      Alert.alert('Budget invalide', 'Le budget doit être supérieur à zéro.');
      return;
    }
    try {
      await updateMonthlyBudget(amount);
      setDraft('');
      Alert.alert('Budget modifié', 'Votre budget mensuel a été mis à jour.');
    } catch (error) {
      Alert.alert('Modification impossible', error instanceof Error ? error.message : 'Le budget n’a pas pu être enregistré.');
    }
  };

  const remaining = business.monthlyBudget - expense;
  return (
    <Screen>
      <Eyebrow>Parcours B · Gestion</Eyebrow>
      <Title>Votre budget.</Title>
      <Subtitle>Suivez vos dépenses et ajustez votre limite mensuelle.</Subtitle>
      <Card>
        <Badge label={remaining < 0 ? 'Budget dépassé' : 'Budget respecté'} tone={remaining < 0 ? 'amber' : 'green'} />
        <Helper>{`Budget prévu : ${formatFcfa(business.monthlyBudget)}`}</Helper>
        <Helper>{`Dépenses enregistrées : ${formatFcfa(expense)}`}</Helper>
        <Helper>{`${remaining < 0 ? 'Dépassement' : 'Reste disponible'} : ${formatFcfa(Math.abs(remaining))}`}</Helper>
      </Card>
      <NumberField label="Nouveau budget mensuel" required kind="money" value={draft} onChangeText={setDraft} />
      <Button title="Mettre à jour le budget" onPress={() => void save()} />
    </Screen>
  );
}
