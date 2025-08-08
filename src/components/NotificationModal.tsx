import React from 'react';
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Notification = {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
};

interface NotificationModalProps {
  visible: boolean;
  onClose: () => void;
  notifications: Notification[];
  onNotificationPress: (notification: Notification) => void;
  onMarkAllRead: () => void;
  onViewAll: () => void;
}

const { height } = Dimensions.get('window');

export const NotificationModal: React.FC<NotificationModalProps> = ({
  visible,
  onClose,
  notifications,
  onNotificationPress,
  onMarkAllRead,
  onViewAll,
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;
  const recentNotifications = notifications.slice(0, 5); // Show only first 5

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[styles.notificationItem, item.read && styles.readNotification]}
      onPress={() => onNotificationPress(item)}
    >
      <View style={styles.notificationHeader}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        {!item.read && <View style={styles.unreadDot} />}
      </View>
      <Text style={styles.message} numberOfLines={2}>
        {item.message}
      </Text>
      <Text style={styles.timestamp}>
        {new Date(item.createdAt).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerLeft}>
              <Ionicons name="notifications" size={24} color="#3182ce" />
              <Text style={styles.modalTitle}>Notifications</Text>
              {unreadCount > 0 && (
                <View style={styles.headerBadge}>
                  <Text style={styles.headerBadgeText}>{unreadCount}</Text>
                </View>
              )}
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity onPress={onMarkAllRead} style={styles.markAllButton}>
              <Text style={styles.markAllText}>Mark All Read</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onViewAll} style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {/* Notifications List */}
          <View style={styles.notificationsList}>
            {recentNotifications.length > 0 ? (
              <FlatList
                data={recentNotifications}
                keyExtractor={item => item.id}
                renderItem={renderNotificationItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
              />
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="notifications-off-outline" size={48} color="#ccc" />
                <Text style={styles.emptyText}>No notifications</Text>
              </View>
            )}
          </View>

          {/* Footer */}
          {notifications.length > 5 && (
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Showing {recentNotifications.length} of {notifications.length} notifications
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center', // center vertically for better visibility
    alignItems: 'center', // center horizontally
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    maxHeight: height * 0.7,
    width: '100%',
    paddingBottom: 20,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 10,
    color: '#333',
  },
  headerBadge: {
    backgroundColor: '#dc2626',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    paddingHorizontal: 4,
  },
  headerBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 10,
  },
  markAllButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  markAllText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  viewAllButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewAllText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
  },
  notificationsList: {
    flex: 1,
    paddingHorizontal: 20,
    maxHeight: height * 0.45,
  },
  listContent: {
    paddingBottom: 10,
  },
  notificationItem: {
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
  },
  readNotification: {
    backgroundColor: '#f1f5f9',
    borderLeftColor: '#94a3b8',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#dc2626',
  },
  message: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
    lineHeight: 18,
  },
  timestamp: {
    fontSize: 11,
    color: '#9ca3af',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#9ca3af',
    marginTop: 10,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
});
