import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from './Text';

export interface SectionTitleProps {
  title: string;
  /** Lien d'action à droite (ex. « Tout voir »). */
  actionLabel?: string;
  onActionPress?: () => void;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  actionLabel,
  onActionPress,
}) => (
  <View style={styles.row}>
    <Text variant="heading" accessibilityRole="header" style={styles.title}>
      {title}
    </Text>
    {actionLabel && onActionPress ? (
      <Pressable
        onPress={onActionPress}
        accessibilityRole="link"
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 4 }}
      >
        <Text variant="captionStrong" tone="primary">
          {actionLabel}
        </Text>
      </Pressable>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    flexShrink: 1,
  },
});
