import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import OrderDetailScreen from '@/components/screen/OrderDetailScreen';

export default function OrderDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <OrderDetailScreen orderId={Number(id)} />;
}
