import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import InfoInput from '../common/InfoInput';
import { useRouter } from 'expo-router';
import { userApi, UserProfileDTO, UserAddressDTO } from '../../lib/userApi';
import { Alert, ActivityIndicator } from 'react-native';

const { width } = Dimensions.get('window');

const ProfilePage = () => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [profile, setProfile] = React.useState<UserProfileDTO | null>(null);
  const [addresses, setAddresses] = React.useState<UserAddressDTO[]>([]);
  const [passwordModalVisible, setPasswordModalVisible] = React.useState(false);

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

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    try {
      setSaving(true);
      await userApi.updateProfile({
        name: profile.name,
        phone: profile.phone || undefined,
        gender: profile.gender || undefined,
        dateOfBirth: profile.dateOfBirth || undefined,
      });
      Alert.alert('Thành công', 'Đã cập nhật thông tin cá nhân.');
    } catch (error) {
      console.error('Failed to update profile:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật thông tin.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAddress = async (id: number) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa địa chỉ này?',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xóa', 
          style: 'destructive',
          onPress: async () => {
            try {
              await userApi.deleteAddress(id);
              setAddresses(prev => prev.filter(a => a.id !== id));
            } catch (error) {
              console.error('Failed to delete address:', error);
              Alert.alert('Lỗi', 'Không thể xóa địa chỉ.');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#F73658" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Thông tin cá nhân</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Profile Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarWrapper}>
            <Image 
              source={require('../../assets/images/homepage/icons/Ellipse 6.svg')} 
              style={styles.avatar} 
            />
            <TouchableOpacity style={styles.editAvatarBtn}>
              <MaterialCommunityIcons name="pencil" size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          <InfoInput 
            label="Tên" 
            value={profile?.name || ''} 
            onChangeText={(text) => profile && setProfile({...profile, name: text})} 
          />
          <InfoInput 
            label="Giới tính" 
            value={profile?.gender || ''} 
            onChangeText={(text) => profile && setProfile({...profile, gender: text})} 
          />
          <InfoInput 
            label="Ngày sinh" 
            value={profile?.dateOfBirth || ''} 
            onChangeText={(text) => profile && setProfile({...profile, dateOfBirth: text})} 
          />
          <InfoInput 
            label="Số điện thoại" 
            value={profile?.phone || ''} 
            onChangeText={(text) => profile && setProfile({...profile, phone: text})} 
          />
          <InfoInput 
            label="Email" 
            value={profile?.email || ''} 
            editable={false}
          />
        </View>

        {/* Address Section */}
        <View style={styles.addressSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location-outline" size={18} color="black" />
            <Text style={styles.sectionTitle}>Địa chỉ giao hàng</Text>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.addressCards}>
            {addresses.map((addr) => (
              <View key={addr.id} style={styles.addressCard}>
                <View style={styles.addressCardHeader}>
                  <Text style={styles.addressLabel}>{addr.isDefault ? 'Mặc định' : 'Địa chỉ'} :</Text>
                  <View style={styles.addressActions}>
                    <TouchableOpacity onPress={() => router.push({ pathname: '/address/edit' as any, params: { id: addr.id } })}>
                      <Feather name="edit" size={14} color="#676767" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteAddress(addr.id)} style={{ marginLeft: 8 }}>
                      <Feather name="trash-2" size={14} color="#F73658" />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.addressText} numberOfLines={2}>
                  {addr.streetAddress}, {addr.ward}, {addr.district}, {addr.province}
                </Text>
              </View>
            ))}

            <TouchableOpacity 
              style={styles.addAddressCard}
              onPress={() => router.push('/address/add' as any)}
            >
              <Ionicons name="add-circle-outline" size={32} color="black" />
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Seller Mode Entry */}
        <View style={styles.sellerSection}>
          <TouchableOpacity 
            style={styles.sellerButton}
            onPress={() => router.push('/seller-dashboard')}
          >
            <View style={styles.sellerButtonLeft}>
              <MaterialCommunityIcons name="storefront-outline" size={24} color="#F73658" />
              <Text style={styles.sellerButtonText}>Kênh người bán</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#676767" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.sellerButton, { borderTopWidth: 1, borderTopColor: '#FFEBEE' }]}
            onPress={() => router.push('/register-shop' as any)}
          >
            <View style={styles.sellerButtonLeft}>
              <Ionicons name="storefront-outline" size={24} color="#10b981" />
              <Text style={styles.sellerButtonText}>Đăng ký bán hàng</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#676767" />
          </TouchableOpacity>
        </View>

        {/* Activity & Security Section */}
        <View style={styles.securitySection}>
          <TouchableOpacity 
            style={styles.securityButton}
            onPress={() => router.push('/product-history' as any)}
          >
            <View style={styles.securityButtonLeft}>
              <Ionicons name="time-outline" size={20} color="#676767" />
              <Text style={styles.securityButtonText}>Sản phẩm đã xem</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#676767" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.securityButton, { borderTopWidth: 1, borderTopColor: '#EEE' }]}
            onPress={() => setPasswordModalVisible(true)}
          >
            <View style={styles.securityButtonLeft}>
              <Ionicons name="lock-closed-outline" size={20} color="#676767" />
              <Text style={styles.securityButtonText}>Đổi mật khẩu</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#676767" />
          </TouchableOpacity>
        </View>

        {/* Save Button */}
        <TouchableOpacity 
          style={[styles.saveButton, saving && { opacity: 0.7 }]} 
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
          )}
        </TouchableOpacity>

        {/* Change Password Modal */}
        <PasswordModal 
          visible={passwordModalVisible}
          onClose={() => setPasswordModalVisible(false)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#000',
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  avatarWrapper: {
    width: 96,
    height: 96,
    position: 'relative',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 48,
    borderWidth: 1,
    borderColor: '#4392F9',
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4392F9',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  form: {
    paddingHorizontal: 24,
  },
  addressSection: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#000',
  },
  addressCards: {
    flexDirection: 'row',
    gap: 12,
  },
  addressCard: {
    flex: 3,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    width: 200,
    marginRight: 4,
  },
  addressCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressLabel: {
    fontSize: 12,
    fontFamily: 'Montserrat_500Medium',
    color: '#000',
  },
  addressText: {
    fontSize: 12,
    fontFamily: 'Montserrat_400Regular',
    color: '#000',
    lineHeight: 16,
  },
  addAddressCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    height: 80,
  },
  saveButton: {
    backgroundColor: '#F73658',
    marginHorizontal: 24,
    marginTop: 40,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Montserrat_600SemiBold',
  },
  sellerSection: {
    marginHorizontal: 24,
    marginTop: 24,
    backgroundColor: '#FFF5F6',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFEBEE',
  },
  sellerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  sellerButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sellerButtonText: {
    fontSize: 15,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#000',
  },
  securitySection: {
    marginHorizontal: 24,
    marginTop: 12,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
  },
  securityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  securityButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  securityButtonText: {
    fontSize: 15,
    fontFamily: 'Montserrat_500Medium',
    color: '#000',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  confirmButton: {
    backgroundColor: '#F73658',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontWeight: '600',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  input: {
    height: 48,
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: '#000',
  },
});

