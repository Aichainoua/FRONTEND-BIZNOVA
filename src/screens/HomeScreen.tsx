import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Layers, Smartphone, ShieldCheck, ArrowRight, Palette } from 'lucide-react-native';
import { useThemeStore } from '../stores/themeStore';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { spacing, typography } from '../theme/spacing';

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors } = useThemeStore();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.brandTitle, { color: colors.text }]}>Expo Starter Template</Text>
          <Text style={[styles.subTitle, { color: colors.textSecondary }]}>
            React Native • TypeScript • Zustand
          </Text>
        </View>
        <ThemeToggle />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Card */}
        <Card style={styles.welcomeCard}>
          <View style={styles.badgeRow}>
            <Badge label="Production Ready" variant="success" />
            <Badge label="Android 7+ (API 24)" variant="info" />
          </View>
          <Text style={[styles.welcomeTitle, { color: colors.text }]}>
            Template React Native Universel
          </Text>
          <Text style={[styles.welcomeDesc, { color: colors.textSecondary }]}>
            Architecture modulaire, gestion de thèmes (Clair / Sombre), icônes vectorielles Lucide,
            navigation préconfigurée et scripts de build APK locaux et cloud.
          </Text>
        </Card>

        {/* Features List */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Fonctionnalités Incluses</Text>

        <View style={styles.featuresList}>
          <Card style={styles.featureItem}>
            <View style={styles.featureHeader}>
              <Palette size={20} color={colors.primary} />
              <Text style={[styles.featureTitle, { color: colors.text }]}>Thème Clair &amp; Sombre</Text>
            </View>
            <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>
              Mode clair lumineux par défaut avec switch instantané et persistance de l'état.
            </Text>
          </Card>

          <Card style={styles.featureItem}>
            <View style={styles.featureHeader}>
              <Smartphone size={20} color={colors.accent} />
              <Text style={[styles.featureTitle, { color: colors.text }]}>
                Compatibilité Android Garantie
              </Text>
            </View>
            <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>
              Configuré pour supporter Android 7.0+ (minSdkVersion 24) sans erreurs de build Gradle.
            </Text>
          </Card>

          <Card style={styles.featureItem}>
            <View style={styles.featureHeader}>
              <Layers size={20} color={colors.primary} />
              <Text style={[styles.featureTitle, { color: colors.text }]}>
                Icônes Lucide Vectorielles
              </Text>
            </View>
            <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>
              100% sans emoji, rendu vectoriel ultra-net sur tous les écrans iOS &amp; Android.
            </Text>
          </Card>
        </View>

        <Button
          title="Voir les détails de navigation"
          size="lg"
          onPress={() => navigation.navigate('Details')}
          style={styles.actionBtn}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  brandTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: '800',
  },
  subTitle: {
    fontSize: typography.fontSize.xs,
    fontWeight: '500',
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  welcomeCard: {
    marginBottom: spacing.lg,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  welcomeTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  welcomeDesc: {
    fontSize: typography.fontSize.sm,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  featuresList: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  featureItem: {
    padding: spacing.md,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  featureTitle: {
    fontSize: typography.fontSize.sm + 1,
    fontWeight: '700',
  },
  featureDesc: {
    fontSize: typography.fontSize.xs,
    lineHeight: 18,
  },
  actionBtn: {
    marginTop: spacing.sm,
  },
});
