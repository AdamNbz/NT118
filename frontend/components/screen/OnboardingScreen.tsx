import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';

const OnboardingScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header with Step and Skip */}
      <View className="flex-row justify-between px-5 pt-5 items-center">
        <View className="flex-row items-center">
          <Text className="text-black text-lg font-semibold" style={{ fontFamily: 'Montserrat_600SemiBold' }}>1</Text>
          <Text className="text-neutral-400 text-lg font-semibold" style={{ fontFamily: 'Montserrat_600SemiBold' }}>/3</Text>
        </View>
        <TouchableOpacity onPress={() => router.replace('/(tabs)')}>
          <Text className="text-black text-lg font-semibold" style={{ fontFamily: 'Montserrat_600SemiBold' }}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View className="flex-1 items-center justify-center px-10">
        {/* Illustration Placeholder (as described in Figma data) */}
        <View className="w-72 h-72 items-center justify-center bg-neutral-100 rounded-full mb-10 overflow-hidden">
             <Image 
                source={require('../../assets/images/Group 34010.svg')}
                style={{ width: '80%', height: '80%' }}
                contentFit="contain"
             />
        </View>

        {/* Title */}
        <Text 
          className="text-black text-3xl font-extrabold text-center mb-4"
          style={{ fontFamily: 'Montserrat_800ExtraBold' }}
        >
          Chọn sản phẩm
        </Text>

        {/* Description */}
        <Text 
          className="text-neutral-400 text-base font-semibold text-center leading-6"
          style={{ fontFamily: 'Montserrat_600SemiBold' }}
        >
          Khám phá hàng triệu sản phẩm từ thời trang, điện tử đến đồ gia dụng. Tìm món đồ yêu thích chỉ trong vài giây!
        </Text>
      </View>

      {/* Footer with Pagination and Next */}
      <View className="flex-row items-center justify-between px-10 pb-10">
        {/* Pagination Dots */}
        <View className="flex-row items-center gap-2">
          <View className="w-10 h-2.5 bg-slate-800 rounded-full" />
          <View className="w-2.5 h-2.5 bg-slate-800 opacity-20 rounded-full" />
          <View className="w-2.5 h-2.5 bg-slate-800 opacity-20 rounded-full" />
        </View>

        {/* Next Button */}
        <TouchableOpacity onPress={() => router.replace('/(tabs)')}>
          <Text 
            className="text-rose-500 text-xl font-bold"
            style={{ fontFamily: 'Montserrat_700Bold' }}
          >
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;
