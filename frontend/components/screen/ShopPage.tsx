import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Image, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import ProductCard from '../common/ProductCard';
import { getShopById, getShopProducts, toggleFollowShop } from '../../lib/shopApi';
import { ShopDTO } from '../../lib/mockData';
import { ProductDTO, formatPriceFull, formatSold } from '../../lib/productApi';

const { width } = Dimensions.get('window');

interface ShopPageProps {
  shopId: number;
}

const ShopPage: React.FC<ShopPageProps> = ({ shopId = 1 }) => {
  const router = useRouter();
  const [shop, setShop] = useState<ShopDTO | null>(null);
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'main', 'all', 'categories'

  useEffect(() => {
    loadShopData();
  }, [shopId]);

  const loadShopData = async () => {
    try {
      setLoading(true);
      const [shopData, productData] = await Promise.all([
        getShopById(shopId),
        getShopProducts(shopId)
      ]);
      setShop(shopData);
      setProducts(productData);
    } catch (err) {
      console.error('Failed to load shop data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    const success = await toggleFollowShop(shopId, isFollowing);
    if (success) {
      setIsFollowing(!isFollowing);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F83758" />
        <Text style={styles.loadingText}>Đang tải thông tin cửa hàng...</Text>
      </View>
    );
  }

  if (!shop) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#CCC" />
        <Text style={styles.errorText}>Không tìm thấy cửa hàng.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const formattedProducts = products.map(dto => ({
    id: dto.id,
    name: dto.name,
    description: dto.description || '',
    price: formatPriceFull(dto.price),
    originalPrice: dto.originalPrice ? formatPriceFull(dto.originalPrice) : undefined,
    discount: dto.discount > 0 ? `${dto.discount}% Off` : undefined,
    rating: dto.rating,
    reviews: formatSold(dto.soldQuantity),
    image: dto.image ? { uri: dto.image } : require('../../assets/images/Group 34010.png'),
    imageHeight: 180,
  }));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#999" />
          <Text style={styles.searchText}>Tìm kiếm trong shop</Text>
        </View>
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons name="share-social-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView stickyHeaderIndices={[2]} showsVerticalScrollIndicator={false}>
        {/* Shop Info Card */}
        <View style={styles.heroSection}>
          <Image 
            source={{ uri: shop.coverImageUrl || 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1000' }} 
            style={styles.coverImage} 
          />
          <View style={styles.overlay} />
          
          <View style={styles.shopMainInfo}>
            <View style={styles.logoContainer}>
              {shop.logoUrl ? (
                <Image source={{ uri: shop.logoUrl }} style={styles.logo} />
              ) : (
                <Text style={styles.logoPlaceholder}>{shop.name[0]}</Text>
              )}
            </View>
            <View style={styles.nameContainer}>
              <View style={styles.nameRow}>
                <Text style={styles.shopName}>{shop.name}</Text>
                {shop.isVerified && (
                  <MaterialCommunityIcons name="check-decagram" size={16} color="#4CC9F0" />
                )}
              </View>
              <Text style={styles.onlineStatus}>Online 5 phút trước</Text>
            </View>
            <TouchableOpacity 
              style={[styles.followButton, isFollowing && styles.followingButton]} 
              onPress={handleFollow}
            >
              <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
                {isFollowing ? 'Đang Theo dõi' : '+ Theo dõi'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{shop.rating}</Text>
              <Text style={styles.statLabel}>Đánh giá</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{shop.totalProducts}</Text>
              <Text style={styles.statLabel}>Sản phẩm</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>95%</Text>
              <Text style={styles.statLabel}>Phản hồi</Text>
            </View>
          </View>
        </View>

        {/* Vouchers Row */}
        <View style={styles.vouchersSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.vouchersScroll}>
            {[20, 50, 100].map(val => (
              <View key={val} style={styles.voucherCard}>
                <View style={styles.voucherLeft}>
                  <Text style={styles.voucherLabel}>Giảm</Text>
                  <Text style={styles.voucherAmount}>{val}k</Text>
                </View>
                <TouchableOpacity style={styles.voucherRight}>
                  <Text style={styles.voucherAction}>Lưu</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'main' && styles.activeTab]} 
            onPress={() => setActiveTab('main')}
          >
            <Text style={[styles.tabText, activeTab === 'main' && styles.activeTabText]}>Cửa hàng</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'all' && styles.activeTab]} 
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>Tất cả sản phẩm</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'categories' && styles.activeTab]} 
            onPress={() => setActiveTab('categories')}
          >
            <Text style={[styles.tabText, activeTab === 'categories' && styles.activeTabText]}>Danh mục</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.productsGrid}>
            {formattedProducts.map(item => (
              <ProductCard 
                key={item.id} 
                product={item as any} 
                onPress={(p) => router.push(`/product/${p.id}` as any)}
              />
            ))}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
      
      {/* Floating Chat Button */}
      <TouchableOpacity style={styles.chatFab}>
        <Ionicons name="chatbubble-ellipses" size={24} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginVertical: 20,
  },
  backButton: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    backgroundColor: '#F83758',
    borderRadius: 20,
  },
  backButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#F83758',
    gap: 12,
  },
  headerIcon: {
    padding: 4,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    height: 36,
    borderRadius: 4,
    paddingHorizontal: 10,
    gap: 8,
  },
  searchText: {
    color: '#EEE',
    fontSize: 13,
  },
  heroSection: {
    height: 180,
    position: 'relative',
    backgroundColor: '#333',
  },
  coverImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.6,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  shopMainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 40,
    gap: 12,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  logoPlaceholder: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F83758',
  },
  nameContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  shopName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  onlineStatus: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  followButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#FFF',
    borderRadius: 4,
  },
  followingButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderColor: 'transparent',
  },
  followButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  followingButtonText: {
    color: '#DDD',
  },
  statsRow: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 12,
    left: 16,
    right: 16,
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFF',
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
  },
  statDivider: {
    width: 1,
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignSelf: 'center',
  },
  vouchersSection: {
    backgroundColor: '#FFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  vouchersScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  voucherCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF8F9',
    borderWidth: 1,
    borderColor: '#F83758',
    borderRadius: 4,
    height: 50,
  },
  voucherLeft: {
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#F83758',
    borderStyle: 'dashed',
  },
  voucherLabel: {
    fontSize: 9,
    color: '#F83758',
  },
  voucherAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F83758',
  },
  voucherRight: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    backgroundColor: '#F83758',
  },
  voucherAction: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#F83758',
  },
  tabText: {
    fontSize: 13,
    color: '#666',
  },
  activeTabText: {
    color: '#F83758',
    fontWeight: 'bold',
  },
  content: {
    padding: 8,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  chatFab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F83758',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default ShopPage;
