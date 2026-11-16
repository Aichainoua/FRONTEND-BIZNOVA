import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { AppHeader, Banner, Button, Eyebrow, LinkButton, Screen, Subtitle, TextField, Title } from '../../../components/kit';
import type { AuthStackParamList } from '../../../navigation/routes';
import { spacing } from '../../../theme/tokens';
import { getErrorMessage } from '../../../utils/errors';
import { authApi } from '../api';
import { forgotPasswordSchema, type ForgotPasswordValues } from '../schemas';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

// Écran provisoire : la maquette « mot de passe oublié » n'existe pas encore (voir README).
export function ForgotPasswordScreen({ navigation }: Props) {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({ resolver: zodResolver(forgotPasswordSchema), defaultValues: { email: '' }, mode: 'onTouched' });

  const onSubmit = handleSubmit(async ({ email }) => {
    setServerError(null);
    try {
      await authApi.forgotPassword(email.trim().toLowerCase());
      setSent(true);
    } catch (error) {
      setServerError(getErrorMessage(error));
    }
  });

  return (
    <Screen edges={['top', 'bottom', 'left', 'right']}>
      <AppHeader />
      <View style={styles.intro}>
        <Eyebrow>Votre espace financier</Eyebrow>
        <Title>Mot de passe oublié ?</Title>
        <Subtitle>Saisissez l’adresse email de votre compte. Nous vous envoyons un lien pour choisir un nouveau mot de passe.</Subtitle>
      </View>
      <Controller
        control={control}
        name="email"
        render={({ field: { value, onChange, onBlur } }) => (
          <TextField label="Adresse email" required value={value} onChangeText={onChange} onBlur={onBlur} placeholder="vous@email.com" keyboardType="email-address" autoCapitalize="none" autoComplete="email" autoCorrect={false} error={errors.email?.message} />
        )}
      />
      {sent ? <Banner variant="success">Si un compte existe avec cette adresse, un lien de réinitialisation vient d’être envoyé.</Banner> : null}
      {serverError ? <Banner variant="danger">{serverError}</Banner> : null}
      <Button title="Envoyer le lien" onPress={onSubmit} loading={isSubmitting} />
      <View style={styles.back}>
        <LinkButton label="Retour à la connexion" onPress={() => navigation.navigate('Login')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { gap: spacing.sm },
  back: { alignItems: 'center' },
});
