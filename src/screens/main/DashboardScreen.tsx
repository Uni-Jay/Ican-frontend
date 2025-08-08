import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { MainDrawerParamList } from '../../navigations/MainNavigator';

const { width } = Dimensions.get('window');

type User = {
  id: number;
  name: string;
  email: string;
  membershipId: string;
  membershipLevel: string;
  profileImage: string | null;
  balance: number;
  cpdPoints: number;
};

type Notification = {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'cpd' | 'financial' | 'survey';
};

const mockUser: User = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@ican.ng',
  membershipId: 'ICAN/2024/001',
  membershipLevel: 'Associate',
  profileImage: null,
  balance: 45000,
  cpdPoints: 120,
};

const mockNotifications: Notification[] = [
  { id: 1, title: 'CPD Seminar Tomorrow', message: 'Digital Transformation in Accounting', time: '2 hours ago', type: 'cpd' },
  { id: 2, title: 'Payment Reminder', message: 'Annual membership due in 5 days', time: '1 day ago', type: 'financial' },
  { id: 3, title: 'New Survey Available', message: 'Professional Development Needs Assessment', time: '3 days ago', type: 'survey' },
];

type Props = DrawerScreenProps<MainDrawerParamList, 'dashboard'> & {
  onLogout: () => void;
};

const DashboardScreen: React.FC<Props> = ({ navigation, route, onLogout }) => {
  const [user] = useState<User>(mockUser);
  const [unreadCount] = useState<number>(3); // You can manage this state based on actual unread notifications

  const handleNotificationPress = () => {
    navigation.navigate('notifications');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Custom Header with Notification Icon */}
        <View style={styles.customHeader}>
          {/* <Text style={styles.headerTitle}>ICAN Dashboard</Text> */}
          {/* <TouchableOpacity 
            style={styles.notificationButton} 
            onPress={handleNotificationPress}
          >
            <Ionicons name="notifications" size={24} color="#3182ce" />
            {unreadCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>
                  {unreadCount > 9 ? '9+' : unreadCount.toString()}
                </Text>
              </View>
            )}
          </TouchableOpacity> */}
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.name
                  .split(' ')
                  .map(n => n[0])
                  .join('')}
              </Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.membershipId}>{user.membershipId}</Text>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="wallet" size={24} color="#3182ce" />
            <Text style={styles.statValue}>₦{user.balance.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Account Balance</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="school" size={24} color="#38a169" />
            <Text style={styles.statValue}>{user.cpdPoints}</Text>
            <Text style={styles.statLabel}>CPD Points</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('financial')}>
              <Ionicons name="card" size={32} color="#3182ce" />
              <Text style={styles.actionText}>Pay Dues</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('cpd')}>
              <Ionicons name="book" size={32} color="#38a169" />
              <Text style={styles.actionText}>CPD Modules</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('events')}>
              <Ionicons name="calendar" size={32} color="#d69e2e" />
              <Text style={styles.actionText}>Events</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('voting')}>
              <Ionicons name="checkbox" size={32} color="#9f7aea" />
              <Text style={styles.actionText}>Vote</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Notifications */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Updates</Text>
            <TouchableOpacity onPress={handleNotificationPress}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {mockNotifications.slice(0, 3).map(notification => (
            <TouchableOpacity 
              key={notification.id} 
              style={styles.notificationCard}
              onPress={handleNotificationPress}
            >
              <View style={styles.notificationIcon}>
                <Ionicons
                  name={
                    notification.type === 'cpd'
                      ? 'school'
                      : notification.type === 'financial'
                      ? 'card'
                      : 'checkbox'
                  }
                  size={20}
                  color="#3182ce"
                />
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{notification.title}</Text>
                <Text style={styles.notificationMessage}>{notification.message}</Text>
                <Text style={styles.notificationTime}>{notification.time}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>
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
  customHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a202c',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
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
  welcomeSection: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3182ce',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a202c',
    marginVertical: 2,
  },
  membershipId: {
    fontSize: 14,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  statCard: {
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
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a202c',
    marginVertical: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a202c',
  },
  viewAllText: {
    fontSize: 14,
    color: '#3182ce',
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 60) / 2,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a202c',
    marginTop: 8,
    textAlign: 'center',
  },
  notificationCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e6f3ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
});

export default DashboardScreen;