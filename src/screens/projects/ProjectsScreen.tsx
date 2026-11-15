import React from 'react';
import { ChartNoAxesCombined } from 'lucide-react-native';
import { PageIntro } from '../../components/layout/PageIntro';
import { Screen } from '../../components/layout/Screen';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Text } from '../../components/ui/Text';
import type { TabScreenProps } from '../../navigation/types';
import { useColors } from '../../theme';

/**
 * Onglet « Projets » : point d'entrée du parcours A (analyse financière prévisionnelle).
 * Écran d'attente — le parcours A n'est pas encore conçu côté maquette.
 */
export const ProjectsScreen: React.FC<TabScreenProps<'Projects'>> = ({ navigation }) => {
  const colors = useColors();

  return (
    <Screen>
      <PageIntro
        eyebrow="Parcours A · Prévisionnel"
        title="Évaluer un projet."
        subtitle="Estimez la rentabilité d’une idée avant d’investir."
      />
      <Card>
        <ChartNoAxesCombined size={26} color={colors.primary} strokeWidth={1.8} />
        <Text variant="heading">Cette partie arrive bientôt</Text>
        <Text variant="body" tone="textSecondary">
          La saisie des hypothèses, le seuil de rentabilité et le rapport prévisionnel seront
          disponibles dans une prochaine version. En attendant, vous pouvez suivre votre entreprise
          au quotidien.
        </Text>
      </Card>
      <Button title="Aller à mon entreprise" variant="outline" onPress={() => navigation.navigate('Business')} />
    </Screen>
  );
};
