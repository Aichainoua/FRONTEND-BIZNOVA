import React from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';
import { useColors } from '../../theme';
import { layout, radius } from '../../theme/spacing';

export interface CardProps extends ViewProps {
  /** `muted` : encart discret sans bordure (informations complémentaires). */
  tone?: 'default' | 'muted';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ tone = 'default', style, children, ...props }) => {
  const colors = useColors();
  const muted = tone === 'muted';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: muted ? colors.surfaceMuted : colors.surface,
          borderColor: colors.border,
          borderWidth: muted ? 0 : 1,
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
    borderRadius: radius.xl,
    padding: layout.cardPadding,
    gap: 14,
  },
});
