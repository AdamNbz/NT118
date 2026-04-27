import React from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';

interface IllustrationProps {
  width?: number;
  height?: number;
}

const FollowIllustration: React.FC<IllustrationProps> = ({ width = 300, height = 300 }) => (
  <View style={{ width, height, alignItems: 'center', justifyContent: 'center' }}>
    <Image
      source={require('../../assets/images/slash/sales.png')}
      style={{ width: '100%', height: '100%' }}
      contentFit="contain"
    />
  </View>
);

export default FollowIllustration;
