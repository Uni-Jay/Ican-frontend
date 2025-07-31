import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  showNotifications?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  onBack,
  showNotifications = true,
}) => (
  <View style={styles.header}>
    <StatusBar barStyle="light-content" backgroundColor="#1a365d" />
    <View style={styles.headerContent}>
      {showBack && (
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      )}
      <Text style={[styles.headerTitle, !showBack && { textAlign: 'left' }]}>
        {title}
      </Text>
      {showNotifications && (
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications" size={24} color="white" />
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  </View>
);

interface Style {
  header: ViewStyle;
  headerContent: ViewStyle;
  backButton: ViewStyle;
  headerTitle: TextStyle;
  notificationButton: ViewStyle;
  notificationBadge: ViewStyle;
  badgeText: TextStyle;
}

const styles = StyleSheet.create<Style>({
  header: {
    backgroundColor: '#1a365d',
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight ?? 0,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#e53e3e',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default Header;
