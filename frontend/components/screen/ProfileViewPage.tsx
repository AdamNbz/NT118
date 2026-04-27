import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { userApi, UserProfileDTO, UserAddressDTO } from '../../lib/userApi';
import { useFocusEffect } from '@react-navigation/native';

const ProfileViewPage = () => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [profile, setProfile] = React.useState<UserProfileDTO | null>(null);
  const [addresses, setAddresses] = React.useState<UserAddressDTO[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [profileData, addressData] = await Promise.all([
        userApi.getProfile(),
        userApi.getAddresses()
      ]);
      setProfile(profileData);
      setAddresses(addressData);
    } catch (error) {
      console.error('Failed to fetch profile data:', error);
      Alert.alert('Lỗi', 'Không thể tải thông tin cá nhân.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch on initial load AND when returning from edit page
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#F73658" />
      </SafeAreaView>
    );
  }

  const infoFields = [
    { icon: 'person-outline' as const, label: 'Họ tên', value: profile?.name || 'Chưa cập nhật' },
    { icon: 'male-female-outline' as const, label: 'Giới tính', value: profile?.gender || 'Chưa cập nhật' },
    { icon: 'calendar-outline' as const, label: 'Ngày sinh', value: profile?.dateOfBirth || 'Chưa cập nhật' },
    { icon: 'call-outline' as const, label: 'Số điện thoại', value: profile?.phone || 'Chưa cập nhật' },
    { icon: 'mail-outline' as const, label: 'Email', value: profile?.email || 'Chưa cập nhật' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Thông tin cá nhân</Text>
          <TouchableOpacity onPress={() => router.push('/profile-edit' as any)} style={styles.editHeaderBtn}>
            <Feather name="edit-2" size={18} color="#F73658" />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarRing}>
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={50} color="#cbd5e1" />
            </View>
          </View>
          <Text style={styles.profileName}>{profile?.name || 'Người dùng'}</Text>
          <Text style={styles.profileEmail}>{profile?.email || ''}</Text>
        </View>

        {/* Personal Info Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Thông tin</Text>
          </View>

          {infoFields.map((field, index) => (
            <View
              key={field.label}
              style={[
                styles.infoRow,
                index < infoFields.length - 1 && styles.infoRowBorder
              ]}
            >
              <View style={styles.infoLeft}>
                <View style={styles.infoIconWrap}>
                  <Ionicons name={field.icon} size={18} color="#6b7280" />
                </View>
                <Text style={styles.infoLabel}>{field.label}</Text>
              </View>
              <Text style={[
                styles.infoValue,
                field.value === 'Chưa cập nhật' && styles.infoValueEmpty
              ]}>
                {field.value}
              </Text>
            </View>
          ))}
        </View>

        {/* Addresses Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Địa chỉ giao hàng</Text>
            <TouchableOpacity onPress={() => router.push('/address/add' as any)}>
              <Ionicons name="add-circle-outline" size={22} color="#F73658" />
            </TouchableOpacity>
          </View>

          {addresses.length === 0 ? (
            <View style={styles.emptyAddress}>
              <Ionicons name="location-outline" size={32} color="#d1d5db" />
              <Text style={styles.emptyText}>Chưa có địa chỉ nào</Text>
              <TouchableOpacity
                style={styles.addAddressBtn}
                onPress={() => router.push('/address/add' as any)}
              >
                <Text style={styles.addAddressBtnText}>Thêm địa chỉ</Text>
              </TouchableOpacity>
            </View>
          ) : (
            addresses.map((addr, index) => (
              <View
                key={addr.id}
                style={[
                  styles.addressCard,
                  index < addresses.length - 1 && { marginBottom: 10 }
                ]}
              >
                <View style={styles.addressHeader}>
                  <View style={styles.addressLabelRow}>
                    <Ionicons name="location" size={16} color="#F73658" />
                    {addr.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultBadgeText}>Mặc định</Text>
                      </View>
                    )}
                  </View>
                  <TouchableOpacity onPress={() => router.push({ pathname: '/address/edit' as any, params: { id: addr.id } })}>
                    <Feather name="edit" size={14} color="#9ca3af" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.addressText} numberOfLines={2}>
                  {addr.streetAddress}, {addr.ward}, {addr.district}, {addr.province}
                </Text>
              </View>
            ))
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cài đặt tài khoản</Text>

          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => router.push('/profile-edit' as any)}
          >
            <View style={styles.actionLeft}>
              <View style={[styles.actionIconWrap, { backgroundColor: '#FFF1F3' }]}>
                <Feather name="edit-3" size={16} color="#F73658" />
              </View>
              <Text style={styles.actionText}>Chỉnh sửa thông tin</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionRow, styles.actionRowBorder]}
            onPress={() => router.push('/product-history' as any)}
          >
            <View style={styles.actionLeft}>
              <View style={[styles.actionIconWrap, { backgroundColor: '#EEF2FF' }]}>
                <Ionicons name="time-outline" size={16} color="#6366f1" />
              </View>
              <Text style={styles.actionText}>Sản phẩm đã xem</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fb',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  editHeaderBtn: {
    padding: 4,
  },
  // Profile Card
  profileCard: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  avatarRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#F73658',
    padding: 3,
    marginBottom: 14,
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '500',
  },
  // Section
  section: {
    backgroundColor: '#fff',
    marginTop: 10,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 4,
  },
  // Info rows
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  infoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
    maxWidth: '50%',
    textAlign: 'right',
  },
  infoValueEmpty: {
    color: '#d1d5db',
    fontStyle: 'italic',
  },
  // Address
  addressCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    padding: 14,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  addressLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  defaultBadge: {
    backgroundColor: '#FFF1F3',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#F73658',
  },
  addressText: {
    fontSize: 13,
    color: '#4b5563',
    lineHeight: 18,
    marginLeft: 22,
  },
  emptyAddress: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
    marginBottom: 14,
  },
  addAddressBtn: {
    backgroundColor: '#FFF1F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addAddressBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F73658',
  },
  // Action rows
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  actionRowBorder: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
  },
});

export default ProfileViewPage;
