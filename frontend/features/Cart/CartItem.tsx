import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { formatPrice } from './cart.utils';

type CartItemProps = {
  checked: boolean;
  image: string;
  name: string;
  variant?: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  disabled?: boolean;
  onToggle?: () => void;
  onIncrease?: () => void;
  onDecrease?: () => void;
  onPress?: () => void;
};


export default function CartItem({
  checked,
  image,
  name,
  variant,
  price,
  originalPrice,
  quantity,
  disabled = false,
  onToggle,
  onIncrease,
  onDecrease,
  onPress,
}: CartItemProps) {
  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.checkbox, checked && styles.checkboxChecked]}
        onPress={onToggle}
      >
        {checked ? <View style={styles.checkboxInner} /> : null}
      </Pressable>

      <Pressable style={styles.card} onPress={onPress}>
        <Image 
          source={image} 
          style={styles.image} 
          contentFit="cover"
          transition={200}
        />

        <View style={styles.content}>
          <Text numberOfLines={2} style={[styles.name, disabled && styles.disabledText]}>
            {name}
          </Text>

          {!!variant && (
            <Text style={styles.variant} numberOfLines={1}>
              {variant}
            </Text>
          )}

          <View style={styles.footer}>
            <View style={styles.priceBlock}>
              {originalPrice ? (
                <Text style={styles.originalPrice}>
                  {formatPrice(originalPrice)}
                </Text>
              ) : null}

              <Text style={styles.price}>{formatPrice(price)}</Text>
            </View>

            <View style={styles.stepper}>
              <Pressable style={styles.stepBtn} onPress={onDecrease}>
                <Text style={styles.stepText}>-</Text>
              </Pressable>

              <View style={styles.qtyBox}>
                <Text style={styles.qtyText}>{quantity}</Text>
              </View>

              <Pressable style={styles.stepBtn} onPress={onIncrease}>
                <Text style={styles.stepText}>+</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const BOX_SIZE = 20;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    borderColor: '#FF4747',
    backgroundColor: '#FF4747',
  },
  checkboxInner: {
    width: 8,
    height: 8,
    borderRadius: 2,
    backgroundColor: '#fff',
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    lineHeight: 20,
  },
  disabledText: {
    color: '#9CA3AF',
  },
  variant: {
    marginTop: 4,
    fontSize: 12,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    borderRadius: 4,
  },
  footer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  priceBlock: {
    flex: 1,
  },
  originalPrice: {
    fontSize: 11,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    marginBottom: 1,
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FF4747',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
  },
  stepBtn: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  qtyBox: {
    minWidth: 36,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  qtyText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
});