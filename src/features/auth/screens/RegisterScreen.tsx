import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import { AppHeader, Banner, Button, Checkbox, Eyebrow, Helper, LinkText, Screen, Subtitle, TextField, Title } from '../../../components/kit';
import type { AuthStackParamList } from '../../../navigation/routes';
import { useAuthStore } from '../../../stores/authStore';
import { spacing, typography } from '../../../theme/tokens';
import { getErrorMessage, getStatus } from '../../../utils/errors';
import { openLegal } from '../../../utils/legal';
import { registerSchema, type RegisterValues } from '../schemas';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const signUp = useAuthStore((s) => s.signUp);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '', acceptedTerms: false },
    mode: 'onTouched',
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      await signUp({ fullName: values.fullName.trim(), email: values.email.trim().toLowerCase(), password: values.password, acceptedTerms: values.acceptedTerms });
      // Succès : le store passe à « signedIn » et la navigation bascule vers l'application.
    } catch (error) {
      if (getStatus(error) === 409) {
        setError('email', { message: 'Un compte existe déjà avec cette adresse email. Connectez-vous.' });
      } else {
        setServerError(getErrorMessage(error));
      }
    }
  });

  return (
    <Screen edges={['top', 'bottom', 'left', 'right']}>
      <AppHeader />
      <View style={styles.intro}>
        <Eyebrow>Créer votre espace</Eyebrow>
        <Title>Bienvenue sur BizNova.</Title>
        <Subtitle>Créez votre compte pour évaluer un projet, suivre votre entreprise et garder le cap, en FCFA.</Subtitle>
      </View>

      <Controller
        control={control}
        name="fullName"
        render={({ field: { value, onChange, onBlur } }) => (
          <TextField label="Nom complet" required value={value} onChangeText={onChange} onBlur={onBlur} placeholder="Amina Diop" autoCapitalize="words" autoComplete="name" error={errors.fullName?.message} />
        )}
      />
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
            placeholder="amina.diop@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
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
            placeholder="8 caractères minimum"
            autoCapitalize="none"
            autoComplete="new-password"
            error={errors.password?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { value, onChange, onBlur } }) => (
          <TextField
            label="Confirmer le mot de passe"
            required
            secure
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder="Saisissez-le à nouveau"
            autoCapitalize="none"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
          />
        )}
      />
      <Helper>Utilisez au moins 8 caractères, avec une lettre et un chiffre.</Helper>

      <Controller
        control={control}
        name="acceptedTerms"
        render={({ field: { value, onChange } }) => (
          <Checkbox checked={value} onChange={onChange} error={errors.acceptedTerms?.message}>
            J’accepte les <LinkText onPress={() => openLegal('terms')}>conditions d’utilisation</LinkText> et la{' '}
            <LinkText onPress={() => openLegal('privacy')}>politique de confidentialité</LinkText>.
          </Checkbox>
        )}
      />

      {serverError ? <Banner variant="danger">{serverError}</Banner> : null}
      <Button title="Créer mon compte" onPress={onSubmit} loading={isSubmitting} />
      <Helper style={styles.center}>Vos données restent privées et accessibles uniquement dans votre espace.</Helper>
      <Text style={[typography.body, styles.center]}>
        Vous avez déjà un compte ? <LinkText onPress={() => navigation.navigate('Login')}>Se connecter</LinkText>
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { gap: spacing.sm },
  center: { textAlign: 'center' },
});
