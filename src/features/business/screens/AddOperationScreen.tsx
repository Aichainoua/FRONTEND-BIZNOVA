import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Eyebrow, NumberField, Screen, SegmentedControl, Subtitle, TextField, Title } from '../../../components/kit';
import type { BusinessStackParamList, OperationType } from '../../../navigation/routes';
import { useBusinessStore } from '../store';

const TYPES: { value: OperationType; label: string }[] = [
  { value: 'income', label: 'Recette' },
  { value: 'expense', label: 'Dépense' },
];

function today() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function AddOperationScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<BusinessStackParamList>>();
  const addOperation = useBusinessStore((state) => state.addOperation);
  const business = useBusinessStore((state) => state.business);
  const [type, setType] = useState<OperationType>('income');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(today);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const submit = async () => {
    const value = Number(amount);
    const parsedDate = /^\d{4}-\d{2}-\d{2}$/.test(date) ? new Date(`${date}T00:00:00Z`) : null;
    const validDate =
      parsedDate !== null &&
      !Number.isNaN(parsedDate.getTime()) &&
      parsedDate.toISOString().slice(0, 10) === date &&
      date <= today() &&
      date >= (business?.trackingStart ?? today());
    if (!Number.isFinite(value) || value <= 0 || !validDate || !category.trim()) {
      Alert.alert('Informations à vérifier', 'Saisissez un montant supérieur à zéro, une date au format AAAA-MM-JJ et une catégorie.');
      return;
    }
    try {
      await addOperation({ type, amount: value, date, category: category.trim(), description: description.trim() });
      setAmount('');
      setCategory('');
      setDescription('');
      navigation.navigate('Operations');
    } catch (error) {
      Alert.alert('Enregistrement impossible', error instanceof Error ? error.message : 'L’opération n’a pas pu être enregistrée.');
    }
  };

  return (
    <Screen>
      <Eyebrow>Parcours B · Suivi réel</Eyebrow>
      <Title>Ajouter une opération.</Title>
      <Subtitle>Enregistrez une recette encaissée ou une dépense payée.</Subtitle>
      <SegmentedControl options={TYPES} value={type} onChange={setType} />
      <NumberField label="Montant" required kind="money" value={amount} onChangeText={setAmount} />
      <TextField label="Date" required value={date} onChangeText={setDate} placeholder="AAAA-MM-JJ" />
      <TextField label="Catégorie" required value={category} onChangeText={setCategory} placeholder="Ex. Vente, transport…" />
      <TextField label="Description" optional value={description} onChangeText={setDescription} placeholder="Détail facultatif" />
      <Button title={type === 'income' ? 'Enregistrer la recette' : 'Enregistrer la dépense'} onPress={() => void submit()} />
    </Screen>
  );
}
