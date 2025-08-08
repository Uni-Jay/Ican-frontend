import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  showBack?: boolean;
  onBack?: () => void;
  title?: string;
  onMenu?: () => void; // to open drawer
  onNotification?: () => void; // to navigate to notifications
  unreadCount?: number; // number of unread notifications
  showNotification?: boolean; // whether to show notification icon
}

const Header: React.FC<HeaderProps> = ({ 
  showBack, 
  onBack, 
  title, 
  onMenu, 
  onNotification,
  unreadCount = 0,
  showNotification = true
}) => {
  return (
    <View style={styles.container}>
      {showBack ? (
        <TouchableOpacity onPress={onBack} style={styles.leftButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={onMenu} style={styles.leftButton}>
          <Ionicons name="menu" size={28} color="black" />
        </TouchableOpacity>
      )}

      <Text style={styles.title}>{title || 'App Header'}</Text>
      
      {/* Notification Icon */}
      {showNotification ? (
        <TouchableOpacity 
          style={styles.rightButton} 
          onPress={onNotification}
        >
          <Ionicons name="notifications" size={24} color="#3182ce" />
          {unreadCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>
                {unreadCount > 9 ? '9+' : unreadCount.toString()}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      ) : (
        <View style={styles.rightButton} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    height: 60, 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 15,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: 'space-between',
  },
  leftButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a202c',
    flex: 1,
    textAlign: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#e53e3e',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default Header;