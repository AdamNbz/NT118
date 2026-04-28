import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BannerProps {
  title: string;
  subtitle: string;
  detail?: string;
  buttonText?: string;
  image?: any;
  onPress?: () => void;
  activeDotIndex?: number;
  totalDots?: number;
}

const Banner: React.FC<BannerProps> = ({
  title,
  subtitle,
  detail,
  buttonText = "Mua ngay",
  image,
  onPress,
  activeDotIndex = 0,
  totalDots = 3,
}) => {
  return (
    <View style={styles.bannerContainer}>
      <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.touchable}>
        <ImageBackground 
          source={image || require('../../assets/images/slash/sales.png')} 
          style={styles.banner}
          imageStyle={styles.imageStyle}
        >
          <View style={styles.overlay}>
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle}>{title}</Text>
              <Text style={styles.bannerSubtitle}>{subtitle}</Text>
              {detail && <Text style={styles.bannerDetail}>{detail}</Text>}
              <View style={styles.buttonContainer}>
                <View style={styles.shopNowButton}>
                  <Text style={styles.shopNowText}>{buttonText}</Text>
                  <Ionicons name="arrow-forward" size={14} color="white" />
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
      
      <View style={styles.pagination}>
        {Array.from({ length: totalDots }).map((_, index) => (
          <View 
            key={index} 
            style={[
              styles.dot, 
              activeDotIndex === index && styles.activeDot
            ]} 
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  touchable: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  banner: {
    width: '100%',
    height: 180,
  },
  imageStyle: {
    borderRadius: 20,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 20,
    padding: 20,
    justifyContent: 'center',
  },
  bannerContent: {
    maxWidth: '70%',
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    marginTop: 4,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  bannerDetail: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  buttonContainer: {
    marginTop: 16,
  },
  shopNowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F73658',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  shopNowText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '700',
  },
  pagination: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#e2e8f0',
  },
  activeDot: {
    width: 20,
    backgroundColor: '#F73658',
  },
});

export default Banner;
