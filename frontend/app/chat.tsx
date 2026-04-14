import React from 'react';
import { useRouter } from 'expo-router';
import ChatUI from '@/components/common/ChatUI';

export default function ChatScreen() {
  const router = useRouter();

  return <ChatUI title="Ho tro khach hang" onBackPress={() => router.back()} />;
}
