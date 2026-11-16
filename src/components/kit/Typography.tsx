import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, type StyleProp, type TextStyle } from 'react-native';
import { colors, typography } from '../../theme/tokens';

type P = { children: ReactNode; style?: StyleProp<TextStyle> };

export const Eyebrow = ({ children, style }: P) => <Text style={[typography.eyebrow, style]}>{children}</Text>;
export const Title = ({ children, style }: P) => (
  <Text accessibilityRole="header" style={[typography.title, style]}>
    {children}
  </Text>
);
export const Subtitle = ({ children, style }: P) => <Text style={[typography.subtitle, style]}>{children}</Text>;
export const SectionTitle = ({ children, style }: P) => (
  <Text accessibilityRole="header" style={[typography.sectionTitle, style]}>
    {children}
  </Text>
);
export const Body = ({ children, style }: P) => <Text style={[typography.body, style]}>{children}</Text>;
export const Helper = ({ children, style }: P) => <Text style={[typography.helper, style]}>{children}</Text>;

/** Texte cliquable (liens « Créer un compte », « Tout voir », mentions légales...). */
export function LinkText({ children, onPress, style }: P & { onPress: () => void }) {
  return (
    <Text accessibilityRole="link" onPress={onPress} style={[styles.link, style]}>
      {children}
    </Text>
  );
}

export function LinkButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="link" onPress={onPress} hitSlop={8}>
      <Text style={styles.link}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  link: { color: colors.primary, fontWeight: '700', textDecorationLine: 'underline', fontSize: 13.5 },
});
