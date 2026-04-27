import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  ActivityIndicator, 
  Dimensions, 
  TouchableOpacity,
  RefreshControl,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Header from '../common/Header';
import SearchBar from '../common/SearchBar';
import Categories, { Category } from '../common/Categories';
import Banner from '../common/Banner';
import SearchDetail from '../screen/SearchDetail';
import SectionHeader from '../common/SectionHeader';
import ProductCard, { Product } from '../common/ProductCard';
import SpecialOffer from '../common/SpecialOffer';
import PromotionBanner from '../common/PromotionBanner';
import WishlistBanner from '../common/WishlistBanner';
import NewArrivalsCard from '../common/NewArrivalsCard';
import { getProducts, getFeaturedProducts, ProductDTO, formatPrice, formatSold } from '../../lib/productApi';
import { userApi, UserProfileDTO } from '../../lib/userApi';

const categories: Category[] = [
  {
    id: 1,
    name: 'Thân Thiết',
    icon: { library: 'MaterialCommunityIcons', name: 'medal-outline', color: '#F73658', size: 28 },
    bgColor: '#fff',
  },
  {
    id: 2,
    name: 'Mã Giảm Giá',
    icon: { library: 'MaterialCommunityIcons', name: 'ticket-percent-outline', color: '#F73658', size: 28 },
    bgColor: '#fff',
  },
  {
    id: 3,
    name: 'Đồ Trẻ Em',
    icon: { library: 'MaterialIcons', name: 'child-care', color: '#F73658', size: 28 },
    bgColor: '#fff',
  },
  {
    id: 4,
    name: 'Thời Trang',
    icon: { library: 'Ionicons', name: 'shirt-outline', color: '#F73658', size: 26 },
    bgColor: '#fff',
  },
  {
    id: 5,
    name: 'Quà Tặng',
    icon: { library: 'MaterialCommunityIcons', name: 'gift-outline', color: '#F73658', size: 28 },
    bgColor: '#fff',
  },
];

function toCardProduct(dto: ProductDTO): Product {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description || '',
    price: formatPrice(dto.price),
    originalPrice: dto.originalPrice ? formatPrice(dto.originalPrice) : undefined,
    discount: dto.discount > 0 ? `Giảm ${dto.discount}%` : undefined,
    rating: dto.rating,
    reviews: formatSold(dto.soldQuantity),
    image: dto.image ? { uri: dto.image } : require('../../assets/images/Group 34010.png'),
  };
}

