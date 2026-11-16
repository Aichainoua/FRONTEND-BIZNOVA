import { Check, Eye, EyeOff } from 'lucide-react-native';
import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme/tokens';

export interface TextFieldProps
  extends Pick<TextInputProps, 'placeholder' | 'keyboardType' | 'autoCapitalize' | 'autoComplete' | 'autoCorrect' | 'returnKeyType' | 'onSubmitEditing' | 'editable' | 'textContentType'> {
  label: string;
  required?: boolean;
  optional?: boolean;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  helper?: ReactNode;
  error?: string;
  secure?: boolean;
  /** Unité affichée à droite du champ (ex. "FCFA / mois"). */
  suffix?: string;
  /** Coche verte quand la valeur est valide (ex. email). */
  valid?: boolean;
}

export function TextField({ label, required, optional, value, onChangeText, onBlur, helper, error, secure, suffix, valid, ...inputProps }: TextFieldProps) {
  const [hidden, setHidden] = useState(Boolean(secure));
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrap}>
      <Text style={typography.label}>
        {label}
        {required ? ' *' : ''}
        {optional ? <Text style={styles.optional}>{'  facultatif'}</Text> : null}
      </Text>
      <View style={[styles.box, focused && styles.boxFocused, Boolean(error) && styles.boxError]}>
        <TextInput
          {...inputProps}
          accessibilityLabel={label}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            onBlur?.();
          }}
          secureTextEntry={hidden}
          placeholderTextColor={colors.placeholder}
          style={styles.input}
        />
        {suffix ? <Text style={styles.suffix}>{suffix}</Text> : null}
        {valid ? <Check size={18} color={colors.primary} strokeWidth={2.6} /> : null}
        {secure ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Afficher le mot de passe' : 'Masquer le mot de passe'}
            onPress={() => setHidden((h) => !h)}
            hitSlop={10}
          >
            {hidden ? <Eye size={20} color={colors.textMuted} /> : <EyeOff size={20} color={colors.textMuted} />}
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text accessibilityLiveRegion="polite" style={styles.error}>
          {error}
        </Text>
      ) : helper ? (
        <Text style={typography.helper}>{helper}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  optional: { fontWeight: '500', color: colors.textMuted, fontSize: 12.5 },
  box: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minHeight: 54, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: spacing.lg },
  boxFocused: { borderColor: colors.primary, borderWidth: 1.5 },
  boxError: { borderColor: colors.dangerText, backgroundColor: colors.dangerBg },
  input: { flex: 1, fontSize: 16, color: colors.text, paddingVertical: 12 },
  suffix: { fontSize: 13.5, fontWeight: '700', color: colors.textMuted },
  error: { fontSize: 12.5, lineHeight: 18, color: colors.dangerText, fontWeight: '600' },
});
