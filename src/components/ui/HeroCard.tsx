import React from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';
import { useColors } from '../../theme';
import { radius } from '../../theme/spacing';

export interface HeroCardProps extends ViewProps {
  /** `deep` : indicateur clé (vert profond). `danger` : dépassement. */
  tone?: 'deep' | 'danger';
  children: React.ReactNode;
}

/** Bandeau « héros » : l'indicateur principal de l'écran, lisible en un coup d'œil. */
export const HeroCard: React.FC<HeroCardProps> = ({ tone = 'deep', style, children, ...props }) => {
  const colors = useColors();
  const danger = tone === 'danger';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: danger ? colors.dangerSoft : colors.primaryDeep,
          borderColor: danger ? colors.danger : colors.primaryDeep,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xxl,
    borderWidth: 1,
    padding: 22,
    gap: 10,
  },
});