const HomePage = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserProfileDTO | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newestProducts, setNewestProducts] = useState<Product[]>([]);
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const { width } = Dimensions.get('window');

  const loadData = useCallback(async () => {
    try {
      const [profile, featured, newest, suggested] = await Promise.all([
        userApi.getProfile().catch(() => null),
        getFeaturedProducts(6),
        getProducts({ page: 1, pageSize: 6, sort: 'newest' }),
        getProducts({ page: 1, pageSize: 6, sort: 'popular' }),
      ]);

      if (profile) setUser(profile);
      setFeaturedProducts(featured.map(toCardProduct));
      setNewestProducts(newest.data.map(toCardProduct));
      setSuggestedProducts(suggested.data.map(toCardProduct));
    } catch (err) {
      console.log('Failed to load home data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleSort = () => {
    const options = [
      { text: 'Mới nhất', value: 'newest' },
      { text: 'Giá thấp đến cao', value: 'price_asc' },
      { text: 'Giá cao đến thấp', value: 'price_desc' },
      { text: 'Phổ biến nhất', value: 'popular' },
      { text: 'Hủy', value: 'cancel', style: 'cancel' as const },
    ];

    require('react-native').Alert.alert(
      'Sắp xếp theo',
      'Chọn tiêu chí sắp xếp cho sản phẩm',
      options.map(opt => ({
        text: opt.text,
        style: opt.style,
        onPress: () => {
          if (opt.value !== 'cancel') {
            router.push(`/search?sort=${opt.value}` as any);
          }
        }
      }))
    );
  };

  const handleFilter = () => {
    const options = [
      { text: 'Tất cả danh mục', id: null },
      { text: 'Thời Trang Nam', id: 4 },
      { text: 'Thời Trang Nữ', id: 5 },
      { text: 'Đồ Trẻ Em', id: 3 },
      { text: 'Quà Tặng', id: 6 },
      { text: 'Hủy', id: 'cancel', style: 'cancel' as const },
    ];

    require('react-native').Alert.alert(
      'Lọc theo danh mục',
      'Chọn danh mục bạn muốn tìm kiếm',
      options.map(opt => ({
        text: opt.text,
        style: opt.style as any,
        onPress: () => {
          if (opt.id !== 'cancel') {
            const url = opt.id ? `/search?categoryId=${opt.id}` : '/search';
            router.push(url as any);
          }
        }
      }))
    );
  };

  const handleProductPress = (product: Product) => {
    router.push(`/product/${product.id}` as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <Header 
        userName={user?.name} 
        avatarUrl={user?.avatarUrl}
        onMessagePress={() => router.push('/chat')}
        onProfilePress={() => router.push('/(tabs)/settings')}
      />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#F73658']} />}
      >
        <TouchableOpacity 
          onPress={() => setIsSearchVisible(true)} 
          activeOpacity={0.9}
          style={styles.searchWrapper}
        >
          <View pointerEvents="none">
            <SearchBar
              placeholder="Tìm kiếm sản phẩm, thương hiệu..."
              editable={false}
            />
          </View>
        </TouchableOpacity>

        <Categories 
          categories={categories} 
          onSortPress={handleSort}
          onFilterPress={handleFilter}
        />

        <Banner
          title="Siêu Sale Mùa Hè"
          subtitle="Giảm giá lên đến 50%"
          detail="Áp dụng cho toàn bộ ngành hàng thời trang"
          image={require('../../assets/images/slash/sales.png')}
        />

        <SectionHeader
          title="Deal Chớp Nhoáng"
          timerText="Kết thúc sau 02:55:20"
          isBlueVariant={false}
          onViewAllPress={() => { }}
        />

        {loading && !refreshing ? (
          <ActivityIndicator size="large" color="#F73658" style={{ marginVertical: 20 }} />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          >
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} isHorizontal={true} onPress={handleProductPress} />
            ))}
          </ScrollView>
        )}

        <SpecialOffer
          title="Ưu Đãi Đặc Biệt"
          description="Chúng tôi đảm bảo bạn sẽ nhận được mức giá tốt nhất thị trường"
          emoji="😱"
        />

        <PromotionBanner
          title="Tai nghe Sony XM5"
          subtitle="Chống ồn đỉnh cao"
          buttonText="Mua Ngay"
          image={require('../../assets/images/slash/shopping.png')}
        />

        <WishlistBanner onPress={() => router.push('/(tabs)/wishlist')} />

        <SectionHeader
          title="Sản phẩm mới nhất"
          onViewAllPress={() => { }}
        />

        {loading && !refreshing ? (
          <ActivityIndicator size="large" color="#F73658" style={{ marginVertical: 20 }} />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          >
            {newestProducts.map((product) => (
              <ProductCard key={product.id} product={product} isHorizontal={true} onPress={handleProductPress} />
            ))}
          </ScrollView>
        )}

        <NewArrivalsCard
          title="Hàng Mới Về"
          subtitle="Bộ sưu tập Hè 2026"
          onViewAll={() => { }}
          image={require('../../assets/images/slash/shop.png')}
        />

        <SectionHeader
          title="Gợi ý dành cho bạn"
          onViewAllPress={() => router.push('/search')}
        />

        {loading && !refreshing ? (
          <ActivityIndicator size="large" color="#F73658" style={{ marginVertical: 20 }} />
        ) : (
          <View style={styles.masonryContainer}>
            <View style={[styles.column, { width: (width - 40) / 2 }]}>
              {suggestedProducts.filter((_, i) => i % 2 === 0).map((product) => (
                <ProductCard key={product.id} product={product} isMasonry={true} onPress={handleProductPress} />
              ))}
            </View>
            <View style={[styles.column, { width: (width - 40) / 2 }]}>
              {suggestedProducts.filter((_, i) => i % 2 !== 0).map((product) => (
                <ProductCard key={product.id} product={product} isMasonry={true} onPress={handleProductPress} />
              ))}
            </View>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      <SearchDetail
        visible={isSearchVisible}
        onClose={() => setIsSearchVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchWrapper: {
    marginTop: 8,
  },
  horizontalList: {
    paddingHorizontal: 16,
    marginTop: 8,
    paddingBottom: 8,
  },
  masonryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 12,
    justifyContent: 'space-between',
  },
  column: {
    flexDirection: 'column',
  },
});

export default HomePage;
