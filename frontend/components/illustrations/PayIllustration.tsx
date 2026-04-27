import React from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';

interface IllustrationProps {
  width?: number;
  height?: number;
}

const PayIllustration: React.FC<IllustrationProps> = ({ width = 320, height = 240 }) => (
  <View style={{ width, height, alignItems: 'center', justifyContent: 'center' }}>
    <Image
      source={require('../../assets/images/slash/shopping.png')}
      style={{ width: '100%', height: '100%' }}
      contentFit="contain"
    />
  </View>
);

export default PayIllustration;
