import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { adminApi, AdminShopDTO } from '@/lib/adminApi';
import { useRouter } from 'expo-router';

const ShopManagementScreen: React.FC = () => {
  const router = useRouter();
  const [shops, setShops] = useState<AdminShopDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'verified' | 'pending'>('all');

  const fetchShops = useCallback(async () => {
    try {
      const data = await adminApi.getShops();
      setShops(data);
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Không thể tải danh sách cửa hàng');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchShops();
  }, [fetchShops]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchShops();
  }, [fetchShops]);

  const filteredShops = useMemo(() => {
    return shops.filter(shop => {
      const matchesSearch = shop.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filter === 'all' || 
                            (filter === 'verified' && shop.isVerified) || 
                            (filter === 'pending' && !shop.isVerified);
      return matchesSearch && matchesFilter;
    });
  }, [shops, searchQuery, filter]);

  const handleToggleVerify = async (shop: AdminShopDTO) => {
    try {
      await adminApi.updateShop(shop.id, { isVerified: !shop.isVerified });
      Alert.alert('Thành công', `Đã ${shop.isVerified ? 'hủy xác minh' : 'xác minh'} cho shop ${shop.name}`);
      fetchShops();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật trạng thái xác minh');
    }
  };

  const handleToggleStatus = async (shop: AdminShopDTO) => {
    const newStatus = shop.status === 'active' ? 'banned' : 'active';
    try {
      await adminApi.updateShop(shop.id, { status: newStatus });
      Alert.alert('Thành công', `Đã ${newStatus === 'active' ? 'mở khóa' : 'khóa'} shop ${shop.name}`);
      fetchShops();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật trạng thái hoạt động');
    }
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#4392F9" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Quản lý cửa hàng</Text>
          <Text style={styles.headerSubtitle}>{shops.length} đối tác bán hàng</Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'verified', label: 'Đã xác minh' },
            { id: 'pending', label: 'Chờ xác minh' },
          ].map(item => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.filterTab, filter === item.id && styles.filterTabActive]}
              onPress={() => setFilter(item.id as any)}
            >
              <Text style={[styles.filterTabText, filter === item.id && styles.filterTabTextActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.searchBar}>
        <View style={styles.searchInner}>
          <Ionicons name="search" size={18} color="#94a3b8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm theo tên cửa hàng..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94a3b8"
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {filteredShops.map((shop) => (
          <View key={shop.id} style={styles.shopCard}>
            <View style={styles.cardHeader}>
              <View style={styles.shopIcon}>
                <Ionicons name="storefront" size={22} color="#4392F9" />
              </View>
              <View style={styles.shopMainInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.shopName}>{shop.name}</Text>
                  {shop.isVerified && (
                    <Ionicons name="checkmark-circle" size={16} color="#4392F9" />
                  )}
                </View>
                <Text style={styles.shopDate}>Gia nhập: {new Date(shop.createdAt).toLocaleDateString('vi-VN')}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: shop.status === 'active' ? '#dcfce7' : '#fee2e2' }]}>
                <Text style={[styles.statusText, { color: shop.status === 'active' ? '#166534' : '#991b1b' }]}>
                  {shop.status}
                </Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{shop.totalProducts}</Text>
                <Text style={styles.statLabel}>Sản phẩm</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{shop.rating}★</Text>
                <Text style={styles.statLabel}>Đánh giá</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>-</Text>
                <Text style={styles.statLabel}>Đơn hàng</Text>
              </View>
            </View>

            <View style={styles.cardActions}>
              <TouchableOpacity 
                style={[styles.actionBtn, { borderColor: '#e2e8f0' }]}
                onPress={() => handleToggleVerify(shop)}
              >
                <Ionicons name={shop.isVerified ? "shield-checkmark" : "shield-outline"} size={18} color="#64748b" />
                <Text style={styles.actionBtnText}>{shop.isVerified ? 'Hủy XM' : 'Xác minh'}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionBtn, { borderColor: shop.status === 'active' ? '#fee2e2' : '#dcfce7' }]}
                onPress={() => handleToggleStatus(shop)}
              >
                <Ionicons 
                  name={shop.status === 'active' ? "lock-closed-outline" : "lock-open-outline"} 
                  size={18} 
                  color={shop.status === 'active' ? '#ef4444' : '#10b981'} 
                />
                <Text style={[styles.actionBtnText, { color: shop.status === 'active' ? '#ef4444' : '#10b981' }]}>
                  {shop.status === 'active' ? 'Khóa Shop' : 'Mở khóa'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        
        {filteredShops.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="business-outline" size={64} color="#e2e8f0" />
            <Text style={styles.emptyText}>Không tìm thấy cửa hàng nào</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    fontWeight: '500',
  },
  filterSection: {
    backgroundColor: '#fff',
    paddingVertical: 12,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterTabActive: {
    backgroundColor: '#4392F9',
    borderColor: '#4392F9',
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  filterTabTextActive: {
    color: '#fff',
  },
  searchBar: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  searchInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#1e293b',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shopCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  shopIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  shopMainInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  shopName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  shopDate: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: '60%',
    backgroundColor: '#e2e8f0',
    alignSelf: 'center',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
  },
  emptyState: {
    padding: 60,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 16,
    color: '#94a3b8',
    fontSize: 15,
  },
});

export default ShopManagementScreen;
