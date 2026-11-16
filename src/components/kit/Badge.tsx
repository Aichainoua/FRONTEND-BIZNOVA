import { StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../../theme/tokens';

interface Props {
  label: string;
  tone?: 'neutral' | 'green' | 'amber' | 'onDark';
}

export function Badge({ label, tone = 'neutral' }: Props) {
  return (
    <View style={[styles.box, TONES[tone].box]}>
      <Text style={[styles.text, TONES[tone].text]}>{label}</Text>
    </View>
  );
}

const TONES = {
  neutral: { box: { backgroundColor: colors.surface, borderColor: colors.border }, text: { color: colors.textMuted } },
  green: { box: { backgroundColor: colors.primarySoft, borderColor: colors.infoBorder }, text: { color: colors.primary } },
  amber: { box: { backgroundColor: colors.warningBg, borderColor: colors.warningBorder }, text: { color: colors.warningText } },
  onDark: { box: { backgroundColor: 'rgba(255,255,255,0.14)', borderColor: 'rgba(255,255,255,0.25)' }, text: { color: colors.textOnPrimary } },
} as const;

const styles = StyleSheet.create({
  box: { alignSelf: 'flex-start', borderRadius: radius.pill, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 4 },
  text: { fontSize: 12, fontWeight: '700' },
});
