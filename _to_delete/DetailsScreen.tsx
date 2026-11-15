import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowLeft, CheckCircle2 } from 'lucide-react-native';
import { useThemeStore } from '../stores/themeStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { spacing, typography } from '../theme/spacing';

export const DetailsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors } = useThemeStore();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Détails &amp; Configuration</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.content}>
        <Card style={styles.card}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Prêt pour GitHub &amp; Déploiement</Text>
          <Text style={[styles.cardText, { color: colors.textSecondary }]}>
            Ce template est structuré pour permettre une prise en main rapide sur n'importe quel nouveau projet.
          </Text>

          <View style={styles.list}>
            <View style={styles.listItem}>
              <CheckCircle2 size={16} color={colors.primary} />
              <Text style={[styles.listText, { color: colors.text }]}>
                Personnalisation du nom d'application et package Android dans app.json
              </Text>
            </View>
            <View style={styles.listItem}>
              <CheckCircle2 size={16} color={colors.primary} />
              <Text style={[styles.listText, { color: colors.text }]}>
                Builds locaux avec npx expo prebuild et ./gradlew assembleRelease
              </Text>
            </View>
            <View style={styles.listItem}>
              <CheckCircle2 size={16} color={colors.primary} />
              <Text style={[styles.listText, { color: colors.text }]}>
                Compatibilité vérifiée Android 7.0 (API 24)
              </Text>
            </View>
          </View>

          <Button
            title="Retour à l'accueil"
            variant="outline"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
        </Card>
      </View>
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
  backBtn: {
    padding: spacing.xs,
  },
  title: {
    fontSize: typography.fontSize.md,
    fontWeight: '700',
  },
  content: {
    padding: spacing.md,
  },
  card: {
    padding: spacing.lg,
  },
  cardTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  cardText: {
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.md,
  },
  list: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  listText: {
    fontSize: typography.fontSize.xs,
    fontWeight: '500',
    flex: 1,
  },
  backButton: {
    marginTop: spacing.sm,
  },
});
