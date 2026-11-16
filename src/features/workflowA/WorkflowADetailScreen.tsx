import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, Download, Printer, Search, Share2 } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { ProjectsStackParamList } from '../../navigation/routes';

type Props = NativeStackScreenProps<ProjectsStackParamList, 'WorkflowADetail'>;

const metricCards = [
  { label: 'Budget', value: '89,5K', tone: '#E8F7EF' },
  { label: 'Risque', value: 'Faible', tone: '#EAF2FF' },
  { label: 'Livraison', value: 'Q3', tone: '#FFF4E5' },
];

const detailRows = [
  { label: 'Client', value: 'Akila Holdings' },
  { label: 'Produit', value: 'Module de prévision' },
  { label: 'Phase', value: 'Validation commerciale' },
  { label: 'État', value: 'En review' },
];

export function WorkflowADetailScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <View style={styles.toolbarLeft}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
            <ArrowLeft size={20} color="#F4F4F4" />
          </TouchableOpacity>
          <Text style={styles.title}>Détail</Text>
        </View>

        <View style={styles.toolbarRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Search size={18} color="#E7E7E7" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Download size={18} color="#E7E7E7" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Printer size={18} color="#E7E7E7" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Share2 size={18} color="#E7E7E7" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View>
              <Text style={styles.eyebrow}>Projet</Text>
              <Text style={styles.projectName}>Biznova F1</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>À valider</Text>
            </View>
          </View>

          <Text style={styles.summaryText}>
            Présentation du parcours utilisateur et du cadre financier de la première version de la maquette.
          </Text>

          <View style={styles.metricsRow}>
            {metricCards.map((item) => (
              <View key={item.label} style={[styles.metricCard, { backgroundColor: item.tone }]}>
                <Text style={styles.metricLabel}>{item.label}</Text>
                <Text style={styles.metricValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Informations</Text>
          {detailRows.map((row) => (
            <View key={row.label} style={styles.row}>
              <Text style={styles.rowLabel}>{row.label}</Text>
              <Text style={styles.rowValue}>{row.value}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F4F3',
  },
  toolbar: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    backgroundColor: '#3A3D40',
    borderBottomWidth: 1,
    borderBottomColor: '#2D2F33',
  },
  toolbarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toolbarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: '#F4F4F4',
    fontSize: 18,
    fontWeight: '700',
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 18,
    gap: 18,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#DCE6DF',
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    color: '#0E5C45',
  },
  projectName: {
    marginTop: 4,
    fontSize: 26,
    fontWeight: '800',
    color: '#14261E',
  },
  badge: {
    backgroundColor: '#EAF7EE',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    color: '#0E5C45',
    fontSize: 12,
    fontWeight: '700',
  },
  summaryText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#52645A',
    marginBottom: 16,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  metricCard: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  metricLabel: {
    fontSize: 11,
    color: '#4F5C57',
    marginBottom: 8,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#14261E',
  },
  panel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#DCE6DF',
    padding: 18,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#14261E',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF3F0',
  },
  rowLabel: {
    fontSize: 14,
    color: '#52645A',
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#14261E',
    textAlign: 'right',
    flexShrink: 1,
    marginLeft: 12,
  },
});
