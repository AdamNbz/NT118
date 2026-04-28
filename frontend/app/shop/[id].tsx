import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import ShopPage from '@/components/screen/ShopPage';

export default function ShopRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ShopPage shopId={Number(id)} />;
}
