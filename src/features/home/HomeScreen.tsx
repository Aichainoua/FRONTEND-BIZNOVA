import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NavigatorScreenParams } from '@react-navigation/native';
import { ArrowRight } from 'lucide-react-native';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Badge, Banner, Button, Card, Eyebrow, Helper, LinkButton, Screen, SectionTitle, Subtitle, Title } from '../../components/kit';
import { env } from '../../config/env';
import type { AppTabParamList, ProjectsStackParamList } from '../../navigation/routes';
import { useAuthStore } from '../../stores/authStore';
import { colors, spacing } from '../../theme/tokens';
import { firstName, formatUpdated } from '../../utils/format';
import { getErrorMessage } from '../../utils/errors';
import { AccountHeader } from '../common/AccountHeader';
import { STATUS_LABEL } from '../forecast/labels';
import { useRecentWork } from '../forecast/hooks';
import type { RecentWorkItem } from '../forecast/types';

type Props = BottomTabScreenProps<AppTabParamList, 'Home'>;

function projectTarget(step: 1 | 2 | 3, projectId: string): NavigatorScreenParams<ProjectsStackParamList> {
  if (step === 1) return { screen: 'ForecastProject', params: { projectId } };
  if (step === 2) return { screen: 'ForecastAssumptions', params: { projectId } };
  return { screen: 'ForecastResults', params: { projectId } };
}

export function HomeScreen({ navigation }: Props) {
  const user = useAuthStore((s) => s.user);
  const recent = useRecentWork();

  const openItem = (item: RecentWorkItem) => {
    if (item.kind === 'forecast') navigation.navigate('Projects', projectTarget(item.resumeStep, item.id));
    else navigation.navigate('Company');
  };

  return (
    <Screen onRefresh={() => void recent.refetch()} refreshing={recent.isRefetching}>
      <AccountHeader />
      <View style={styles.intro}>
        <Eyebrow>{`Bienvenue, ${firstName(user?.fullName ?? '')}`}</Eyebrow>
        <Title>Que souhaitez-vous faire ?</Title>
        <Subtitle>Un espace pour vos idées, un autre pour votre activité au quotidien.</Subtitle>
      </View>

      <Card>
        <Eyebrow>Prévisionnel</Eyebrow>
        <SectionTitle>Évaluer un projet</SectionTitle>
        <Text style={styles.cardText}>Estimez vos revenus, vos coûts et la viabilité de votre idée avant de vous lancer.</Text>
        <Button title="Créer un prévisionnel" icon={ArrowRight} onPress={() => navigation.navigate('Projects', { screen: 'ForecastProject', params: {} })} />
      </Card>

      <Card>
        <Eyebrow>Mockup</Eyebrow>
        <SectionTitle>Workflow A</SectionTitle>
        <Text style={styles.cardText}>Ouvrez le maquette PDF de référence pour reproduire le parcours A exactement.</Text>
        <Button title="Ouvrir le workflow A" variant="secondary" icon={ArrowRight} onPress={() => navigation.navigate('Projects', { screen: 'WorkflowA' })} />
      </Card>

      <Card>
        <Eyebrow>Réel</Eyebrow>
        <SectionTitle>Gérer mon entreprise</SectionTitle>
        <Text style={styles.cardText}>Suivez vos recettes, vos dépenses et votre budget mensuel, sans jargon.</Text>
        <Button title="Configurer une entreprise" variant="secondary" icon={ArrowRight} onPress={() => navigation.navigate('Company')} />
      </Card>

      <View style={styles.sectionHeader}>
        <SectionTitle>Retrouver mon travail</SectionTitle>
        <LinkButton label="Tout voir" onPress={() => navigation.navigate('Projects', { screen: 'ProjectList' })} />
      </View>

      {recent.isLoading ? <ActivityIndicator color={colors.primary} /> : null}
      {recent.isError ? (
        <Banner variant="danger" title="Impossible de charger votre travail" action={<LinkButton label="Réessayer" onPress={() => void recent.refetch()} />}>
          {getErrorMessage(recent.error)}
        </Banner>
      ) : null}
      {recent.data?.length === 0 ? <Helper>Rien d’enregistré pour l’instant. Lancez un prévisionnel ou configurez votre entreprise.</Helper> : null}

      {recent.data?.map((item) => (
        <Card key={`${item.kind}-${item.id}`} onPress={() => openItem(item)} accessibilityLabel={`Ouvrir ${item.name}`}>
          <Text style={styles.itemName}>{item.name}</Text>
          {item.kind === 'forecast' ? (
            <>
              <Helper>{`Prévisionnel · ${item.horizonMonths} mois · modifié ${formatUpdated(item.updatedAt)}`}</Helper>
              <Badge label={STATUS_LABEL[item.status]} tone={item.status === 'draft' ? 'amber' : 'green'} />
            </>
          ) : (
            <>
              <Helper>{`Suivi réel · ${item.periodLabel}`}</Helper>
              <View style={styles.row}>
                <Badge label="À jour" tone="green" />
                <Helper>{`${item.operationsCount} opérations`}</Helper>
              </View>
            </>
          )}
        </Card>
      ))}

      {env.useMocks ? <Helper style={styles.demo}>Données d’exemple · BizNova, nom de travail</Helper> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { gap: spacing.sm },
  cardText: { fontSize: 14.5, lineHeight: 21, color: colors.textMuted, marginBottom: spacing.sm },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.sm },
  itemName: { fontSize: 16, fontWeight: '800', color: colors.text },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  demo: { textAlign: 'center' },
});
