import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import { AppHeader, Banner, Button, Card, Eyebrow, Helper, LinkButton, LinkText, Screen, Subtitle, TextField, Title } from '../../../components/kit';
import type { AuthStackParamList } from '../../../navigation/routes';
import { useAuthStore } from '../../../stores/authStore';
import { colors, spacing, typography } from '../../../theme/tokens';
import { getErrorMessage, getStatus } from '../../../utils/errors';
import { openLegal } from '../../../utils/legal';
import { isEmail } from '../../../utils/validation';
import { loginSchema, type LoginValues } from '../schemas';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const signIn = useAuthStore((s) => s.signIn);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema), defaultValues: { email: '', password: '' }, mode: 'onTouched' });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      await signIn({ email: values.email.trim().toLowerCase(), password: values.password });
    } catch (error) {
      setServerError(getStatus(error) === 401 ? 'Adresse email ou mot de passe incorrect.' : getErrorMessage(error));
    }
  });

  return (
    <Screen edges={['top', 'bottom', 'left', 'right']}>
      <AppHeader />
      <View style={styles.intro}>
        <Eyebrow>Votre espace financier</Eyebrow>
        <Title>Heureux de vous retrouver.</Title>
        <Subtitle>Connectez-vous pour reprendre vos projets et garder le cap sur votre activité.</Subtitle>
      </View>

      <Card tone="dark">
        <Text style={styles.heroTitle}>Vos chiffres, simplement.</Text>
        <Text style={styles.heroText}>Anticipez un projet. Suivez votre entreprise. Avancez avec des repères clairs.</Text>
      </Card>

      <Controller
        control={control}
        name="email"
        render={({ field: { value, onChange, onBlur } }) => (
          <TextField
            label="Adresse email"
            required
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder="vous@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            valid={isEmail(watch('email'))}
            error={errors.email?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field: { value, onChange, onBlur } }) => (
          <TextField
            label="Mot de passe"
            required
            secure
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            autoCapitalize="none"
            autoComplete="current-password"
            returnKeyType="go"
            onSubmitEditing={() => void onSubmit()}
            error={errors.password?.message}
          />
        )}
      />
      <View style={styles.forgot}>
        <LinkButton label="Mot de passe oublié ?" onPress={() => navigation.navigate('ForgotPassword')} />
      </View>

      {serverError ? <Banner variant="danger">{serverError}</Banner> : null}
      <Button title="Se connecter" onPress={onSubmit} loading={isSubmitting} />
      <Helper style={styles.center}>Vos données restent privées et accessibles uniquement dans votre espace.</Helper>

      <Text style={[typography.body, styles.center]}>
        Vous découvrez BizNova ? <LinkText onPress={() => navigation.navigate('Register')}>Créer un compte</LinkText>
      </Text>
      <Helper style={styles.center}>
        En continuant, vous acceptez les <LinkText onPress={() => openLegal('terms')}>conditions d’utilisation</LinkText> et la{' '}
        <LinkText onPress={() => openLegal('privacy')}>politique de confidentialité</LinkText>.
      </Helper>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { gap: spacing.sm },
  heroTitle: { fontSize: 20, fontWeight: '800', color: colors.textOnPrimary },
  heroText: { fontSize: 14.5, lineHeight: 21, color: colors.textOnPrimaryMuted },
  forgot: { alignItems: 'flex-end', marginTop: -spacing.sm },
  center: { textAlign: 'center' },
});
