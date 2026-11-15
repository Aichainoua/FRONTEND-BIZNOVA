import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import {
  ArrowUpRight,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  ChevronRight,
  FolderOpen,
  type LucideIcon,
} from 'lucide-react-native';
import { PageIntro } from '../../components/layout/PageIntro';
import { Screen } from '../../components/layout/Screen';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { HeroCard } from '../../components/ui/HeroCard';
import { SectionTitle } from '../../components/ui/SectionTitle';
import { Text } from '../../components/ui/Text';
import { usePeriodData, useCurrentUser } from '../../hooks/useBusiness';
import type { TabScreenProps } from '../../navigation/types';
import { useBusinessStore } from '../../stores/businessStore';
import { useColors } from '../../theme';
import { radius } from '../../theme/spacing';
import { countLabel, formatMonthLabel } from '../../utils/format';

interface WorkspaceCardProps {
  tone: 'deep' | 'light';
  icon: LucideIcon;
  badge: string;
  title: string;
  description: string;
  linkLabel: string;
  onPress: () => void;
}

/** Grande carte d'entrée vers l'un des deux parcours. */
const WorkspaceCard: React.FC<WorkspaceCardProps> = ({
  tone,
  icon: Icon,
  badge,
  title,
  description,
  linkLabel,
  onPress,
}) => {
  const colors = useColors();
  const deep = tone === 'deep';
  const Container = deep ? HeroCard : Card;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${description}`}
      accessibilityHint={linkLabel}
      style={({ pressed }) => ({ opacity: pressed ? 0.92 : 1 })}
    >
      <Container style={styles.card}>
        <View style={styles.cardTop}>
          <Icon size={26} color={deep ? colors.primaryTint : colors.primary} strokeWidth={1.8} />
          <View
            style={[
              styles.pill,
              { backgroundColor: deep ? colors.primarySoft : colors.surfaceMuted },
            ]}
          >
            <Text variant="microStrong" tone={deep ? 'primary' : 'textSecondary'}>
              {badge}
            </Text>
          </View>
        </View>
        <Text variant="metric" tone={deep ? 'onPrimary' : 'text'}>
          {title}
        </Text>
        <Text variant="body" tone={deep ? 'onPrimaryMuted' : 'textSecondary'}>
          {description}
        </Text>
        <View style={styles.link}>
          <Text variant="bodyStrong" tone={deep ? 'onPrimary' : 'primary'}>
            {linkLabel}
          </Text>
          <ArrowUpRight size={18} color={deep ? colors.onPrimary : colors.primary} />
        </View>
      </Container>
    </Pressable>
  );
};

/** Ligne « mon entreprise » dans la liste des travaux (affichée une fois l'entreprise configurée). */
const BusinessRow: React.FC<{ onPress: () => void }> = ({ onPress }) => {
  const colors = useColors();
  const { business, month, summary } = usePeriodData();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${business.name}, suivi réel, ${formatMonthLabel(month)}`}
      style={styles.row}
    >
      <FolderOpen size={20} color={colors.primary} />
      <View style={styles.rowBody}>
        <Text variant="bodyStrong">{business.name}</Text>
        <Text variant="caption" tone="textSecondary">
          {`Suivi réel · ${formatMonthLabel(month)}`}
        </Text>
        <Badge label={countLabel(summary.operationCount, 'opération')} tone="brand" />
      </View>
      <ChevronRight size={18} color={colors.textSecondary} />
    </Pressable>
  );
};

export const WorkspaceScreen: React.FC<TabScreenProps<'Home'>> = ({ navigation }) => {
  const { firstName } = useCurrentUser();
  const isConfigured = useBusinessStore((state) => state.business !== null);

  return (
    <Screen>
      <PageIntro
        eyebrow={firstName ? `Bienvenue, ${firstName}` : 'Bienvenue'}
        title="Que souhaitez-vous faire ?"
        subtitle="Un espace pour vos idées, un autre pour votre activité au quotidien."
      />

      <WorkspaceCard
        tone="deep"
        icon={ChartNoAxesCombined}
        badge="Prévisionnel"
        title="Évaluer un projet"
        description="Estimez vos revenus, vos coûts et la viabilité de votre idée avant de vous lancer."
        linkLabel="Créer un prévisionnel"
        onPress={() => navigation.navigate('Projects')}
      />

      <WorkspaceCard
        tone="light"
        icon={BriefcaseBusiness}
        badge="Réel"
        title="Gérer mon entreprise"
        description="Suivez vos recettes, vos dépenses et votre budget mensuel, sans jargon."
        linkLabel={isConfigured ? 'Ouvrir mon tableau de bord' : 'Configurer une entreprise'}
        onPress={() => navigation.navigate('Business')}
      />

      <SectionTitle title="Retrouver mon travail" />
      <Card>
        {isConfigured ? (
          <BusinessRow onPress={() => navigation.navigate('Business')} />
        ) : (
          <Text variant="body" tone="textSecondary">
            Vos projets et votre entreprise apparaîtront ici dès que vous les aurez créés.
          </Text>
        )}
      </Card>
    </Screen>
  );
};

const styles = StyleSheet.create({
  card: {
    gap: 10,
    padding: 22,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowBody: {
    flex: 1,
    gap: 4,
  },
});
