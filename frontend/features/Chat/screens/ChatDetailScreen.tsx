import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

type Message = {
  id: string;
  text: string;
  sender: 'me' | 'other';
  time: string;
};

const ChatDetailScreen = () => {
  const router = useRouter();
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Chào bạn, mình có thể giúp gì cho bạn?', sender: 'other', time: '10:00' },
    { id: '2', text: 'Sản phẩm này còn hàng không shop?', sender: 'me', time: '10:05' },
    { id: '3', text: 'Dạ sản phẩm này còn hàng ạ, bạn muốn đặt size nào?', sender: 'other', time: '10:06' },
  ]);
  const [draft, setDraft] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const handleSend = () => {
    if (!draft.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      text: draft,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([...messages, newMessage]);
    setDraft('');
  };

  useEffect(() => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#FAF7FF', '#FFFFFF']} style={StyleSheet.absoluteFill} />
      
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <Feather name="chevron-left" size={24} color="#1B1530" />
          </TouchableOpacity>
          
          <View style={styles.userInfo}>
            <Image source={{ uri: 'https://i.pravatar.cc/100' }} style={styles.avatar} />
            <View>
              <Text style={styles.userName}>{name || 'Shop'}</Text>
              <View style={styles.statusRow}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Đang hoạt động</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.iconButton}>
            <Feather name="phone" size={20} color="#1B1530" />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={[styles.messageWrapper, item.sender === 'me' ? styles.myWrapper : styles.otherWrapper]}>
                <View style={[styles.bubble, item.sender === 'me' ? styles.myBubble : styles.otherBubble]}>
                  <Text style={[styles.messageText, item.sender === 'me' ? styles.myText : styles.otherText]}>
                    {item.text}
                  </Text>
                </View>
                <Text style={styles.timeText}>{item.time}</Text>
              </View>
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          {/* Composer */}
          <View style={styles.composerWrap}>
            <View style={styles.composer}>
              <TouchableOpacity style={styles.attachBtn}>
                <Feather name="plus" size={20} color="#7C5CFF" />
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder="Nhập tin nhắn..."
                value={draft}
                onChangeText={setDraft}
                multiline
              />
              <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
                <LinearGradient colors={['#7C5CFF', '#FF8FB1']} style={styles.sendGradient}>
                  <Feather name="send" size={18} color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FAF7FF' },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(124, 92, 255, 0.08)',
  },
  userInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  userName: { fontSize: 16, fontWeight: '700', color: '#1B1530' },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981', marginRight: 4 },
  statusText: { fontSize: 11, color: '#A29DBA' },
  iconButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  
  listContent: { padding: 16, paddingBottom: 20 },
  messageWrapper: { marginBottom: 16, maxWidth: '80%' },
  myWrapper: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  otherWrapper: { alignSelf: 'flex-start', alignItems: 'flex-start' },
  bubble: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18 },
  myBubble: { backgroundColor: '#7C5CFF', borderBottomRightRadius: 4 },
  otherBubble: { backgroundColor: '#FFFFFF', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: 'rgba(124, 92, 255, 0.1)' },
  messageText: { fontSize: 15, lineHeight: 21 },
  myText: { color: '#FFFFFF' },
  otherText: { color: '#1B1530' },
  timeText: { fontSize: 10, color: '#A29DBA', marginTop: 4 },

  composerWrap: { padding: 12, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: 'rgba(124, 92, 255, 0.08)' },
  composer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FE', borderRadius: 24, paddingHorizontal: 8, paddingVertical: 6 },
  attachBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  input: { flex: 1, paddingHorizontal: 12, fontSize: 15, color: '#1B1530', maxHeight: 100 },
  sendBtn: { marginLeft: 8 },
  sendGradient: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
});

export default ChatDetailScreen;
