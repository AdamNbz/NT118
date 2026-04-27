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
  Modal,
  Alert,
  ActivityIndicator,
  Platform,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { adminApi, AdminVoucherDTO, CreateVoucherRequest } from '@/lib/adminApi';

const VoucherManagementScreen: React.FC = () => {
  const [vouchers, setVouchers] = useState<AdminVoucherDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<AdminVoucherDTO | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'active' | 'inactive'>('all');

  // Form state
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [minOrderValue, setMinOrderValue] = useState('');
  const [usageLimit, setUsageLimit] = useState('');
  const [isActive, setIsActive] = useState(true);

  const fetchVouchers = useCallback(async () => {
    try {
      const data = await adminApi.getVouchers();
      setVouchers(data);
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Không thể tải voucher');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchVouchers();
  }, [fetchVouchers]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchVouchers();
  }, [fetchVouchers]);

  const filteredVouchers = useMemo(() => {
    return vouchers.filter(v => {
      const matchesSearch = v.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            v.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterType === 'all' || 
                            (filterType === 'active' && v.isActive) || 
                            (filterType === 'inactive' && !v.isActive);
      return matchesSearch && matchesFilter;
    });
  }, [vouchers, searchQuery, filterType]);

  const handleOpenModal = (voucher?: AdminVoucherDTO) => {
    if (voucher) {
      setEditingVoucher(voucher);
      setCode(voucher.code);
      setName(voucher.name);
      setDiscountType(voucher.discountType);
      setDiscountValue(voucher.discountValue.toString());
      setMinOrderValue(voucher.minOrderValue?.toString() || '');
      setUsageLimit(voucher.usageLimit?.toString() || '');
      setIsActive(voucher.isActive);
    } else {
      setEditingVoucher(null);
      setCode('');
      setName('');
      setDiscountType('percentage');
      setDiscountValue('');
      setMinOrderValue('');
      setUsageLimit('');
      setIsActive(true);
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!code.trim() || !name.trim() || !discountValue.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ các trường bắt buộc');
      return;
    }

    try {
      const payload: CreateVoucherRequest = {
        code: code.toUpperCase(),
        name,
        discountType,
        discountValue: parseFloat(discountValue) || 0,
        minOrderValue: parseFloat(minOrderValue) || undefined,
        usageLimit: parseInt(usageLimit) || undefined,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        isActive,
      };

      if (editingVoucher) {
        await adminApi.updateVoucher(editingVoucher.id, payload);
        Alert.alert('Thành công', 'Cập nhật voucher thành công');
      } else {
        await adminApi.createVoucher(payload);
        Alert.alert('Thành công', 'Tạo voucher thành công');
      }
      setModalVisible(false);
      fetchVouchers();
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Không thể lưu voucher');
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa voucher này vĩnh viễn?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await adminApi.deleteVoucher(id);
              fetchVouchers();
            } catch (error: any) {
              Alert.alert('Lỗi', error.message || 'Không thể xóa voucher');
            }
          },
        },
      ]
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#F73658" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Quản lý Voucher</Text>
          <Text style={styles.headerSubtitle}>Mã giảm giá toàn hệ thống</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => handleOpenModal()}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'active', label: 'Đang chạy' },
            { id: 'inactive', label: 'Đã dừng' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.filterTab, filterType === tab.id && styles.filterTabActive]}
              onPress={() => setFilterType(tab.id as any)}
            >
              <Text style={[styles.filterTabText, filterType === tab.id && styles.filterTabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInner}>
          <Ionicons name="search" size={18} color="#94a3b8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm theo mã hoặc tên..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {filteredVouchers.map((item) => (
          <View key={item.id} style={[styles.voucherCard, !item.isActive && styles.voucherCardDisabled]}>
            <View style={[styles.voucherSide, { backgroundColor: item.isActive ? '#F73658' : '#cbd5e1' }]}>
              <Ionicons name="gift-outline" size={24} color="#fff" />
            </View>
            
            <View style={styles.voucherContent}>
              <View style={styles.voucherHeader}>
                <Text style={styles.voucherCode}>{item.code}</Text>
                <View style={[styles.dot, { backgroundColor: item.isActive ? '#10b981' : '#ef4444' }]} />
              </View>
              <Text style={styles.voucherName} numberOfLines={1}>{item.name}</Text>
              
              <View style={styles.discountRow}>
                <Text style={styles.discountValue}>
                  {item.discountType === 'percentage' ? `-${item.discountValue}%` : `-${formatCurrency(item.discountValue)}`}
                </Text>
                <Text style={styles.minOrder}>Đơn từ {formatCurrency(item.minOrderValue || 0)}</Text>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Ionicons name="people-outline" size={14} color="#64748b" />
                  <Text style={styles.statText}>{item.usedCount} lượt dùng</Text>
                </View>
                {item.usageLimit && (
                  <Text style={styles.statLimit}>Giới hạn: {item.usageLimit}</Text>
                )}
              </View>

              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.editBtn} onPress={() => handleOpenModal(item)}>
                  <Ionicons name="create-outline" size={18} color="#3b82f6" />
                  <Text style={styles.editBtnText}>Chỉnh sửa</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
                  <Ionicons name="trash-outline" size={18} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
        
        {filteredVouchers.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="ticket-outline" size={64} color="#e2e8f0" />
            <Text style={styles.emptyText}>Không tìm thấy voucher phù hợp</Text>
          </View>
        )}
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingVoucher ? 'Cập nhật Voucher' : 'Tạo mới Voucher'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeModalBtn}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalForm}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Mã Voucher (viết liền, không dấu)</Text>
                <TextInput
                  style={styles.input}
                  value={code}
                  onChangeText={setCode}
                  placeholder="Vd: GIAM50K"
                  autoCapitalize="characters"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Tên hiển thị</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Vd: Ưu đãi hè rực rỡ"
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.formGroup, { flex: 1.2, marginRight: 12 }]}>
                  <Text style={styles.label}>Loại giảm giá</Text>
                  <View style={styles.toggleGroup}>
                    <TouchableOpacity
                      style={[styles.toggleBtn, discountType === 'percentage' && styles.toggleBtnActive]}
                      onPress={() => setDiscountType('percentage')}
                    >
                      <Text style={[styles.toggleText, discountType === 'percentage' && styles.toggleTextActive]}>%</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.toggleBtn, discountType === 'fixed_amount' && styles.toggleBtnActive]}
                      onPress={() => setDiscountType('fixed_amount')}
                    >
                      <Text style={[styles.toggleText, discountType === 'fixed_amount' && styles.toggleTextActive]}>đ</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={[styles.formGroup, { flex: 2 }]}>
                  <Text style={styles.label}>Giá trị giảm</Text>
                  <TextInput
                    style={styles.input}
                    value={discountValue}
                    onChangeText={setDiscountValue}
                    keyboardType="numeric"
                    placeholder="0"
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Giá trị đơn hàng tối thiểu (đ)</Text>
                <TextInput
                  style={styles.input}
                  value={minOrderValue}
                  onChangeText={setMinOrderValue}
                  keyboardType="numeric"
                  placeholder="0"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Giới hạn tổng số lượt dùng</Text>
                <TextInput
                  style={styles.input}
                  value={usageLimit}
                  onChangeText={setUsageLimit}
                  keyboardType="numeric"
                  placeholder="Không giới hạn"
                />
              </View>

              <View style={styles.switchRow}>
                <View>
                  <Text style={styles.switchLabel}>Kích hoạt chương trình</Text>
                  <Text style={styles.switchSub}>Người dùng có thể thấy và sử dụng mã này ngay</Text>
                </View>
                <Switch
                  value={isActive}
                  onValueChange={setIsActive}
                  trackColor={{ false: '#e2e8f0', true: '#fecaca' }}
                  thumbColor={isActive ? '#F73658' : '#f8fafc'}
                />
              </View>

              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>Hoàn tất</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e293b',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#F73658',
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#F73658',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  filterContainer: {
    backgroundColor: '#fff',
    paddingVertical: 10,
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
    backgroundColor: '#F73658',
    borderColor: '#F73658',
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  filterTabTextActive: {
    color: '#fff',
  },
  searchContainer: {
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
  voucherCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    flexDirection: 'row',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  voucherCardDisabled: {
    opacity: 0.7,
  },
  voucherSide: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  voucherContent: {
    flex: 1,
    padding: 16,
  },
  voucherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  voucherCode: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
    letterSpacing: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  voucherName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  discountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 12,
  },
  discountValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F73658',
  },
  minOrder: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  statLimit: {
    fontSize: 11,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  cardActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
    justifyContent: 'space-between',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3b82f6',
  },
  deleteBtn: {
    padding: 4,
  },
  emptyState: {
    padding: 60,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 16,
    color: '#94a3b8',
    fontSize: 15,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
  },
  closeModalBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalForm: {
    padding: 24,
    paddingBottom: 40,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
    fontSize: 15,
    color: '#1e293b',
  },
  row: {
    flexDirection: 'row',
  },
  toggleGroup: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 4,
    height: 52,
  },
  toggleBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleBtnActive: {
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  toggleText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#64748b',
  },
  toggleTextActive: {
    color: '#F73658',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fdf2f2',
    padding: 16,
    borderRadius: 16,
    marginBottom: 32,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },
  switchSub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  saveBtn: {
    backgroundColor: '#F73658',
    height: 58,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#F73658',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
  },
});

export default VoucherManagementScreen;
