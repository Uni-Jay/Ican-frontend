// src/navigations/DashboardTabs.tsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import DashboardScreen from '../screens/main/DashboardScreen';
import CommunicationScreen from '../screens/main/CommunicationScreen';
import ChatScreen from '../screens/main/ChatScreen';
import ProfileSecurityScreen from '../screens/main/ProfileSecurityScreen';

// Define param list explicitly
export type DashboardTabParamList = {
  dashboard: undefined;
  profile: undefined;
};

interface DashboardTabsProps {
  onLogout: () => void;
}

const Tab = createBottomTabNavigator<DashboardTabParamList>();

const DashboardTabs: React.FC<DashboardTabsProps> = ({ onLogout }) => {
  return (
    <Tab.Navigator
      initialRouteName="dashboard"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: React.ComponentProps<typeof Ionicons>['name'] = 'home-outline';
          if (route.name === 'profile') {
            iconName = 'chatbubble-ellipses-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3182ce',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="dashboard"
        options={{ title: 'Dashboard' }}
      >
        {(props) => <DashboardScreen {...props} onLogout={onLogout} />}
      </Tab.Screen>

      <Tab.Screen
        name="profile"
        options={{ title: 'Profile' }}
        >
            {(props) => <ProfileSecurityScreen {...props} onLogout={onLogout} />}
        </Tab.Screen>
    </Tab.Navigator>
  );
};

export default DashboardTabs;
