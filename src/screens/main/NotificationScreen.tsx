import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { MainDrawerParamList } from '../../navigations/MainNavigator'; // Adjust the path as needed
import Header from '../../components/Header';

type Props = DrawerScreenProps<MainDrawerParamList, 'notifications'> & {
  onLogout: () => void;
};

// Define the Notification type
type Notification = {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
};

const NotificationScreen: React.FC<Props> = ({ onLogout, navigation }) => {
  const [allNotifications, setAllNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Welcome to EduHack!',
      message: 'Thanks for joining the platform.',
      read: false,
      createdAt: '2025-07-31T08:00:00Z',
    },
    {
      id: '2',
      title: 'CPD Event Coming Up',
      message: 'Don’t forget to register for the upcoming CPD seminar.',
      read: false,
      createdAt: '2025-07-30T12:00:00Z',
    },
    {
      id: '3',
      title: 'New Payment Gateway',
      message: 'You can now pay via bank transfer or debit card.',
      read: false,
      createdAt: '2025-07-29T14:30:00Z',
    },
  ]);

  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const handleSelectNotification = (notification: Notification) => {
    setSelectedNotification(notification);
    setAllNotifications((prev) =>
      prev.map((item) =>
        item.id === notification.id ? { ...item, read: true } : item
      )
    );
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[styles.notificationItem, item.read && styles.readNotification]}
      onPress={() => handleSelectNotification(item)}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.message}>{item.message}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {/* <Header 
          title="Notifications" 
          showBack 
          onBack={() => navigation.navigate('dashboard')} 
        /> */}
        <TouchableOpacity onPress={onLogout}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={allNotifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotificationItem}
        contentContainerStyle={styles.listContent}
      />

      {selectedNotification && (
        <View style={styles.selectedBox}>
          <Text style={styles.selectedTitle}>Selected Notification</Text>
          <Text style={styles.selectedMessage}>{selectedNotification.message}</Text>
          <Text style={styles.timestamp}>
            Received on: {new Date(selectedNotification.createdAt).toLocaleString()}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
  },
  logout: {
    fontSize: 16,
    color: '#dc2626',
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 20,
  },
  notificationItem: {
    padding: 15,
    backgroundColor: '#f0f4f8',
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  readNotification: {
    backgroundColor: '#e6e6e6',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  message: {
    fontSize: 14,
    color: '#666',
  },
  selectedBox: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#e0f2fe',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  selectedTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    color: '#0c4a6e',
  },
  selectedMessage: {
    fontSize: 16,
    color: '#0f172a',
    marginBottom: 10,
  },
  timestamp: {
    fontSize: 13,
    color: '#475569',
  },
});

export default NotificationScreen;
