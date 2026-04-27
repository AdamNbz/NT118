import { Tabs } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useNotifications, useNotificationSignalR } from '@/lib/notificationApi';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { unreadCount, loadUnreadCount, handleRealtimeNotification } = useNotifications();

  useNotificationSignalR(handleRealtimeNotification);

  React.useEffect(() => { loadUnreadCount(); }, [loadUnreadCount]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#EEEEEE',
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarActiveTintColor: '#FF4747',
        tabBarInactiveTintColor: '#000',
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: 'Montserrat_500Medium',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trang Chủ',
          tabBarIcon: ({ color, focused }) => (
            <Feather name="home" size={24} color={focused ? '#FF4747' : color} />
          ),
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: 'Yêu Thích',
          tabBarIcon: ({ color, focused }) => (
            <Feather name="heart" size={24} color={focused ? '#FF4747' : color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <View style={styles.cartButtonContainer}>
              <View style={styles.cartButton}>
                <Feather name="shopping-cart" size={24} color="black" />
              </View>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          title: 'Thông báo',
          tabBarIcon: ({ color, focused }) => (
            <View>
              <Feather name="bell" size={24} color={focused ? '#FF4747' : color} />
              {unreadCount > 0 && (
                <View style={styles.notifBadge}>
                  <Text style={styles.notifBadgeText}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Cài Đặt',
          tabBarIcon: ({ color, focused }) => (
            <Feather name="settings" size={24} color={focused ? '#FF4747' : color} />
          ),
        }}
      />
      
      {/* Hide leftover unused screens from the Tab bar */}
      <Tabs.Screen name="search" options={{ href: null }} />
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  cartButtonContainer: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#F2F2F2',
  },
  notifBadge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: '#FF4747',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  notifBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