// --- Internal Password Modal Component ---
import { Modal, TextInput as RNTextInput } from 'react-native';

const PasswordModal = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
  const [oldPassword, setOldPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp.');
      return;
    }
    try {
      setLoading(true);
      await userApi.changePassword({ oldPassword, newPassword });
      Alert.alert('Thành công', 'Đổi mật khẩu thành công.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onClose();
    } catch (error) {
      console.error('Change password error:', error);
      Alert.alert('Lỗi', 'Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu cũ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Đổi mật khẩu</Text>
          
          <RNTextInput 
            style={[styles.input, { borderBottomWidth: 1, borderColor: '#EEE', marginBottom: 16 }]}
            placeholder="Mật khẩu cũ"
            secureTextEntry
            value={oldPassword}
            onChangeText={setOldPassword}
          />
          <RNTextInput 
            style={[styles.input, { borderBottomWidth: 1, borderColor: '#EEE', marginBottom: 16 }]}
            placeholder="Mật khẩu mới"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <RNTextInput 
            style={[styles.input, { borderBottomWidth: 1, borderColor: '#EEE', marginBottom: 16 }]}
            placeholder="Xác nhận mật khẩu mới"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={handleSubmit} disabled={loading}>
              {loading ? <ActivityIndicator color="white" /> : <Text style={styles.confirmButtonText}>Xác nhận</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ProfilePage;
