import React from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';

interface IllustrationProps {
  width?: number;
  height?: number;
}

const OnboardingIllustration: React.FC<IllustrationProps> = ({ width = 300, height = 300 }) => (
  <View style={{ width, height, alignItems: 'center', justifyContent: 'center' }}>
    <Image
      source={require('../../assets/images/slash/shop.png')}
      style={{ width: '100%', height: '100%' }}
      contentFit="contain"
    />
  </View>
);

export default OnboardingIllustration;
