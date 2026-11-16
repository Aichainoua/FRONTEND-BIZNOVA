import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Download,
  Menu,
  Minus,
  MoreHorizontal,
  Plus,
  Printer,
  RotateCcw,
  RotateCw,
  Search,
} from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { ProjectsStackParamList } from '../../navigation/routes';

type Props = NativeStackScreenProps<ProjectsStackParamList, 'WorkflowA'>;

const leftGridRows = Array.from({ length: 8 });
const rightRows = Array.from({ length: 9 });

export function WorkflowAScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <View style={styles.toolbarLeft}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
            <Menu size={21} color="#F4F4F4" />
          </TouchableOpacity>

          <View style={styles.pageCounter}>
            <Text style={styles.pageIndex}>1</Text>
            <Text style={styles.pageSlash}> / </Text>
            <Text style={styles.pageIndex}>1</Text>
          </View>
        </View>

        <View style={styles.toolbarRight}>
          <View style={styles.zoomBox}>
            <TouchableOpacity style={styles.zoomButton}>
              <Minus size={18} color="#F4F4F4" />
            </TouchableOpacity>
            <Text style={styles.zoomText}>4%</Text>
            <TouchableOpacity style={styles.zoomButton}>
              <Plus size={18} color="#F4F4F4" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.iconButton}>
            <RotateCcw size={18} color="#E7E7E7" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <RotateCw size={18} color="#E7E7E7" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Search size={18} color="#E7E7E7" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Download size={18} color="#E7E7E7" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Printer size={18} color="#E7E7E7" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('WorkflowADetail')}>
            <MoreHorizontal size={18} color="#E7E7E7" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.leftPanel}>
          <View style={styles.blueCanvas}>
            <View style={styles.innerCanvas}>
              {leftGridRows.map((_, index) => (
                <View key={`left-row-${index}`} style={styles.rowLine}>
                  {Array.from({ length: 9 }).map((__, blockIndex) => (
                    <View
                      key={`left-cell-${index}-${blockIndex}`}
                      style={[
                        styles.gridCell,
                        {
                          opacity: blockIndex % 4 === 0 ? 0.45 : 0.25,
                          backgroundColor: blockIndex % 3 === 0 ? '#DDE8F0' : '#F4F4F4',
                        },
                      ]}
                    />
                  ))}
                </View>
              ))}
            </View>
          </View>
          <Text style={styles.pageNumber}>1</Text>
        </View>

        <View style={styles.rightPanel}>
          <View style={styles.rightCanvas}>
            {rightRows.map((_, rowIndex) => (
              <View key={`row-${rowIndex}`} style={styles.rightRow}>
                {Array.from({ length: 8 }).map((__, cellIndex) => (
                  <View
                    key={`cell-${rowIndex}-${cellIndex}`}
                    style={[
                      styles.rightCard,
                      {
                        backgroundColor: cellIndex % 3 === 0 ? '#EDF5F0' : '#F5F5F5',
                        borderColor: cellIndex % 2 === 0 ? '#D8D8D8' : '#E7E7E7',
                        opacity: rowIndex % 3 === 0 && cellIndex % 2 === 0 ? 0.75 : 1,
                      },
                    ]}
                  >
                    <View style={styles.rightCardContent} />
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3A3D41',
  },
  toolbar: {
    height: 62,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    backgroundColor: '#3B3D40',
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
    gap: 10,
  },
  iconButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  pageCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
  },
  pageIndex: {
    color: '#F4F4F4',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 28,
  },
  pageSlash: {
    color: '#BDBDBD',
    fontSize: 20,
    fontWeight: '600',
    marginHorizontal: 2,
  },
  zoomBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 8,
  },
  zoomButton: {
    width: 26,
    height: 26,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomText: {
    color: '#F4F4F4',
    fontSize: 16,
    fontWeight: '700',
    minWidth: 38,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 18,
  },
  leftPanel: {
    width: '42%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 8,
  },
  blueCanvas: {
    width: '92%',
    height: 220,
    backgroundColor: '#DDEEFF',
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#AFD8FF',
    padding: 8,
  },
  innerCanvas: {
    flex: 1,
    backgroundColor: '#EEF5FF',
    borderWidth: 1,
    borderColor: '#C9DFF5',
    padding: 6,
  },
  rowLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  gridCell: {
    flex: 1,
    height: 14,
    marginHorizontal: 1,
    borderRadius: 2,
  },
  pageNumber: {
    marginTop: 10,
    fontSize: 30,
    fontWeight: '700',
    color: '#EFEFEF',
  },
  rightPanel: {
    width: '58%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 12,
  },
  rightCanvas: {
    width: '96%',
    height: 266,
    backgroundColor: '#F2F2F2',
    borderWidth: 1,
    borderColor: '#DDDDD8',
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  rightRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 4,
    height: 19,
  },
  rightCard: {
    flex: 1,
    borderRadius: 2,
    borderWidth: 1,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  rightCardContent: {
    width: '55%',
    height: 6,
    backgroundColor: '#8EB7AB',
    borderRadius: 3,
    marginLeft: 5,
    opacity: 0.8,
  },
});
