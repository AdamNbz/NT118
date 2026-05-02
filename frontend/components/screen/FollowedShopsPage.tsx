import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getFollowedShops, toggleFollowShop } from '../../lib/shopApi';
import { ShopDTO } from '../../lib/mockData';

const FollowedShopsPage = () => {
  const router = useRouter();
  const [shops, setShops] = useState<ShopDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadShops();
  }, []);

  const loadShops = async () => {
    try {
      setLoading(true);
      const data = await getFollowedShops();
      setShops(data);
    } catch (err) {
      console.error('Failed to load followed shops:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async (shopId: number) => {
    const success = await toggleFollowShop(shopId, true);
    if (success) {
      setShops(prev => prev.filter(s => s.id !== shopId));
    }
  };

  const renderShopItem = ({ item }: { item: ShopDTO }) => (
    <View style={styles.shopCard}>
      <TouchableOpacity 
        style={styles.shopInfo} 
        onPress={() => router.push(`/shop/${item.id}` as any)}
      >
        <View style={styles.logoContainer}>
          {item.logoUrl ? (
            <Image source={{ uri: item.logoUrl }} style={styles.logo} />
          ) : (
            <View style={[styles.logo, styles.placeholderLogo]}>
              <Text style={styles.placeholderText}>{item.name[0]}</Text>
            </View>
          )}
        </View>
        <View style={styles.nameContainer}>
          <View style={styles.nameRow}>
            <Text style={styles.shopName} numberOfLines={1}>{item.name}</Text>
            {item.isVerified && (
              <MaterialCommunityIcons name="check-decagram" size={16} color="#4CC9F0" />
            )}
          </View>
          <Text style={styles.shopStats}>{item.totalProducts} Sản phẩm | {item.rating} ★</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.unfollowButton}
        onPress={() => handleUnfollow(item.id)}
      >
        <Text style={styles.unfollowText}>Bỏ theo dõi</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F83758" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đang theo dõi</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={shops}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderShopItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-dislike-outline" size={80} color="#DDD" />
            <Text style={styles.emptyTitle}>Bạn chưa theo dõi shop nào</Text>
            <Text style={styles.emptySubtitle}>Hãy theo dõi các shop yêu thích để nhận thông báo mới nhất.</Text>
            <TouchableOpacity 
              style={styles.exploreButton}
              onPress={() => router.push('/')}
            >
              <Text style={styles.exploreButtonText}>Khám phá ngay</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  listContent: {
    padding: 12,
  },
  shopCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  shopInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: '#F0F0F0',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  placeholderLogo: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F83758',
  },
  placeholderText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  nameContainer: {
    flex: 1,
    marginLeft: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  shopName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  shopStats: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  unfollowButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  unfollowText: {
    fontSize: 12,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  exploreButton: {
    marginTop: 24,
    backgroundColor: '#F83758',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  exploreButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default FollowedShopsPage;
