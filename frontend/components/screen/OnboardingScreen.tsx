import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Dimensions, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { OnboardingIllustration } from '../illustrations';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const OnboardingScreen = () => {
  const router = useRouter();

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  const handleNext = () => {
    router.push('/splash-pay');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Step and Skip */}
      <View style={styles.header}>
        <View style={styles.stepRow}>
          <Text style={styles.stepActive}>1</Text>
          <Text style={styles.stepTotal}>/3</Text>
        </View>
        <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      <View style={styles.content}>
        {/* Illustration with subtle background */}
        <View style={styles.illustrationWrapper}>
          <View style={styles.illustrationBg} />
          <OnboardingIllustration width={280} height={280} />
        </View>

        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Chọn sản phẩm</Text>
          <Text style={styles.subtitle}>
            Khám phá hàng triệu sản phẩm từ thời trang, điện tử đến đồ gia dụng. Tìm món đồ yêu thích chỉ trong vài giây!
          </Text>
        </View>
      </View>

      {/* Footer with Pagination and Next */}
      <View style={styles.footer}>
        <View style={{ width: 50 }} />

        {/* Pagination Dots */}
        <View style={styles.dots}>
          <View style={[styles.dotActive]} />
          <View style={styles.dotInactive} />
          <View style={styles.dotInactive} />
        </View>

        {/* Next Button */}
        <TouchableOpacity onPress={handleNext} style={styles.nextBtn}>
          <LinearGradient
            colors={['#F83758', '#FF6B8A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.nextGradient}
          >
            <Text style={styles.nextText}>Next</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  stepActive: {
    color: '#17223B',
    fontSize: 20,
    fontWeight: '700',
  },
  stepTotal: {
    color: '#B0B0B2',
    fontSize: 20,
    fontWeight: '600',
  },
  skipBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  skipText: {
    color: '#17223B',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  illustrationWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  illustrationBg: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(248, 55, 88, 0.06)',
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  title: {
    color: '#17223B',
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  subtitle: {
    color: '#8E8E93',
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: 0.2,
    maxWidth: 320,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 36,
    paddingTop: 12,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dotActive: {
    width: 32,
    height: 8,
    backgroundColor: '#F83758',
    borderRadius: 100,
  },
  dotInactive: {
    width: 8,
    height: 8,
    backgroundColor: 'rgba(23, 34, 59, 0.15)',
    borderRadius: 100,
  },
  nextBtn: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#F83758',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  nextGradient: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  nextText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default OnboardingScreen;
