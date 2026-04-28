import React from 'react';
import AddAddressPage from '@/components/screen/AddAddressPage';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function EditAddressRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  return (
    <AddAddressPage 
      onBack={() => router.back()}
      onSuccess={() => router.back()}
      addressId={Number(id)}
    />
  );
}
