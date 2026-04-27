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
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { adminApi, AdminUserDTO } from '@/lib/adminApi';
import { useRouter } from 'expo-router';

const UserManagementScreen: React.FC = () => {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUserDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [editingUser, setEditingUser] = useState<AdminUserDTO | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newRole, setNewRole] = useState('');

  const fetchUsers = useCallback(async () => {
    try {
      const data = await adminApi.getUsers();
      setUsers(data);
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const handleEditRole = (user: AdminUserDTO) => {
    setEditingUser(user);
    setNewRole(user.role);
    setModalVisible(true);
  };

  const handleUpdateRole = async () => {
    if (!editingUser) return;
    try {
      await adminApi.updateUser(editingUser.id, { role: newRole });
      Alert.alert('Thành công', `Đã cập nhật quyền cho ${editingUser.username}`);
      setModalVisible(false);
      fetchUsers();
    } catch (error: any) {
      Alert.alert('Lỗi', 'Không thể cập nhật quyền người dùng');
    }
  };

  const handleDeleteUser = (user: AdminUserDTO) => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa tài khoản "${user.username}" vĩnh viễn?`,
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xóa', 
          style: 'destructive',
          onPress: async () => {
            try {
              await adminApi.deleteUser(user.id);
              fetchUsers();
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể xóa người dùng');
            }
          }
        }
      ]
    );
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
          <Text style={styles.headerTitle}>Quản lý người dùng</Text>
          <Text style={styles.headerSubtitle}>{users.length} thành viên</Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.searchBar}>
        <View style={styles.searchInner}>
          <Ionicons name="search" size={20} color="#94a3b8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm theo tên hoặc email..."
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
        {filteredUsers.map((user) => (
          <View key={user.id} style={styles.userCard}>
            <View style={[styles.avatar, { backgroundColor: user.role === 'admin' ? '#fee2e2' : '#e0f2fe' }]}>
              <Text style={[styles.avatarText, { color: user.role === 'admin' ? '#ef4444' : '#0ea5e9' }]}>
                {user.username.charAt(0).toUpperCase()}
              </Text>
            </View>
            
            <View style={styles.userInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.username}>{user.username}</Text>
                <View style={[styles.roleBadge, { backgroundColor: user.role === 'admin' ? '#ef4444' : '#3b82f6' }]}>
                  <Text style={styles.roleText}>{user.role}</Text>
                </View>
              </View>
              <Text style={styles.email}>{user.email}</Text>
              <Text style={styles.date}>Gia nhập: {new Date(user.createdAt).toLocaleDateString('vi-VN')}</Text>
            </View>

            <View style={styles.userActions}>
              <TouchableOpacity style={styles.actionIcon} onPress={() => handleEditRole(user)}>
                <Ionicons name="shield-outline" size={20} color="#64748b" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionIcon} onPress={() => handleDeleteUser(user)}>
                <Ionicons name="trash-outline" size={20} color="#94a3b8" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
        
        {filteredUsers.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={64} color="#e2e8f0" />
            <Text style={styles.emptyText}>Không tìm thấy thành viên nào</Text>
          </View>
        )}
      </ScrollView>

      {/* Edit Role Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Phân quyền người dùng</Text>
            <Text style={styles.modalUser}>Tài khoản: {editingUser?.username}</Text>
            
            <View style={styles.roleOptions}>
              {['buyer', 'seller', 'admin'].map((role) => (
                <TouchableOpacity 
                  key={role} 
                  style={[styles.roleOption, newRole === role && styles.roleOptionActive]}
                  onPress={() => setNewRole(role)}
                >
                  <View style={[styles.radio, newRole === role && styles.radioActive]}>
                    {newRole === role && <View style={styles.radioInner} />}
                  </View>
                  <Text style={[styles.roleOptionText, newRole === role && styles.roleOptionTextActive]}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={handleUpdateRole}>
                <Text style={styles.confirmBtnText}>Cập nhật</Text>
              </TouchableOpacity>
            </View>
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
  searchBar: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  searchInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
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
  userCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  roleBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  roleText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  email: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 2,
  },
  date: {
    fontSize: 11,
    color: '#94a3b8',
  },
  userActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 8,
  },
  modalUser: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 24,
  },
  roleOptions: {
    gap: 12,
    marginBottom: 32,
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  roleOptionActive: {
    backgroundColor: '#f0f9ff',
    borderColor: '#bae6fd',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioActive: {
    borderColor: '#0ea5e9',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0ea5e9',
  },
  roleOptionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#475569',
  },
  roleOptionTextActive: {
    color: '#0369a1',
  },
  modalBtns: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
  },
  cancelBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#64748b',
  },
  confirmBtn: {
    flex: 2,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0ea5e9',
  },
  confirmBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});

export default UserManagementScreen;
