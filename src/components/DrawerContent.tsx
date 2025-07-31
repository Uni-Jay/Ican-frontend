import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  navigation: any;
  onLogout: () => void;
}

const DrawerContent: React.FC<Props> = ({ navigation, onLogout }) => {
  return (
    <DrawerContentScrollView>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>EduHack Menu</Text>
      </View>

      <DrawerItem
        label="Dashboard"
        icon={({ color, size }) => <Ionicons name="home-outline" color={color} size={size} />}
        onPress={() => navigation.navigate('Main')}
      />
      <DrawerItem
        label="CPD"
        icon={({ color, size }) => <Ionicons name="school-outline" color={color} size={size} />}
        onPress={() => navigation.navigate('cpd')}
      />
      <DrawerItem
        label="Voting"
        icon={({ color, size }) => <Ionicons name="podium-outline" color={color} size={size} />}
        onPress={() => navigation.navigate('voting')}
      />
      <DrawerItem
        label="Events"
        icon={({ color, size }) => <Ionicons name="calendar-outline" color={color} size={size} />}
        onPress={() => navigation.navigate('events')}
      />
      <DrawerItem
        label="Profile"
        icon={({ color, size }) => <Ionicons name="person-outline" color={color} size={size} />}
        onPress={() => navigation.navigate('profile')}
      />
      <DrawerItem
        label="Logout"
        icon={({ color, size }) => <Ionicons name="log-out-outline" color={color} size={size} />}
        onPress={onLogout}
      />
    </DrawerContentScrollView>
  );
};

export default DrawerContent;
