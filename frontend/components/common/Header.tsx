import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface HeaderProps {
  onMenuPress?: () => void;
  onProfilePress?: () => void;
  onMessagePress?: () => void;
  logoText?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  onMenuPress, 
  onProfilePress, 
  onMessagePress,
  logoText = "ShopeeLite" 
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
        <View style={styles.menuIconLine} />
        <View style={[styles.menuIconLine, { width: 15 }]} />
        <View style={styles.menuIconLine} />
      </TouchableOpacity>

      <View pointerEvents="none" style={styles.absoluteCenter}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/images/homepage/icons/Component 1.svg')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.logoText}>{logoText}</Text>
        </View>
      </View>

      <View style={styles.sideRight}>
        <View style={styles.rightActions}>
          <TouchableOpacity style={styles.messageButton} onPress={onMessagePress}>
            <Feather name="message-circle" size={18} color="#333" />
          </TouchableOpacity>

          {onProfilePress ? (
            <TouchableOpacity style={styles.profileButton} onPress={onProfilePress}>
              <Image 
                source={require('../../assets/images/homepage/icons/Ellipse 6.svg')} 
                style={styles.profileImage}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#F9F9F9',
    position: 'relative',
  },
  sideRight: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  absoluteCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuButton: {
    width: 32,
    height: 32,
    backgroundColor: '#EEEEEE',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  menuIconLine: {
    width: 18,
    height: 2,
    backgroundColor: '#333',
    borderRadius: 1,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoImage: {
    width: 32,
    height: 32,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4392F9',
    fontFamily: 'Montserrat_700Bold',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  messageButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEEEEE',
    justifyContent: 'center',
    alignItems: 'center',
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
