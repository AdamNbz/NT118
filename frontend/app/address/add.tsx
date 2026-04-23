import React from 'react';
import AddAddressPage from '@/components/screen/AddAddressPage';
import { useRouter } from 'expo-router';

export default function AddAddressRoute() {
  const router = useRouter();
  
  return (
    <AddAddressPage 
      onBack={() => router.back()}
      onSuccess={() => router.back()}
    />
  );
}
