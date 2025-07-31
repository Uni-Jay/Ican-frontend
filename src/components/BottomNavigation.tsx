import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  currentScreen: string;
  onNavigate: (screen: any) => void;
}

const BottomNavigation: React.FC<Props> = ({ currentScreen, onNavigate }) => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#1a365d', paddingVertical: 10 }}>
      <TouchableOpacity onPress={() => onNavigate('dashboard')}>
        <Ionicons name="home-outline" size={24} color={currentScreen === 'dashboard' ? 'white' : 'gray'} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onNavigate('communication')}>
        <Ionicons name="chatbubble-ellipses-outline" size={24} color={currentScreen === 'communication' ? 'white' : 'gray'} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onNavigate('chat')}>
        <Ionicons name="person-circle-outline" size={24} color={currentScreen === 'profile' ? 'white' : 'gray'} />
      </TouchableOpacity>
    </View>
  );
};

export default BottomNavigation;
