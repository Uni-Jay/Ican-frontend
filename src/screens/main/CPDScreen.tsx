import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';

// Import community progress bars as default imports
import ProgressBarAndroid from '@react-native-community/progress-bar-android';
import ProgressView from '@react-native-community/progress-view';
import { MainDrawerParamList } from '../../navigations/MainNavigator';
import { DrawerScreenProps } from '@react-navigation/drawer';
import * as Progress from 'react-native-progress';

const { width } = Dimensions.get('window');

interface CPDModule {
  id: number;
  title: string;
  duration: string;
  progress: number;
  completed: boolean;
  description: string;
  points: number;
}

const mockUser = {
  cpdPoints: 120,
  requiredPoints: 40,
};

const mockCPDModules: CPDModule[] = [
  {
    id: 1,
    title: 'Ethics in Accounting',
    duration: '2 hours',
    progress: 75,
    completed: false,
    description: 'Learn about professional ethics and standards in accounting practice.',
    points: 20,
  },
  {
    id: 2,
    title: 'Tax Updates 2024',
    duration: '3 hours',
    progress: 100,
    completed: true,
    description: 'Stay updated with the latest tax regulations and changes for 2024.',
    points: 30,
  },
  {
    id: 3,
    title: 'Digital Financial Reporting',
    duration: '1.5 hours',
    progress: 30,
    completed: false,
    description: 'Master digital tools and software for modern financial reporting.',
    points: 15,
  },
  {
    id: 4,
    title: 'Risk Management',
    duration: '2.5 hours',
    progress: 0,
    completed: false,
    description: 'Understanding and implementing risk management strategies.',
    points: 25,
  },
];

interface ProgressBarProps {
  progress: number; // 0 to 100
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const normalizedProgress = progress / 100;

  if (Platform.OS === 'ios') {
    return (
      <Progress.Bar
      progress={normalizedProgress}
      width={null}
      color="#3182ce"
      unfilledColor="#e2e8f0"
      borderWidth={0}
      height={10}
      borderRadius={5}
      indeterminate={true}
      style={styles.progressBar}
    />
    );
  } else {
    return (
      <Progress.Bar
      progress={normalizedProgress}
      width={null}
      color="#3182ce"
      unfilledColor="#e2e8f0"
      borderWidth={0}
      height={10}
      borderRadius={5}
      indeterminate={false}
      style={styles.progressBar}
    />
    );
  }
};

type Props = DrawerScreenProps<MainDrawerParamList, 'cpd'> & {
  onLogout: () => void;};

const CPDScreen: React.FC<Props> = ({ navigation, route, onLogout }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedModule, setSelectedModule] = useState<CPDModule | null>(null);

  const openModuleDetails = (module: CPDModule) => {
    setSelectedModule(module);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedModule(null);
  };

  const startModule = (moduleId?: number) => {
    if (!selectedModule) return;
    Alert.alert('Starting Module', `Starting module: ${selectedModule.title}`);
    closeModal();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* <Header title="CPD Modules" showBack onBack={() => navigation.navigate('dashboard')} /> */}

        <View style={styles.cpdStats}>
          <View style={styles.cpdStatCard}>
            <Text style={styles.cpdStatNumber}>{mockUser.cpdPoints}</Text>
            <Text style={styles.cpdStatLabel}>Points Earned</Text>
          </View>
          <View style={styles.cpdStatCard}>
            <Text style={styles.cpdStatNumber}>{mockUser.requiredPoints}</Text>
            <Text style={styles.cpdStatLabel}>Required Points</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Modules</Text>
          {mockCPDModules.map((module) => (
            <TouchableOpacity
              key={module.id}
              style={styles.moduleCard}
              onPress={() => openModuleDetails(module)}
            >
              <View style={styles.moduleHeader}>
                <Text style={styles.moduleTitle}>{module.title}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    module.completed && styles.completedBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      module.completed && styles.completedText,
                    ]}
                  >
                    {module.completed ? 'Completed' : 'In Progress'}
                  </Text>
                </View>
              </View>
              <Text style={styles.moduleDuration}>
                {module.duration} • {module.points} CPD Points
              </Text>
              <Text style={styles.moduleDescription}>{module.description}</Text>
              <View style={styles.progressContainer}>
                <ProgressBar progress={module.progress} />
                <Text style={styles.progressText}>{module.progress}%</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Module Details Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedModule?.title ?? ''}</Text>
                <TouchableOpacity onPress={closeModal}>
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                <Text style={styles.modalDescription}>{selectedModule?.description ?? ''}</Text>

                <View style={styles.moduleDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons name="time" size={20} color="#666" />
                    <Text style={styles.detailText}>Duration: {selectedModule?.duration ?? ''}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="trophy" size={20} color="#666" />
                    <Text style={styles.detailText}>CPD Points: {selectedModule?.points ?? 0}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="checkmark-circle" size={20} color="#666" />
                    <Text style={styles.detailText}>Progress: {selectedModule?.progress ?? 0}%</Text>
                  </View>
                </View>

                <View style={styles.progressContainer}>
                  <ProgressBar progress={selectedModule?.progress ?? 0} />
                </View>
              </ScrollView>

              <View style={styles.modalFooter}>
                {selectedModule?.completed ? (
                  <TouchableOpacity style={styles.completedButton} disabled>
                    <Ionicons name="checkmark-circle" size={20} color="white" />
                    <Text style={styles.completedButtonText}>Completed</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.startButton}
                    onPress={() => startModule(selectedModule?.id)}
                  >
                    <Text style={styles.startButtonText}>
                      {(selectedModule?.progress ?? 0) > 0 ? 'Continue Module' : 'Start Module'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7fafc',
  },
  container: {
    flex: 1,
    backgroundColor: '#f7fafc',
  },
  cpdStats: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  cpdStatCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cpdStatNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3182ce',
  },
  cpdStatLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: 15,
  },
  moduleCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  moduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a202c',
    flex: 1,
  },
  statusBadge: {
    backgroundColor: '#fed7d7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedBadge: {
    backgroundColor: '#c6f6d5',
  },
  statusText: {
    fontSize: 12,
    color: '#c53030',
    fontWeight: '600',
  },
  completedText: {
    color: '#2f855a',
  },
  moduleDuration: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  moduleDescription: {
    fontSize: 14,
    color: '#4a5568',
    lineHeight: 20,
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressBar: {
    flex: 1,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a202c',
    flex: 1,
  },
  modalBody: {
    padding: 20,
  },
  modalDescription: {
    fontSize: 16,
    color: '#4a5568',
    lineHeight: 24,
    marginBottom: 20,
  },
  moduleDetails: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: '#4a5568',
    marginLeft: 10,
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  startButton: {
    backgroundColor: '#3182ce',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  completedButton: {
    backgroundColor: '#38a169',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  completedButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CPDScreen;
