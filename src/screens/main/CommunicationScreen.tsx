import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { MainDrawerParamList } from '../../navigations/MainNavigator';

type Notification = {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'cpd' | 'financial' | 'survey';
};

const mockNotifications: Notification[] = [
  { id: 1, title: 'CPD Seminar Tomorrow', message: 'Digital Transformation in Accounting', time: '2 hours ago', type: 'cpd' },
  { id: 2, title: 'Payment Reminder', message: 'Annual membership due in 5 days', time: '1 day ago', type: 'financial' },
  { id: 3, title: 'New Survey Available', message: 'Professional Development Needs Assessment', time: '3 days ago', type: 'survey' },
];

type Props = DrawerScreenProps<MainDrawerParamList, 'communication'> & {
  onLogout: () => void;
};

const CommunicationScreen: React.FC<Props> = ({ navigation, route, onLogout  }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Header 
          title="Communication Hub" 
          showBack 
          onBack={() => navigation.navigate('dashboard')} 
        />

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search messages, announcements..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Announcements</Text>
          {mockNotifications.map(notification => (
            <TouchableOpacity key={notification.id} style={styles.messageCard}>
              <View style={styles.messageHeader}>
                <Text style={styles.messageTitle}>{notification.title}</Text>
                <Text style={styles.messageTime}>{notification.time}</Text>
              </View>
              <Text style={styles.messageContent}>{notification.message}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.floatingButton}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
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
  searchContainer: {
    margin: 20,
    position: 'relative',
  },
  searchInput: {
    backgroundColor: 'white',
    padding: 15,
    paddingRight: 45,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchIcon: {
    position: 'absolute',
    right: 15,
    top: 18,
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
  messageCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  messageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a202c',
  },
  messageTime: {
    fontSize: 12,
    color: '#999',
  },
  messageContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3182ce',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
});

export default CommunicationScreen;
