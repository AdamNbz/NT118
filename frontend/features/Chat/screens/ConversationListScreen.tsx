import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import ConversationItem, { Conversation } from '../components/ConversationItem';
import { LinearGradient } from 'expo-linear-gradient';

const ConversationListScreen = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // Dữ liệu mẫu - Sẽ được thay thế bằng dữ liệu thật từ API sau
  const [conversations] = useState<Conversation[]>([
    {
      id: 'ai-assistant',
      name: 'Hỗ trợ khách hàng',
      lastMessage: 'Xin chào 👋 ShopeeLite có thể giúp gì cho bạn?',
      time: 'Vừa xong',
      isAI: true,
    },
    {
      id: '1',
      name: 'Shop Thời Trang Nam',
      lastMessage: 'Dạ sản phẩm này còn size L ạ.',
      time: '10:30',
      unreadCount: 2,
    },
    {
      id: '2',
      name: 'Phụ kiện SunSide',
      lastMessage: 'Cảm ơn bạn đã mua hàng!',
      time: 'Hôm qua',
    },
  ]);

  const filteredConversations = conversations.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePress = (item: Conversation) => {
    if (item.isAI) {
      router.push('/chat/ai');
    } else {
      router.push({
        pathname: '/chat/[id]',
        params: { id: item.id, name: item.name }
      });
    }
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#FAF7FF', '#F1F5FF']}
        style={StyleSheet.absoluteFill}
      />
      
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Feather name="chevron-left" size={24} color="#1B1530" />
          </TouchableOpacity>
          <Text style={styles.title}>Tin nhắn</Text>
          <TouchableOpacity style={styles.backButton}>
            <Feather name="edit" size={20} color="#1B1530" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Feather name="search" size={18} color="#A29DBA" />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm cuộc trò chuyện..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#A29DBA"
            />
          </View>
        </View>

        {/* List */}
        <FlatList
          data={filteredConversations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ConversationItem item={item} onPress={() => handlePress(item)} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="message-square" size={48} color="#E5E1F2" />
              <Text style={styles.emptyText}>Chưa có cuộc hội thoại nào</Text>
            </View>
          }
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1B1530',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7C5CFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
    marginTop: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    borderWidth: 1,
    borderColor: 'rgba(124, 92, 255, 0.1)',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#1B1530',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#A29DBA',
  },
});

export default ConversationListScreen;
