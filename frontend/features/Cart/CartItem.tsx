import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { formatPrice } from './cart.utils';
import { Swipeable } from 'react-native-gesture-handler';

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
  onDelete?: () => void;
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
  onDelete,
}: CartItemProps) {
  const renderRightActions = () => {
    return (
      <Pressable style={styles.deleteAction} onPress={onDelete}>
        <Ionicons name="trash-outline" size={24} color="#FFF" />
        <Text style={styles.deleteText}>Xóa</Text>
      </Pressable>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions} friction={2}>
      <View style={styles.container}>
        <Pressable
          style={[styles.checkbox, checked && styles.checkboxChecked]}
          onPress={onToggle}
        >
          {checked && <Ionicons name="checkmark" size={14} color="#FFF" />}
        </Pressable>

        <Pressable style={styles.card} onPress={onPress}>
          <View style={styles.imageWrap}>
            <Image 
              source={image} 
              style={styles.image} 
              contentFit="cover"
              transition={200}
            />
          </View>

          <View style={styles.content}>
            <Text numberOfLines={2} style={[styles.name, disabled && styles.disabledText]}>
              {name}
            </Text>

            {!!variant && (
              <View style={styles.variantBadge}>
                <Text style={styles.variantText} numberOfLines={1}>
                  Phân loại: {variant}
                </Text>
                <Ionicons name="chevron-down" size={12} color="#9CA3AF" />
              </View>
            )}

            <View style={styles.footer}>
              <View style={styles.priceBlock}>
                <Text style={styles.price}>{formatPrice(price)}</Text>
                {originalPrice ? (
                  <Text style={styles.originalPrice}>
                    {formatPrice(originalPrice)}
                  </Text>
                ) : null}
              </View>

              <View style={styles.stepper}>
                <Pressable 
                  style={[styles.stepBtn, quantity <= 1 && styles.stepBtnDisabled]} 
                  onPress={onDecrease}
                >
                  <Text style={[styles.stepText, quantity <= 1 && styles.stepTextDisabled]}>−</Text>
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
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    borderColor: '#EE4D2D',
    backgroundColor: '#EE4D2D',
  },
  card: {
    flex: 1,
    flexDirection: 'row',
  },
  imageWrap: {
    width: 88,
    height: 88,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
    marginRight: 12,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    lineHeight: 20,
  },
  disabledText: {
    color: '#9CA3AF',
  },
  variantBadge: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    gap: 4,
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
  },
  variantText: {
    fontSize: 12,
    color: '#6B7280',
  },
  footer: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  priceBlock: {
    flex: 1,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EE4D2D',
  },
  originalPrice: {
    fontSize: 11,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    marginTop: 1,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  stepBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnDisabled: {
    opacity: 0.3,
  },
  stepText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#374151',
  },
  stepTextDisabled: {
    color: '#9CA3AF',
  },
  qtyBox: {
    minWidth: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFF',
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  deleteAction: {
    backgroundColor: '#EE4D2D',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  deleteText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});