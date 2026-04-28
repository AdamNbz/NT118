import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  onMenuPress?: () => void;
  onProfilePress?: () => void;
  onMessagePress?: () => void;
  userName?: string;
  avatarUrl?: string | null;
}

const Header: React.FC<HeaderProps> = ({ 
  onMenuPress, 
  onProfilePress, 
  onMessagePress,
}) => {
  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <View style={styles.leftSection}>
          <Text style={styles.logoText}>ShopeeLite</Text>
        </View>

        <View style={styles.rightSection}>
          <TouchableOpacity style={styles.iconButton} onPress={onMessagePress}>
            <Feather name="message-circle" size={22} color="#1e293b" />
            <View style={styles.badge} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={onMenuPress}>
            <Ionicons name="notifications-outline" size={22} color="#1e293b" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: 'transparent',
    zIndex: 100,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#fff',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#F73658',
    letterSpacing: -0.5,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  profileButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
});

export default Header;
