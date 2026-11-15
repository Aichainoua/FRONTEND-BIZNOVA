import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Check, Save } from 'lucide-react-native';
import { AmountInput } from '../../components/forms/AmountInput';
import { DateField } from '../../components/forms/DateField';
import { Field } from '../../components/forms/Field';
import { PageIntro } from '../../components/layout/PageIntro';
import { Screen } from '../../components/layout/Screen';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { InfoNote } from '../../components/ui/InfoNote';
import { Input } from '../../components/ui/Input';
import { SelectableOption } from '../../components/ui/SelectableOption';
import { Text } from '../../components/ui/Text';
import { SECTORS } from '../../domain/categories';
import {
  addMonths,
  firstDayOf,
  monthKeyOf,
  todayIso,
  type IsoDate,
} from '../../domain/dates';
import { CURRENCY, type SectorId } from '../../domain/types';
import { validateBusinessSetup, type BusinessSetupDraft } from '../../domain/validation';
import type { BusinessScreenProps } from '../../navigation/types';
import { useBusinessStore } from '../../stores/businessStore';
import { formatDayMonthLong } from '../../utils/format';

/** Écran 07 — Configuration de l'entreprise (exigence B1). */
export const SetupScreen: React.FC<BusinessScreenProps<'BusinessSetup'>> = ({ navigation }) => {
  const configureBusiness = useBusinessStore((state) => state.configureBusiness);
  const saveSetupDraft = useBusinessStore((state) => state.saveSetupDraft);
  const [saved] = useState(() => useBusinessStore.getState().setupDraft);

  const today = useMemo(() => todayIso(), []);
  const earliestStart = useMemo(() => firstDayOf(addMonths(monthKeyOf(today), -36)), [today]);

  const [name, setName] = useState(saved?.name ?? '');
  const [sector, setSector] = useState<SectorId | null>(saved?.sector ?? null);
  const [trackingStart, setTrackingStart] = useState<IsoDate | null>(
    saved?.trackingStart ?? firstDayOf(monthKeyOf(today)),
  );
  const [monthlyBudget, setMonthlyBudget] = useState<number | null>(saved?.monthlyBudget ?? null);
  const [initialCash, setInitialCash] = useState<number | null>(saved?.initialCash ?? null);
  const [submitted, setSubmitted] = useState(false);

  const draft: BusinessSetupDraft = { name, sector, trackingStart, monthlyBudget, initialCash };
  const errors = submitted ? validateBusinessSetup(draft, { today }) : {};

  const handleCreate = () => {
    setSubmitted(true);
    const found = validateBusinessSetup(draft, { today });
    if (
      Object.keys(found).length > 0 ||
      !sector ||
      !trackingStart ||
      monthlyBudget === null ||
      initialCash === null
    ) {
      return;
    }
    // La pile « Entreprise » bascule d'elle-même sur le tableau de bord une fois l'entreprise créée.
    configureBusiness({ name, sector, trackingStart, monthlyBudget, initialCash });
  };

  const handleSaveAndLeave = () => {
    saveSetupDraft(draft);
    navigation.navigate('Home');
  };

  const cashHelper = trackingStart
    ? `L’argent disponible au ${formatDayMonthLong(trackingStart)}, avant les premières opérations du suivi.`
    : 'L’argent disponible au premier jour du suivi, avant les premières opérations.';

  return (
    <Screen>
      <PageIntro
        eyebrow="Parcours B · Suivi réel"
        title="Bienvenue dans votre entreprise."
        subtitle="Configurez votre suivi. Vous ajouterez ensuite vos opérations réglées."
      />
      <Badge label="Configuration · 1 seule étape" />

      <Input
        label="Nom de l’entreprise"
        required
        value={name}
        onChangeText={setName}
        placeholder="Ex. Nova Studio"
        autoCapitalize="words"
        returnKeyType="done"
        error={errors.name}
      />

      <Field label="Secteur d’activité" required error={errors.sector}>
        <View style={styles.options} accessibilityRole="radiogroup">
          {SECTORS.map((item) => (
            <SelectableOption
              key={item.id}
              label={item.label}
              selected={sector === item.id}
              onPress={() => setSector(item.id)}
            />
          ))}
        </View>
      </Field>

      <Text variant="heading" accessibilityRole="header" style={styles.sectionTitle}>
        Votre point de départ
      </Text>

      <DateField
        label="Début du suivi"
        required
        value={trackingStart}
        onChange={setTrackingStart}
        min={earliestStart}
        max={today}
        error={errors.trackingStart}
      />

      <AmountInput
        label="Budget mensuel global"
        required
        value={monthlyBudget}
        onChange={setMonthlyBudget}
        helper="La limite totale que vous prévoyez pour toutes vos dépenses du mois. Un seul budget, pas d’enveloppes par catégorie."
        error={errors.monthlyBudget}
      />

      <AmountInput
        label="Trésorerie initiale"
        required
        value={initialCash}
        onChange={setInitialCash}
        helper={cashHelper}
        error={errors.initialCash}
      />

      <InfoNote title="Deux repères différents">
        Le budget encadre vos dépenses. La trésorerie représente l’argent disponible ; elle évolue
        avec vos recettes et vos paiements.
      </InfoNote>

      <Text variant="small" tone="textSecondary">
        {`Devise du suivi : ${CURRENCY} · * Champs obligatoires`}
      </Text>

      <Button title="Créer mon espace entreprise" icon={Check} onPress={handleCreate} />
      <Button
        title="Enregistrer et quitter"
        variant="outline"
        icon={Save}
        onPress={handleSaveAndLeave}
        accessibilityHint="Conserve votre saisie et retourne à l’accueil"
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  options: {
    gap: 8,
  },
  sectionTitle: {
    marginTop: 4,
  },
});
