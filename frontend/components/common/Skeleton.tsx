import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface SkeletonProps {
  width: number | string;
  height: number | string;
  borderRadius?: number;
  circle?: boolean;
  style?: ViewStyle;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const Skeleton: React.FC<SkeletonProps> = ({ 
  width, 
  height, 
  borderRadius = 8, 
  circle = false,
  style 
}) => {
  const translateX = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.timing(translateX, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    );
    shimmerAnimation.start();
    return () => shimmerAnimation.stop();
  }, [translateX]);

  const animatedTranslate = translateX.interpolate({
    inputRange: [-1, 1],
    outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
  });

  const finalBorderRadius = circle ? (typeof height === 'number' ? height / 2 : 999) : borderRadius;

  return (
    <View
      style={[
        styles.skeleton,
        { 
          width: width as any, 
          height: height as any, 
          borderRadius: finalBorderRadius 
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { transform: [{ translateX: animatedTranslate }] },
        ]}
      >
        <LinearGradient
          colors={['transparent', 'rgba(255, 255, 255, 0.4)', 'transparent']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#E8E8E8',
    overflow: 'hidden',
  },
});

export default Skeleton;
