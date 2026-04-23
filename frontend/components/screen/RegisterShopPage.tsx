import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { registerShop } from '../../lib/shopApi';
import { userApi } from '../../lib/userApi';
import { useEffect } from 'react';

export default function RegisterShopPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  
  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await userApi.getProfile();
        if (profile) {
          setName(profile.name || '');
          setEmail(profile.email || '');
          setPhone(profile.phone || '');
          
          // Trigger slug generation manually for initial name
          const n = profile.name || '';
          const generatedSlug = n
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[đĐ]/g, 'd')
            .replace(/([^0-9a-z-\s])/g, '')
            .replace(/(\s+)/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');
          setSlug(generatedSlug);
        }
      } catch (error) {
        console.log('Failed to fetch profile for pre-fill:', error);
      } finally {
        setFetchingProfile(false);
      }
    };
    loadProfile();
  }, []);

  // Auto-generate slug from name
  const handleNameChange = (text: string) => {
    setName(text);
    const generatedSlug = text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/([^0-9a-z-\s])/g, '')
      .replace(/(\s+)/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(generatedSlug);
  };

  const handleRegister = async () => {
    if (!name.trim() || !slug.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập tên shop và đường dẫn (slug).');
      return;
    }

    // Basic slug validation (regex: ^[a-z0-9]+(?:-[a-z0-9]+)*$)
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(slug)) {
      Alert.alert('Lỗi', 'Đường dẫn (slug) không hợp lệ. Chỉ dùng chữ cái thường, số và dấu gạch ngang.');
      return;
    }

    try {
      setLoading(true);
      await registerShop({
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim() || undefined,
        address: address.trim() || undefined,
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        logoUrl: logoUrl.trim() || undefined,
        coverImageUrl: coverImageUrl.trim() || undefined,
      });

      Alert.alert('Thành công', 'Chúc mừng! Bạn đã đăng ký cửa hàng thành công.', [
        { text: 'Đến Kênh Người Bán', onPress: () => router.replace('/seller-dashboard' as any) }
      ]);
    } catch (error: any) {
      console.error('Register Shop Error:', error);
      Alert.alert('Lỗi', error.message || 'Không thể đăng ký cửa hàng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingProfile) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#F83758" />
        <Text style={{ marginTop: 12, color: '#666' }}>Đang tải thông tin cá nhân...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#F83758" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đăng ký Cửa hàng</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.banner}>
          <MaterialCommunityIcons name="storefront-plus" size={60} color="#F83758" />
          <Text style={styles.bannerTitle}>Bắt đầu bán hàng trên ShopeeLite</Text>
          <Text style={styles.bannerSubtitle}>Chỉ vài bước đơn giản để sở hữu gian hàng của riêng bạn</Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tên Shop <Text style={{color: '#F83758'}}>*</Text></Text>
            <View style={styles.inputWrap}>
              <TextInput 
                style={styles.input} 
                placeholder="Ví dụ: My Fashion Store" 
                value={name} 
                onChangeText={handleNameChange}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Đường dẫn Shop (Slug) <Text style={{color: '#F83758'}}>*</Text></Text>
            <View style={styles.inputWrap}>
              <Text style={styles.slugPrefix}>shopeelite.com/shop/</Text>
              <TextInput 
                style={[styles.input, {flex: 1}]} 
                placeholder="ten-shop-cua-ban" 
                value={slug} 
                onChangeText={setSlug}
                autoCapitalize="none"
              />
            </View>
            <Text style={styles.hint}>Chỉ chứa chữ thường, số và dấu gạch ngang.</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mô tả Shop</Text>
            <View style={[styles.inputWrap, {height: 100, alignItems: 'flex-start'}]}>
              <TextInput 
                style={[styles.input, {textAlignVertical: 'top'}]} 
                placeholder="Giới thiệu ngắn gọn về shop của bạn..." 
                value={description} 
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
              />
            </View>
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Thông tin liên hệ</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Địa chỉ lấy hàng</Text>
            <View style={styles.inputWrap}>
              <TextInput 
                style={styles.input} 
                placeholder="Số nhà, tên đường, quận/huyện..." 
                value={address} 
                onChangeText={setAddress}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Số điện thoại</Text>
            <View style={styles.inputWrap}>
              <TextInput 
                style={styles.input} 
                placeholder="Số điện thoại liên hệ" 
                keyboardType="phone-pad"
                value={phone} 
                onChangeText={setPhone}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrap}>
              <TextInput 
                style={styles.input} 
                placeholder="Email của shop" 
                keyboardType="email-address"
                autoCapitalize="none"
                value={email} 
                onChangeText={setEmail}
              />
            </View>
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Hình ảnh đại diện (Tùy chọn)</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Link Logo Shop</Text>
            <View style={styles.inputWrap}>
              <TextInput 
                style={styles.input} 
                placeholder="https://example.com/logo.png" 
                value={logoUrl} 
                onChangeText={setLogoUrl}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Link Ảnh bìa Shop</Text>
            <View style={styles.inputWrap}>
              <TextInput 
                style={styles.input} 
                placeholder="https://example.com/cover.png" 
                value={coverImageUrl} 
                onChangeText={setCoverImageUrl}
              />
            </View>
          </View>
        </View>

        <View style={styles.agreement}>
          <Ionicons name="checkbox" size={20} color="#F83758" />
          <Text style={styles.agreementText}>
            Bằng việc nhấn "Đăng ký", bạn đồng ý với các <Text style={styles.link}>Điều khoản & Chính sách</Text> người bán của chúng tôi.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.submitButton, loading && {opacity: 0.7}]} 
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>ĐĂNG KÝ NGAY</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#EEEEEE',
  },
  backButton: { paddingRight: 16 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  scrollContent: { paddingBottom: 30 },
  
  banner: {
    alignItems: 'center', padding: 24, backgroundColor: '#FFFFFF'
  },
  bannerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginTop: 16 },
  bannerSubtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 8 },
  
  formSection: { backgroundColor: '#FFFFFF', marginTop: 12, paddingBottom: 16 },
  sectionTitle: { 
    fontSize: 15, fontWeight: 'bold', color: '#333', 
    padding: 16, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' 
  },
  
  inputGroup: { paddingHorizontal: 16, marginTop: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#444', marginBottom: 8 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F9F9F9', borderRadius: 8, borderWidth: 1, borderColor: '#EAEAEA',
    paddingHorizontal: 12, minHeight: 48
  },
  input: { flex: 1, fontSize: 15, color: '#333', paddingVertical: 10 },
  slugPrefix: { color: '#999', fontSize: 14, marginRight: 2 },
  hint: { fontSize: 12, color: '#999', marginTop: 4 },
  
  agreement: {
    flexDirection: 'row', padding: 20, alignItems: 'flex-start'
  },
  agreementText: { fontSize: 13, color: '#666', flex: 1, marginLeft: 8, lineHeight: 18 },
  link: { color: '#F83758', fontWeight: 'bold' },
  
  footer: {
    padding: 16, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#EEEEEE'
  },
  submitButton: {
    backgroundColor: '#F83758', borderRadius: 8, paddingVertical: 14, alignItems: 'center',
    shadowColor: '#F83758', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5
  },
  submitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});
