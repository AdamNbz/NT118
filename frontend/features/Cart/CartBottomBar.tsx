import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatPrice } from './cart.utils';

type CartBottomBarProps = {
  allChecked: boolean;
  totalPrice: number;
  selectedCount: number;
  onToggleAll?: () => void;
  onCheckout?: () => void;
};

export default function CartBottomBar({
  allChecked,
  totalPrice,
  selectedCount,
  onToggleAll,
  onCheckout,
}: CartBottomBarProps) {
  return (
    <View style={styles.container}>
      <Pressable style={styles.left} onPress={onToggleAll}>
        <View style={[styles.checkbox, allChecked && styles.checkboxChecked]}>
          {allChecked && <Ionicons name="checkmark" size={14} color="#FFF" />}
        </View>
        <Text style={styles.allText}>Tất cả</Text>
      </Pressable>

      <View style={styles.center}>
        <Text style={styles.totalLabel}>Tổng thanh toán</Text>
        <Text style={styles.totalPrice}>{formatPrice(totalPrice)}</Text>
      </View>

      <Pressable 
        style={[styles.button, selectedCount === 0 && styles.buttonDisabled]} 
        onPress={onCheckout}
        disabled={selectedCount === 0}
      >
        <Text style={styles.buttonText}>Mua hàng ({selectedCount})</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 64,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 4,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginRight: 6,
  },
  checkboxChecked: {
    borderColor: '#EE4D2D',
    backgroundColor: '#EE4D2D',
  },
  allText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  center: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 12,
  },
  totalLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  totalPrice: {
    fontSize: 17,
    fontWeight: '700',
    color: '#EE4D2D',
    marginTop: 1,
  },
  button: {
    height: 44,
    paddingHorizontal: 20,
    borderRadius: 22,
    backgroundColor: '#EE4D2D',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EE4D2D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});