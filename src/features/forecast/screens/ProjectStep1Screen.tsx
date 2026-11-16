import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowRight } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Badge, Banner, Button, Eyebrow, Helper, RadioCardGroup, Screen, SegmentedControl, Stepper, Subtitle, TextField, Title } from '../../../components/kit';
import type { ProjectsStackParamList } from '../../../navigation/routes';
import { colors, spacing, typography } from '../../../theme/tokens';
import { getErrorMessage } from '../../../utils/errors';
import { formatPeriod } from '../../../utils/format';
import { AccountHeader } from '../../common/AccountHeader';
import { useCreateProject, useProject, useSectors, useUpdateProject } from '../hooks';
import { defaultStartDate, endOfPeriod } from '../period';
import { projectSchema, type ProjectFormValues } from '../schemas';
import { DEFAULT_SECTORS } from '../sectors';
import type { Horizon, Project, ProjectPayload, Sector } from '../types';

type Props = NativeStackScreenProps<ProjectsStackParamList, 'ForecastProject'>;

const HORIZONS: { value: Horizon; label: string }[] = [
  { value: 12, label: '12 mois' },
  { value: 24, label: '24 mois' },
  { value: 36, label: '36 mois' },
];

export function ProjectStep1Screen({ navigation, route }: Props) {
  const projectId = route.params?.projectId;
  const project = useProject(projectId);
  const sectors = useSectors();
  const create = useCreateProject();
  const update = useUpdateProject(projectId ?? '');
  const [serverError, setServerError] = useState<string | null>(null);
  const [savingForLater, setSavingForLater] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    getValues,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({ resolver: zodResolver(projectSchema), defaultValues: { name: '', sector: '', horizonMonths: 12 }, mode: 'onTouched' });

  const loaded = project.data;
  useEffect(() => {
    if (loaded) reset({ name: loaded.name, sector: loaded.sector ?? '', horizonMonths: loaded.horizonMonths });
    // On ne réinitialise qu'au chargement d'un autre projet, pas à chaque mise à jour du cache.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded?.id, reset]);

  const horizon = watch('horizonMonths') as Horizon;
  const start = loaded?.startDate ?? defaultStartDate();
  const sectorOptions = (sectors.data ?? DEFAULT_SECTORS).map((s) => ({ value: s.id, label: s.label }));

  const persist = async (values: ProjectFormValues): Promise<Project> => {
    const payload: ProjectPayload = { name: values.name.trim(), sector: (values.sector || null) as Sector | null, horizonMonths: values.horizonMonths as Horizon };
    if (projectId) return update.mutateAsync(payload);
    const created = await create.mutateAsync(payload);
    navigation.setParams({ projectId: created.id }); // revenir sur cet écran modifie le projet au lieu d'en créer un autre
    return created;
  };

  const onContinue = handleSubmit(async (values) => {
    setServerError(null);
    try {
      const saved = await persist(values);
      navigation.navigate('ForecastAssumptions', { projectId: saved.id });
    } catch (error) {
      setServerError(getErrorMessage(error));
    }
  });

  const onSaveAndQuit = async () => {
    const values = getValues();
    if (values.name.trim().length < 2) {
      setError('name', { message: 'Donnez un nom à votre projet (2 caractères minimum).' });
      return;
    }
    setServerError(null);
    setSavingForLater(true);
    try {
      await persist(values);
      navigation.navigate('ProjectList');
    } catch (error) {
      setServerError(getErrorMessage(error));
    } finally {
      setSavingForLater(false);
    }
  };

  if (projectId && project.isLoading) {
    return (
      <Screen>
        <AccountHeader />
        <ActivityIndicator color={colors.primary} />
      </Screen>
    );
  }

  return (
    <Screen>
      <AccountHeader />
      <View style={styles.intro}>
        <Eyebrow>Parcours A · Prévisionnel</Eyebrow>
        <Title>Donnons forme à votre projet.</Title>
        <Subtitle>Quelques informations pour adapter vos prévisions à votre activité.</Subtitle>
      </View>

      <View style={styles.stepRow}>
        <Stepper current={1} label="Le projet" />
        <Badge label="Brouillon" tone="amber" />
      </View>

      {project.isError ? <Banner variant="danger">{getErrorMessage(project.error)}</Banner> : null}

      <Controller
        control={control}
        name="name"
        render={({ field: { value, onChange, onBlur } }) => (
          <TextField label="Nom du projet" required value={value} onChangeText={onChange} onBlur={onBlur} placeholder="Studio web Dakar" autoCapitalize="sentences" error={errors.name?.message} />
        )}
      />

      <View style={styles.group}>
        <Text style={typography.label}>Secteur d’activité *</Text>
        <Controller control={control} name="sector" render={({ field: { value, onChange } }) => <RadioCardGroup<Sector> options={sectorOptions} value={value as Sector | ''} onChange={onChange} />} />
        {errors.sector?.message ? <Text style={styles.error}>{errors.sector.message}</Text> : <Helper>Les exemples de revenus et de charges seront adaptés à ce secteur.</Helper>}
      </View>

      <View style={styles.group}>
        <Text style={typography.label}>Horizon de prévision *</Text>
        <Controller control={control} name="horizonMonths" render={({ field: { value, onChange } }) => <SegmentedControl<Horizon> options={HORIZONS} value={value as Horizon} onChange={onChange} />} />
        <Helper>{formatPeriod(start, endOfPeriod(start, horizon))}</Helper>
      </View>

      <Banner variant="info" title="Commencez simplement">
        Tous les montants seront saisis en FCFA. Vous pourrez revoir vos hypothèses avant de calculer.
      </Banner>

      {serverError ? <Banner variant="danger">{serverError}</Banner> : null}
      <Button title="Continuer vers les hypothèses" icon={ArrowRight} onPress={onContinue} loading={isSubmitting} disabled={savingForLater} />
      <Button title="Enregistrer et quitter" variant="secondary" onPress={onSaveAndQuit} loading={savingForLater} disabled={isSubmitting} />
      <Helper style={styles.center}>* Champs obligatoires · Votre progression est conservée.</Helper>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { gap: spacing.sm },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.md },
  group: { gap: spacing.sm },
  error: { fontSize: 12.5, color: colors.dangerText, fontWeight: '600' },
  center: { textAlign: 'center' },
});
