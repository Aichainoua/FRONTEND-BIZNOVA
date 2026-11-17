import { useState } from 'react';
import { Alert } from 'react-native';
import { Button, Eyebrow, Helper, NumberField, Screen, Subtitle, TextField, Title } from '../../../components/kit';
import { useBusinessStore } from '../store';

const today = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

export function SetupScreen() {
  const configureBusiness = useBusinessStore((state) => state.configureBusiness);
  const [name, setName] = useState('');
  const [sector, setSector] = useState('');
  const [trackingStart, setTrackingStart] = useState(today);
  const [monthlyBudget, setMonthlyBudget] = useState('');
  const [initialCash, setInitialCash] = useState('');

  const submit = async () => {
    const budget = Number(monthlyBudget);
    const cash = Number(initialCash);
    const parsedDate = /^\d{4}-\d{2}-\d{2}$/.test(trackingStart)
      ? new Date(`${trackingStart}T00:00:00Z`)
      : null;
    const validDate =
      parsedDate !== null &&
      !Number.isNaN(parsedDate.getTime()) &&
      parsedDate.toISOString().slice(0, 10) === trackingStart &&
      trackingStart <= today();
    if (!name.trim() || !sector.trim() || !validDate || !Number.isFinite(budget) || budget <= 0 || !initialCash.trim() || !Number.isFinite(cash) || cash < 0) {
      Alert.alert('Informations à vérifier', 'Renseignez le nom, le secteur, une date valide, un budget supérieur à zéro et une trésorerie positive ou nulle.');
      return;
    }
    try {
      await configureBusiness({ name: name.trim(), sector: sector.trim(), trackingStart, monthlyBudget: budget, initialCash: cash });
    } catch (error) {
      Alert.alert('Enregistrement impossible', error instanceof Error ? error.message : 'Les données n’ont pas pu être enregistrées.');
    }
  };

  return (
    <Screen>
      <Eyebrow>Parcours B · Suivi réel</Eyebrow>
      <Title>Configurez votre entreprise.</Title>
      <Subtitle>Définissez votre point de départ pour suivre vos recettes, dépenses et votre budget.</Subtitle>
      <TextField label="Nom de l’entreprise" required value={name} onChangeText={setName} placeholder="Ex. Nova Studio" autoCapitalize="words" />
      <TextField label="Secteur d’activité" required value={sector} onChangeText={setSector} placeholder="Ex. Commerce, services…" />
      <TextField label="Début du suivi" required value={trackingStart} onChangeText={setTrackingStart} placeholder="AAAA-MM-JJ" />
      <Helper>Utilisez le format année-mois-jour.</Helper>
      <NumberField label="Budget mensuel" required kind="money" value={monthlyBudget} onChangeText={setMonthlyBudget} unit="/ mois" />
      <NumberField label="Trésorerie initiale" required kind="money" value={initialCash} onChangeText={setInitialCash} />
      <Button title="Créer mon espace entreprise" onPress={() => void submit()} />
    </Screen>
  );
}
