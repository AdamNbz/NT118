import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import CartBottomBar from '../../features/Cart/CartBottomBar';
import CartSection from '../../features/Cart/CartSection';
import CartShippingProgress from '../../features/Cart/CartShippingProgress';
import useCartScreen from '../../features/Cart/useCartScreen';
import ProductCard from '../common/ProductCard';

const { width } = Dimensions.get('window');

export default function CartScreen() {
  const router = useRouter();
  const {
    sections,
    summary,
    recommendedProducts,
    handleToggleShop,
    handleToggleItem,
    handleIncreaseItem,
    handleDecreaseItem,
    handleToggleAll,
    handlePressVoucher,
    handlePressProduct,
    handlePressItem,
    handleCheckout,
    handleDeleteShop,
    handleDeleteItem,
  } = useCartScreen();

  const isEmpty = sections.length === 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.navigate('/')} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Giỏ hàng</Text>
        <View style={styles.headerRight}>
          {!isEmpty && (
            <Text style={styles.itemCount}>{summary.selectedCount} sản phẩm</Text>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {isEmpty ? (
          <View style={styles.emptyState}>
            <Ionicons name="cart-outline" size={80} color="#DDD" />
            <Text style={styles.emptyTitle}>Giỏ hàng trống</Text>
            <Text style={styles.emptySubtitle}>Hãy thêm sản phẩm vào giỏ hàng nhé!</Text>
            <TouchableOpacity style={styles.shopNowBtn} onPress={() => router.navigate('/')}>
              <Text style={styles.shopNowText}>Mua sắm ngay</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <CartShippingProgress currentAmount={summary.totalPrice} targetAmount={150000} />

            {sections.map((section) => (
              <CartSection
                key={section.shopId}
                shopId={section.shopId}
                shopName={section.shopName}
                checked={section.checked}
                items={section.items}
                voucherLabel={section.voucherLabel}
                voucherValue={section.voucherValue}
                onToggleShop={handleToggleShop}
                onToggleItem={handleToggleItem}
                onIncreaseItem={handleIncreaseItem}
                onDecreaseItem={handleDecreaseItem}
                onPressVoucher={handlePressVoucher}
                onPressItem={handlePressItem}
                onDeleteShop={handleDeleteShop}
                onDeleteItem={handleDeleteItem}
              />
            ))}
          </>
        )}

        {/* Recommended Products */}
        {recommendedProducts.length > 0 && (
          <View style={styles.recommendSection}>
            <View style={styles.recommendHeader}>
              <Text style={styles.recommendTitle}>Có thể bạn cũng thích</Text>
              <TouchableOpacity onPress={() => router.navigate('/')}>
                <Text style={styles.seeAllText}>Xem tất cả</Text>
              </TouchableOpacity>
            </View>

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recommendScroll}
            >
              {recommendedProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  isHorizontal={true} 
                  onPress={handlePressProduct} 
                />
              ))}
            </ScrollView>
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      {!isEmpty && (
        <CartBottomBar
          allChecked={summary.allChecked}
          totalPrice={summary.totalPrice}
          selectedCount={summary.selectedCount}
          onToggleAll={handleToggleAll}
          onCheckout={handleCheckout}
        />
      )}
    </SafeAreaView>
  );
}

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
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerRight: {
    minWidth: 30,
    alignItems: 'flex-end',
  },
  itemCount: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    paddingBottom: 24,
  },
  // Empty state
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  shopNowBtn: {
    marginTop: 24,
    backgroundColor: '#EE4D2D',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 24,
  },
  shopNowText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15,
  },
  // Recommend
  recommendSection: {
    marginTop: 16,
    backgroundColor: '#FFF',
    paddingVertical: 16,
  },
  recommendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  recommendTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  seeAllText: {
    fontSize: 13,
    color: '#EE4D2D',
    fontWeight: '600',
  },
  recommendScroll: {
    paddingHorizontal: 16,
  },
});
