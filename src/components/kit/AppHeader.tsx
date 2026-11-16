import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../../theme/tokens';

interface Props {
  /** Initiales affichées dans la pastille (ex. "AD"). Absente = pas de pastille. */
  initials?: string;
  onAvatarPress?: () => void;
}

export function AppHeader({ initials, onAvatarPress }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.brand}>
        <View style={styles.logo}>
          <Text style={styles.logoLetter}>b</Text>
        </View>
        <Text style={styles.wordmark}>biznova</Text>
      </View>
      {initials ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Mon compte" onPress={onAvatarPress} style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  logo: { width: 30, height: 30, borderRadius: 8, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  logoLetter: { color: colors.textOnPrimary, fontWeight: '800', fontSize: 18, marginTop: -1 },
  wordmark: { fontSize: 20, fontWeight: '800', color: colors.text },
  avatar: { width: 34, height: 34, borderRadius: radius.pill, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.primaryBorder },
  avatarText: { fontSize: 12, fontWeight: '800', color: colors.primary },
});
