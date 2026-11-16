import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowRight } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Badge, Banner, Button, Eyebrow, Helper, NumberField, Screen, SectionTitle, Stepper, Subtitle, Title } from '../../../components/kit';
import type { ProjectsStackParamList } from '../../../navigation/routes';
import { colors, spacing } from '../../../theme/tokens';
import { getErrorMessage } from '../../../utils/errors';
import { formatFcfa, formatNumber, formatShortPeriod, formatTime, parseNumber } from '../../../utils/format';
import { AccountHeader } from '../../common/AccountHeader';
import { useProject, useSaveAssumptions, useSectors } from '../hooks';
import {
  assumptionsSchema,
  EMPTY_ASSUMPTIONS_FORM,
  toAssumptions,
  toFormValues,
  toPartialAssumptions,
  type AssumptionsFormValues,
} from '../schemas';
import { DEFAULT_SECTORS, GENERIC_HINTS } from '../sectors';

type Props = NativeStackScreenProps<ProjectsStackParamList, 'ForecastAssumptions'>;

export function AssumptionsScreen({ navigation, route }: Props) {
  const { projectId } = route.params;
  const project = useProject(projectId);
  const sectors = useSectors();
  const save = useSaveAssumptions(projectId);
  const [serverError, setServerError] = useState<string | null>(null);
  const [savingForLater, setSavingForLater] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    getValues,
    formState: { errors, isSubmitting, submitCount },
  } = useForm<AssumptionsFormValues>({ resolver: zodResolver(assumptionsSchema), defaultValues: EMPTY_ASSUMPTIONS_FORM, mode: 'onTouched' });

  const loaded = project.data;
  useEffect(() => {
    if (loaded) reset(toFormValues(loaded.assumptions));
    // Réinitialisation au chargement d'un autre projet uniquement.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded?.id, reset]);

  // Aides contextuelles adaptées au secteur (US-T2).
  const hints = (sectors.data ?? DEFAULT_SECTORS).find((s) => s.id === loaded?.sector)?.hints ?? GENERIC_HINTS;

  // Aperçu en direct. Indicatif seulement : les vrais calculs sont faits par le serveur.
  const values = watch();
  const revenue = parseNumber(values.monthlyRevenue);
  const variablePct = parseNumber(values.variableChargesPct);
  const variableMonthly = revenue !== undefined && variablePct !== undefined ? Math.round((revenue * variablePct) / 100) : undefined;
  const investment = parseNumber(values.initialInvestment);
  const own = parseNumber(values.ownContribution);
  const loan = parseNumber(values.loanAmount) ?? 0;
  const startBalance = investment !== undefined && own !== undefined ? own + loan - investment : undefined;

  const months = loaded?.horizonMonths ?? 12;
  const subtitle = loaded ? `${loaded.name} · ${formatShortPeriod(loaded.startDate, loaded.endDate)} · FCFA` : '';

  const onCalculate = handleSubmit(async (formValues) => {
    setServerError(null);
    try {
      await save.mutateAsync({ assumptions: toAssumptions(formValues), draft: false });
      navigation.navigate('ForecastResults', { projectId });
    } catch (error) {
      setServerError(getErrorMessage(error));
    }
  });

  const onSaveForLater = async () => {
    setServerError(null);
    setSavingForLater(true);
    try {
      await save.mutateAsync({ assumptions: toPartialAssumptions(getValues()), draft: true });
      navigation.navigate('ProjectList');
    } catch (error) {
      setServerError(getErrorMessage(error));
    } finally {
      setSavingForLater(false);
    }
  };

  if (project.isLoading) {
    return (
      <Screen>
        <AccountHeader />
        <ActivityIndicator color={colors.primary} />
      </Screen>
    );
  }

  const hasErrors = submitCount > 0 && Object.keys(errors).length > 0;

  return (
    <Screen>
      <AccountHeader />
      <View style={styles.intro}>
        <Eyebrow>Parcours A · Étape 2 sur 3</Eyebrow>
        <Title>Vos hypothèses, pas à pas.</Title>
        <Subtitle>{subtitle}</Subtitle>
      </View>
      <Stepper current={2} />
      <View style={styles.badges}>
        <Badge label="Prévisionnel" tone="green" />
        {loaded?.status === 'draft' && loaded.draftSavedAt ? <Badge label={`Brouillon enregistré à ${formatTime(loaded.draftSavedAt)}`} tone="amber" /> : null}
      </View>

      {project.isError ? <Banner variant="danger">{getErrorMessage(project.error)}</Banner> : null}

      <Banner variant="info" title="Un point de départ, pas une promesse">
        {`Renseignez des estimations réalistes. Les montants mensuels seront constants sur les ${months} mois.`}
      </Banner>

      <SectionTitle>Au lancement</SectionTitle>
      <Controller
        control={control}
        name="initialInvestment"
        render={({ field: { value, onChange, onBlur } }) => (
          <NumberField
            kind="money"
            label="Investissement initial"
            required
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.initialInvestment?.message}
            helper={
              hints.investmentExamples.length > 0
                ? `Ce que vous payez une seule fois pour démarrer. Exemples : ${hints.investmentExamples.map((e) => `${e.label} ${formatNumber(e.amount)}`).join(' · ')}. Payé au démarrage · hors charges mensuelles.`
                : 'Ce que vous payez une seule fois pour démarrer. Payé au démarrage · hors charges mensuelles.'
            }
          />
        )}
      />

      <SectionTitle>Chaque mois</SectionTitle>
      <Controller
        control={control}
        name="monthlyRevenue"
        render={({ field: { value, onChange, onBlur } }) => (
          <NumberField kind="money" unit="/ mois" label="Revenus prévisionnels" required value={value} onChangeText={onChange} onBlur={onBlur} error={errors.monthlyRevenue?.message} helper={hints.revenueExample} />
        )}
      />
      <Controller
        control={control}
        name="fixedCharges"
        render={({ field: { value, onChange, onBlur } }) => (
          <NumberField kind="money" unit="/ mois" label="Charges fixes" required value={value} onChangeText={onChange} onBlur={onBlur} error={errors.fixedCharges?.message} helper={hints.fixedChargesHint} />
        )}
      />
      <Controller
        control={control}
        name="variableChargesPct"
        render={({ field: { value, onChange, onBlur } }) => (
          <NumberField
            kind="percent"
            unit="des revenus"
            label="Charges variables"
            required
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.variableChargesPct?.message}
            helper={variableMonthly !== undefined ? `${hints.variableChargesHint} : ${formatFcfa(variableMonthly)} par mois avec ces revenus.` : hints.variableChargesHint}
          />
        )}
      />

      <SectionTitle>Financer le démarrage</SectionTitle>
      <Controller
        control={control}
        name="ownContribution"
        render={({ field: { value, onChange, onBlur } }) => (
          <NumberField kind="money" label="Apport personnel" required value={value} onChangeText={onChange} onBlur={onBlur} error={errors.ownContribution?.message} helper="L’argent que vous investissez dans le projet." />
        )}
      />
      <Controller
        control={control}
        name="loanAmount"
        render={({ field: { value, onChange, onBlur } }) => (
          <NumberField
            kind="money"
            label="Emprunt éventuel"
            optional
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.loanAmount?.message}
            helper={`${loan > 0 ? 'L’emprunt est compté comme argent reçu au démarrage.' : 'Aucun emprunt renseigné : l’apport finance le démarrage.'}${startBalance !== undefined ? ` Trésorerie disponible après le lancement : ${formatFcfa(startBalance)}.` : ''} Aucun intérêt ni remboursement d’emprunt n’est prévu.`}
          />
        )}
      />
      {startBalance !== undefined && startBalance < 0 ? (
        <Banner variant="warning" title="Le financement ne couvre pas l’investissement">
          {`Il manque ${formatFcfa(Math.abs(startBalance))} au démarrage. Vous pouvez continuer, mais la trésorerie de départ sera négative.`}
        </Banner>
      ) : null}

      <SectionTitle>Préciser le calcul</SectionTitle>
      <Helper>Les revenus sont encaissés et les charges payées dans le même mois. Pas de croissance ni de valeur de revente prévue.</Helper>
      <Controller
        control={control}
        name="discountRatePct"
        render={({ field: { value, onChange, onBlur } }) => (
          <NumberField
            kind="percent"
            unit="/ an"
            label="Taux d’actualisation annuel"
            optional
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder="À renseigner"
            error={errors.discountRatePct?.message}
            helper="Nécessaire pour la valeur actuelle nette (VAN). Sans ce taux, la VAN ne sera pas calculée."
          />
        )}
      />

      {hasErrors ? <Banner variant="warning">Corrigez les champs signalés avant de calculer.</Banner> : null}
      {serverError ? <Banner variant="danger">{serverError}</Banner> : null}

      <Button title="Calculer le prévisionnel" icon={ArrowRight} onPress={onCalculate} loading={isSubmitting} disabled={savingForLater} />
      <Button title="Enregistrer et reprendre plus tard" variant="secondary" onPress={onSaveForLater} loading={savingForLater} disabled={isSubmitting} />
      <Helper style={styles.center}>* Champs obligatoires · Modifiables avant chaque calcul.</Helper>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { gap: spacing.sm },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  center: { textAlign: 'center' },
});
