import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { ArrowRight, Check, ChartNoAxesCombined, Eye, EyeOff, ShieldCheck } from 'lucide-react-native';
import { Screen } from '../../components/layout/Screen';
import { Button } from '../../components/ui/Button';
import { HeroCard } from '../../components/ui/HeroCard';
import { InfoNote } from '../../components/ui/InfoNote';
import { Input } from '../../components/ui/Input';
import { Text } from '../../components/ui/Text';
import { useSessionStore } from '../../stores/sessionStore';
import { useColors } from '../../theme';
import { radius } from '../../theme/spacing';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const comingSoon = (feature: string) =>
  Alert.alert('Bientôt disponible', `${feature} sera disponible dans une prochaine version.`);

export const LoginScreen: React.FC = () => {
  const colors = useColors();
  const signIn = useSessionStore((state) => state.signIn);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const emailValid = EMAIL_PATTERN.test(email.trim());
  const emailError = submitted && !emailValid ? 'Saisissez une adresse e-mail valide.' : undefined;
  const passwordError =
    submitted && password.length === 0 ? 'Saisissez votre mot de passe.' : undefined;

  const handleSubmit = () => {
    setSubmitted(true);
    if (emailValid && password.length > 0) signIn(email.trim());
  };

  return (
    <Screen hideHeader>
      <View style={styles.topBar}>
        <Text variant="brand" tone="primary" accessibilityRole="header">
          biznova
        </Text>
        <ShieldCheck size={22} color={colors.primary} accessibilityLabel="Connexion sécurisée" />
      </View>

      <View style={styles.intro}>
        <Text variant="eyebrow" tone="primary">
          Votre espace financier
        </Text>
        <Text variant="title">Heureux de vous retrouver.</Text>
        <Text variant="lead" tone="textSecondary">
          Connectez-vous pour reprendre vos projets et garder le cap sur votre activité.
        </Text>
      </View>

      <HeroCard style={styles.hero}>
        <View style={[styles.heroIcon, { backgroundColor: colors.primary }]}>
          <ChartNoAxesCombined size={22} color={colors.primaryTint} />
        </View>
        <Text variant="metric" tone="onPrimary">
          Vos chiffres, simplement.
        </Text>
        <Text variant="body" tone="onPrimaryMuted">
          Anticipez un projet. Suivez votre entreprise. Avancez avec des repères clairs.
        </Text>
      </HeroCard>

      <View style={styles.form}>
        <Input
          label="Adresse e-mail"
          required
          value={email}
          onChangeText={setEmail}
          placeholder="prenom.nom@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="next"
          error={emailError}
          trailing={emailValid ? <Check size={16} color={colors.primary} /> : undefined}
        />
        <Input
          label="Mot de passe"
          required
          value={password}
          onChangeText={setPassword}
          placeholder="Votre mot de passe"
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="password"
          textContentType="password"
          returnKeyType="go"
          onSubmitEditing={handleSubmit}
          error={passwordError}
          trailing={
            <Pressable
              onPress={() => setShowPassword((visible) => !visible)}
              accessibilityRole="button"
              accessibilityLabel={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              hitSlop={12}
            >
              {showPassword ? (
                <EyeOff size={18} color={colors.textSecondary} />
              ) : (
                <Eye size={18} color={colors.textSecondary} />
              )}
            </Pressable>
          }
        />
        <Pressable
          onPress={() => comingSoon('La réinitialisation du mot de passe')}
          accessibilityRole="link"
          hitSlop={10}
          style={styles.forgot}
        >
          <Text variant="captionStrong" tone="primary">
            Mot de passe oublié ?
          </Text>
        </Pressable>
      </View>

      <Button title="Se connecter" icon={ArrowRight} onPress={handleSubmit} />

      <InfoNote>Vos données restent privées et accessibles uniquement dans votre espace.</InfoNote>

      <View style={styles.footer}>
        <Text variant="caption" tone="textSecondary">
          {'Vous découvrez BizNova ? '}
          <Text
            variant="captionStrong"
            tone="primary"
            accessibilityRole="link"
            onPress={() => comingSoon('La création de compte')}
          >
            Créer un compte
          </Text>
        </Text>
        <Text variant="small" tone="textSecondary" style={styles.legal}>
          En continuant, vous acceptez les conditions d’utilisation et la politique de
          confidentialité.
        </Text>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  intro: {
    gap: 6,
  },
  hero: {
    gap: 12,
  },
  heroIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  form: {
    gap: 14,
  },
  forgot: {
    alignSelf: 'flex-end',
    minHeight: 24,
    justifyContent: 'center',
  },
  footer: {
    gap: 14,
    alignItems: 'center',
  },
  legal: {
    textAlign: 'left',
    alignSelf: 'stretch',
  },
});
