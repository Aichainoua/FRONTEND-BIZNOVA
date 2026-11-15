import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '../ui/Text';

export interface PageIntroProps {
  /** Surtitre en capitales (ex. « PARCOURS B · NOVA STUDIO »). */
  eyebrow: string;
  title: string;
  subtitle?: string;
}

/** Bloc d'introduction d'un écran : contexte, titre éditorial, phrase d'explication. */
export const PageIntro: React.FC<PageIntroProps> = ({ eyebrow, title, subtitle }) => (
  <View style={styles.intro}>
    <Text variant="eyebrow" tone="primary">
      {eyebrow}
    </Text>
    <Text variant="title" accessibilityRole="header">
      {title}
    </Text>
    {subtitle ? (
      <Text variant="lead" tone="textSecondary">
        {subtitle}
      </Text>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  intro: {
    gap: 6,
  },
});
