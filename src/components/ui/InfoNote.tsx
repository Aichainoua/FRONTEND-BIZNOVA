import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Info } from 'lucide-react-native';
import { useColors } from '../../theme';
import { radius } from '../../theme/spacing';
import { Text } from './Text';

export interface InfoNoteProps {
  title?: string;
  children: string;
}

/** Encart pédagogique : explique un indicateur ou une règle en langage simple. */
export const InfoNote: React.FC<InfoNoteProps> = ({ title, children }) => {
  const colors = useColors();

  return (
    <View style={[styles.note, { backgroundColor: colors.surfaceMuted }]}>
      <Info size={16} color={colors.textSecondary} style={styles.icon} />
      <View style={styles.text}>
        {title ? <Text variant="label">{title}</Text> : null}
        <Text variant="caption" tone="textSecondary">
          {children}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  note: {
    flexDirection: 'row',
    gap: 10,
    padding: 16,
    borderRadius: radius.xl,
  },
  icon: {
    marginTop: 1,
  },
  text: {
    flex: 1,
    gap: 4,
  },
});
