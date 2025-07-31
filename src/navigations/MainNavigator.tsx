import React, { FC } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

import FinancialScreen from '../screens/main/FinancialScreen';
import CPDScreen from '../screens/main/CPDScreen';
import EventsScreen from '../screens/main/EventsScreen';
import ChatScreen from '../screens/main/ChatScreen';
import VotingSurveysScreen from '../screens/main/Voting';
import ProfileSecurityScreen from '../screens/main/ProfileSecurityScreen';

import CustomDrawer from '../components/CustomDrawer';
import DashboardTabs from './DashboardTabs';
import CommunicationScreen from '../screens/main/CommunicationScreen';

export type MainDrawerParamList = {
  dashboard: undefined;
  financial: undefined;
  cpd: undefined;
  chat: undefined;
  events: undefined;
  voting: undefined;
  profile: undefined;
  communication: undefined;
};

interface MainNavigatorProps {
  onLogout: () => void;
}

const Drawer = createDrawerNavigator<MainDrawerParamList>();

const MainNavigator: FC<MainNavigatorProps> = ({ onLogout }) => {
  return (
    <Drawer.Navigator
      initialRouteName="dashboard"
      drawerContent={(props) => <CustomDrawer {...props} onLogout={onLogout} />}
      screenOptions={({ navigation }) => ({
    headerShown: true,  // Show header for default hamburger button
    headerLeft: () => (
      <Ionicons
        name="menu"
        size={24}
        style={{ marginLeft: 15 }}
        onPress={() => navigation.toggleDrawer()}
      />
    ),
  })}

    >
      {/* Dashboard uses render function to pass onLogout */}
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

      {/* Other screens */}
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
        }}>
        {(props) => <CPDScreen {...props} onLogout={onLogout} />}
        </Drawer.Screen>

      <Drawer.Screen
        name="events"
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
          title: 'Events',
        }}>
        {(props) => <EventsScreen {...props} onLogout={onLogout} />}
        </Drawer.Screen>

      <Drawer.Screen
        name="chat"
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="chatbox-ellipses-outline" size={size} color={color} />
          ),
          title: 'Chat',
        }}>
        {(props) => <ChatScreen {...props} onLogout={onLogout} />}
        </Drawer.Screen>

      <Drawer.Screen
        name="voting"
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="bar-chart-outline" size={size} color={color} />
          ),
          title: 'Voting & Surveys',
        }}>
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
    </Drawer.Navigator>
  );
};

export default MainNavigator;
