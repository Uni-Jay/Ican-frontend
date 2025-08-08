// screens/main/NotificationScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { MainDrawerParamList } from '../../navigations/MainNavigator';
import Header from '../../components/Header';

type Props = DrawerScreenProps<MainDrawerParamList, 'notifications'> & {
  onLogout: () => void;
  notifications?: Notification[];
  onNotificationRead?: (id: string) => void;
  onMarkAllRead?: () => void;
};

// Define the Notification type
type Notification = {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
};

const NotificationScreen: React.FC<Props> = ({ 
  onLogout, 
  navigation, 
  notifications: externalNotifications,
  onNotificationRead,
  onMarkAllRead: externalMarkAllRead
}) => {
  // Use external notifications if provided, otherwise use local state
  const [localNotifications, setLocalNotifications] = useState<Notification[]>([
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
      message: "Don't forget to register for the upcoming CPD seminar.",
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

  // Use external notifications if available, otherwise use local
  const allNotifications = externalNotifications || localNotifications;
  const unreadCount = allNotifications.filter(n => !n.read).length;

  const handleSelectNotification = (notification: Notification) => {
    setSelectedNotification(notification);
    
    if (!notification.read) {
      if (onNotificationRead) {
        // If external handler is provided, use it
        onNotificationRead(notification.id);
      } else {
        // Otherwise, update local state
        setLocalNotifications((prev) =>
          prev.map((item) =>
            item.id === notification.id ? { ...item, read: true } : item
          )
        );
      }
    }
  };

  const handleMarkAllRead = () => {
    if (externalMarkAllRead) {
      // Use external handler if provided
      externalMarkAllRead();
    } else {
      // Otherwise, update local state
      setLocalNotifications((prev) =>
        prev.map((item) => ({ ...item, read: true }))
      );
    }
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[styles.notificationItem, item.read && styles.readNotification]}
      onPress={() => handleSelectNotification(item)}
    >
      <View style={styles.notificationHeader}>
        <Text style={styles.title}>{item.title}</Text>
        {!item.read && <View style={styles.unreadDot} />}
      </View>
      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.timestamp}>
        {new Date(item.createdAt).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Notifications</Text>
        <View style={styles.headerActions}>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={handleMarkAllRead} style={styles.markAllButton}>
              <Text style={styles.markAllText}>Mark All Read</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={onLogout}>
            <Text style={styles.logout}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Unread count indicator */}
      {unreadCount > 0 && (
        <View style={styles.unreadIndicator}>
          <Text style={styles.unreadText}>
            You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </Text>
        </View>
      )}

      <FlatList
        data={allNotifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotificationItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {selectedNotification && (
        <View style={styles.selectedBox}>
          <Text style={styles.selectedTitle}>Selected Notification</Text>
          <Text style={styles.selectedMessage}>{selectedNotification.message}</Text>
          <Text style={styles.detailTimestamp}>
            Received on: {new Date(selectedNotification.createdAt).toLocaleString()}
          </Text>
        </View>
      )}

      {/* Empty state */}
      {allNotifications.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No notifications yet</Text>
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
    color: '#333',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  markAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#3b82f6',
    borderRadius: 6,
  },
  markAllText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  logout: {
    fontSize: 16,
    color: '#dc2626',
    fontWeight: '600',
  },
  unreadIndicator: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  unreadText: {
    fontSize: 14,
    color: '#92400e',
    fontWeight: '500',
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
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  readNotification: {
    backgroundColor: '#e6e6e6',
    borderLeftColor: '#9ca3af',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#dc2626',
  },
  message: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#9ca3af',
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
  detailTimestamp: {
    fontSize: 13,
    color: '#475569',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#9ca3af',
  },
});

export default NotificationScreen;