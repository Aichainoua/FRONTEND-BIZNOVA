import React, { useMemo, useState } from 'react';
import { Check, X } from 'lucide-react-native';
import { AmountHero } from '../../components/forms/AmountInput';
import { DateField } from '../../components/forms/DateField';
import { SelectField } from '../../components/forms/SelectField';
import { TagInput } from '../../components/forms/TagInput';
import { PageIntro } from '../../components/layout/PageIntro';
import { Screen } from '../../components/layout/Screen';
import { Button } from '../../components/ui/Button';
import { InfoNote } from '../../components/ui/InfoNote';
import { Input } from '../../components/ui/Input';
import { SegmentedControl, type SegmentOption } from '../../components/ui/SegmentedControl';
import { Text } from '../../components/ui/Text';
import { categoriesFor } from '../../domain/categories';
import { lastDayOf, monthKeyOf, todayIso, type IsoDate } from '../../domain/dates';
import type { OperationType } from '../../domain/types';
import { validateOperationDraft } from '../../domain/validation';
import { useBusiness, useKnownTags } from '../../hooks/useBusiness';
import type { BusinessScreenProps } from '../../navigation/types';
import { useBusinessStore } from '../../stores/businessStore';
import { withDe } from '../../utils/format';

const TYPE_OPTIONS: readonly SegmentOption<OperationType>[] = [
  { value: 'income', label: 'Recette' },
  { value: 'expense', label: 'Dépense' },
];

/** Écran 10 — Ajouter une opération (exigence B2, critères R4 et R5). */
export const AddOperationScreen: React.FC<BusinessScreenProps<'AddOperation'>> = ({
  navigation,
  route,
}) => {
  const business = useBusiness();
  const referenceMonth = useBusinessStore((state) => state.referenceMonth);
  const addOperation = useBusinessStore((state) => state.addOperation);
  const knownTags = useKnownTags();

  // Dernière date saisissable : aujourd'hui, sans dépasser le mois en cours du suivi.
  const maxDate = useMemo<IsoDate>(() => {
    const end = lastDayOf(referenceMonth);
    const today = todayIso();
    const latest = today < end ? today : end;
    return latest < business.trackingStart ? business.trackingStart : latest;
  }, [referenceMonth, business.trackingStart]);

  const [type, setType] = useState<OperationType>(route.params?.type ?? 'income');
  const [amount, setAmount] = useState<number | null>(null);
  const [date, setDate] = useState<IsoDate | null>(maxDate);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const isIncome = type === 'income';
  const categoryOptions = useMemo(
    () =>
      categoriesFor(business.sector, type).map((category) => ({
        value: category.id,
        label: category.label,
      })),
    [business.sector, type],
  );

  const draft = { type, amount, date, categoryId, description, tags };
  const context = { trackingStart: business.trackingStart, today: maxDate };
  const errors = submitted ? validateOperationDraft(draft, context) : {};

  const handleTypeChange = (next: OperationType) => {
    setType(next);
    // Les catégories dépendent du type : on abandonne celle qui n'existe plus.
    setCategoryId((current) =>
      categoriesFor(business.sector, next).some((category) => category.id === current)
        ? current
        : null,
    );
  };

  const handleSubmit = () => {
    setSubmitted(true);
    if (Object.keys(validateOperationDraft(draft, context)).length > 0) return;
    if (amount === null || date === null || categoryId === null) return;

    addOperation({ type, amount, date, categoryId, description, tags });
    navigation.navigate('Operations', { type: 'all' });
  };

  const monthLabel = withDe(monthKeyOf(date ?? maxDate));

  return (
    <Screen>
      <PageIntro
        eyebrow={`Parcours B · ${business.name}`}
        title="Une nouvelle opération."
        subtitle="Enregistrez un mouvement déjà encaissé ou payé."
      />

      <SegmentedControl
        options={TYPE_OPTIONS}
        value={type}
        onChange={handleTypeChange}
        accessibilityLabel="Type d’opération"
      />

      <AmountHero
        label={isIncome ? 'Montant encaissé' : 'Montant payé'}
        value={amount}
        onChange={setAmount}
        tone={isIncome ? 'income' : 'expense'}
        helper="Saisissez un montant strictement supérieur à 0, sans signe + ou −."
        error={errors.amount}
      />

      <DateField
        label={isIncome ? 'Date d’encaissement' : 'Date de paiement'}
        required
        value={date}
        onChange={setDate}
        min={business.trackingStart}
        max={maxDate}
        error={errors.date}
      />

      <SelectField
        label="Catégorie"
        required
        options={categoryOptions}
        value={categoryId}
        onChange={setCategoryId}
        placeholder="Choisir une catégorie"
        helper="Une catégorie obligatoire décrit la nature de l’opération."
        error={errors.categoryId}
      />

      <Input
        label="Description · facultatif"
        value={description}
        onChangeText={setDescription}
        placeholder="Ex. Maintenance mensuelle"
        autoCapitalize="sentences"
        returnKeyType="done"
      />

      <TagInput
        label="Étiquettes personnalisées · facultatif"
        tags={tags}
        onChange={setTags}
        suggestions={knownTags}
        helper="Choisissez-en plusieurs si besoin. Les étiquettes organisent vos opérations, elles ne remplacent pas la catégorie."
      />

      <InfoNote>
        {isIncome
          ? `Cette recette sera ajoutée aux recettes ${monthLabel} et à votre trésorerie. Elle ne consomme pas votre budget de dépenses.`
          : `Cette dépense sera ajoutée aux dépenses ${monthLabel}, consommera votre budget mensuel et diminuera votre trésorerie.`}
      </InfoNote>

      <Button
        title={isIncome ? 'Enregistrer la recette' : 'Enregistrer la dépense'}
        icon={Check}
        onPress={handleSubmit}
      />
      <Button title="Annuler" variant="outline" icon={X} onPress={() => navigation.goBack()} />

      <Text variant="small" tone="textSecondary">
        * Champs obligatoires
      </Text>
    </Screen>
  );
};
