import React, { FC, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import FinancialScreen from '../screens/main/FinancialScreen';
import CPDScreen from '../screens/main/CPDScreen';
import EventsScreen from '../screens/main/EventsScreen';
import ChatScreen from '../screens/main/ChatScreen';
import VotingSurveysScreen from '../screens/main/VotingScreen';
import ProfileSecurityScreen from '../screens/main/ProfileSecurityScreen';

import CustomDrawer from '../components/CustomDrawer';
import DashboardTabs from './DashboardTabs';
import CommunicationScreen from '../screens/main/CommunicationScreen';
import NotificationsScreen from '../screens/main/NotificationScreen';
import { NotificationModal } from '../components/NotificationModal';
import { navigationRef } from './navigationRef';

export type MainDrawerParamList = {
  dashboard: undefined;
  financial: undefined;
  cpd: undefined;
  chat: undefined;
  events: undefined;
  voting: undefined;
  profile: undefined;
  communication: undefined;
  notifications: undefined;
};

interface MainNavigatorProps {
  onLogout: () => void;
}

type Notification = {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
};

const Drawer = createDrawerNavigator<MainDrawerParamList>();

const MainNavigator: FC<MainNavigatorProps> = ({ onLogout }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
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

  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Debug log and open modal
  const handleNotificationIconPress = (currentRoute: string, navigation: any) => {
    console.log('Notification icon pressed, current route:', currentRoute);
    if (currentRoute === 'notifications') {
      // Already on notifications screen
      console.log('Already on notifications screen, not showing modal');
      return;
    } else {
      setShowNotificationModal(true);
    }
  };

  const handleNotificationItemPress = (notification: Notification) => {
    if (!notification.read) {
      setNotifications(prev =>
        prev.map(item =>
          item.id === notification.id ? { ...item, read: true } : item
        )
      );
    }
    setShowNotificationModal(false);
  };

  const handleMarkAllRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const handleViewAll = () => {
    setShowNotificationModal(false);
    if (navigationRef.isReady()) {
      navigationRef.navigate('notifications');
    } else {
      console.warn('Navigation ref not ready');
    }
  };

  // Custom headerRight with badge on notification icon
  const renderNotificationIcon = (routeName: string, navigation: any) => (
    <TouchableOpacity
      style={{ marginRight: 15 }}
      onPress={() => handleNotificationIconPress(routeName, navigation)}
      activeOpacity={0.7}
    >
      <View>
        <Ionicons name="notifications" size={24} color="#3182ce" />
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Drawer.Navigator
        initialRouteName="dashboard"
        drawerContent={(props) => <CustomDrawer {...props} onLogout={onLogout} />}
        screenOptions={({ navigation, route }) => ({
          headerShown: true,
          headerLeft: () => (
            <Ionicons
              name="menu"
              size={24}
              style={{ marginLeft: 15 }}
              onPress={() => navigation.toggleDrawer()}
            />
          ),
          headerRight: () => renderNotificationIcon(route.name, navigation),
        })}
      >
        <Drawer.Screen
          name="dashboard"
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
            title: 'Dashboard',
          }}
        >
          {(props) => <DashboardTabs {...props} onLogout={onLogout} />}
        </Drawer.Screen>

        <Drawer.Screen
          name="financial"
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="card-outline" size={size} color={color} />
            ),
            title: 'Financial',
          }}
        >
          {(props) => <FinancialScreen {...props} onLogout={onLogout} />}
        </Drawer.Screen>

        <Drawer.Screen
          name="cpd"
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="school-outline" size={size} color={color} />
            ),
            title: 'CPD',
          }}
        >
          {(props) => <CPDScreen {...props} onLogout={onLogout} />}
        </Drawer.Screen>

        <Drawer.Screen
          name="events"
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="calendar-outline" size={size} color={color} />
            ),
            title: 'Events',
          }}
        >
          {(props) => <EventsScreen {...props} onLogout={onLogout} />}
        </Drawer.Screen>

        {/* <Drawer.Screen
          name="chat"
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="chatbox-ellipses-outline" size={size} color={color} />
            ),
            title: 'Chat',
          }}
        >
          {(props) => <ChatScreen {...props} onLogout={onLogout} />}
        </Drawer.Screen> */}

        <Drawer.Screen
          name="voting"
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="bar-chart-outline" size={size} color={color} />
            ),
            title: 'Voting & Surveys',
          }}
        >
          {(props) => <VotingSurveysScreen {...props} onLogout={onLogout} />}
        </Drawer.Screen>

        <Drawer.Screen
          name="profile"
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="person-circle-outline" size={size} color={color} />
            ),
            title: 'Profile & Security',
          }}
        >
          {(props) => <ProfileSecurityScreen {...props} onLogout={onLogout} />}
        </Drawer.Screen>

        <Drawer.Screen
          name="communication"
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="chatbubble-ellipses-outline" size={size} color={color} />
            ),
            title: 'Communication',
          }}
        >
          {(props) => <CommunicationScreen {...props} onLogout={onLogout} />}
        </Drawer.Screen>

        <Drawer.Screen
          name="notifications"
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="notifications-outline" size={size} color={color} />
            ),
            title: 'Notifications',
          }}
        >
          {(props) => (
            <NotificationsScreen
              {...props}
              onLogout={onLogout}
              notifications={notifications}
              onNotificationRead={(id: string) => {
                setNotifications(prev =>
                  prev.map(item =>
                    item.id === id ? { ...item, read: true } : item
                  )
                );
              }}
              onMarkAllRead={handleMarkAllRead}
            />
          )}
        </Drawer.Screen>
      </Drawer.Navigator>

      {/* Notification Modal */}
      <NotificationModal
        visible={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        notifications={notifications}
        onNotificationPress={handleNotificationItemPress}
        onMarkAllRead={handleMarkAllRead}
        onViewAll={handleViewAll}
      />
    </>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -6,
    top: -3,
    backgroundColor: '#dc2626',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default MainNavigator;
