import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  showBack?: boolean;
  onBack?: () => void;
  title?: string;
  onMenu?: () => void; // to open drawer
}

const Header: React.FC<HeaderProps> = ({ showBack, onBack, title, onMenu }) => {
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
      {/* Empty View to balance the row */}
      <View style={styles.leftButton} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    height: 50, 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    justifyContent: 'space-between',
  },
  leftButton: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Header;
