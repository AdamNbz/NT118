import React from 'react';
import { useRouter } from 'expo-router';
import ChatUI from '@/components/common/ChatUI';

export default function AIChatScreen() {
  const router = useRouter();

  return <ChatUI title="Hỗ trợ khách hàng" onBackPress={() => router.back()} />;
}
