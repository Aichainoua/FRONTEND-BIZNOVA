import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Plus } from 'lucide-react-native';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Badge, Banner, Button, Card, Eyebrow, Helper, LinkButton, Screen, Subtitle, Title } from '../../../components/kit';
import type { ProjectsStackParamList } from '../../../navigation/routes';
import { colors, spacing } from '../../../theme/tokens';
import { getErrorMessage } from '../../../utils/errors';
import { formatUpdated } from '../../../utils/format';
import { AccountHeader } from '../../common/AccountHeader';
import { useProjects } from '../hooks';
import { STATUS_LABEL } from '../labels';
import { sectorLabel } from '../sectors';
import type { ProjectSummary } from '../types';

type Props = NativeStackScreenProps<ProjectsStackParamList, 'ProjectList'>;

// Écran provisoire : la maquette de la liste des projets n'existe pas encore (voir README).
export function ProjectListScreen({ navigation }: Props) {
  const projects = useProjects();

  const open = (p: ProjectSummary) => {
    if (p.resumeStep === 1) navigation.navigate('ForecastProject', { projectId: p.id });
    else if (p.resumeStep === 2) navigation.navigate('ForecastAssumptions', { projectId: p.id });
    else navigation.navigate('ForecastResults', { projectId: p.id });
  };
  const create = () => navigation.navigate('ForecastProject', {});

  return (
    <Screen onRefresh={() => void projects.refetch()} refreshing={projects.isRefetching}>
      <AccountHeader />
      <View style={styles.intro}>
        <Eyebrow>Parcours A · Prévisionnel</Eyebrow>
        <Title>Vos projets.</Title>
        <Subtitle>Reprenez un prévisionnel ou évaluez une nouvelle idée.</Subtitle>
      </View>
      <Button title="Nouveau projet" icon={Plus} onPress={create} />

      {projects.isLoading ? <ActivityIndicator color={colors.primary} /> : null}
      {projects.isError ? (
        <Banner variant="danger" title="Impossible de charger vos projets" action={<LinkButton label="Réessayer" onPress={() => void projects.refetch()} />}>
          {getErrorMessage(projects.error)}
        </Banner>
      ) : null}
      {projects.data?.length === 0 ? (
        <Card tone="soft">
          <Text style={styles.name}>Aucun projet pour l’instant</Text>
          <Helper>Créez votre premier prévisionnel : il vous faut seulement un nom, un secteur et quelques montants.</Helper>
        </Card>
      ) : null}

      {projects.data?.map((p) => (
        <Card key={p.id} onPress={() => open(p)} accessibilityLabel={`Ouvrir ${p.name}`}>
          <Text style={styles.name}>{p.name}</Text>
          <Helper>{`${sectorLabel(p.sector)} · ${p.horizonMonths} mois · modifié ${formatUpdated(p.updatedAt)}`}</Helper>
          <Badge label={STATUS_LABEL[p.status]} tone={p.status === 'draft' ? 'amber' : 'green'} />
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { gap: spacing.sm },
  name: { fontSize: 16, fontWeight: '800', color: colors.text },
});
