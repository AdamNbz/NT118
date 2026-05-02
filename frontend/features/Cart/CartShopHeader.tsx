import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useAnimatedStyle, 
  withTiming, 
  useSharedValue,
  interpolate,
} from 'react-native-reanimated';

type CartShopHeaderProps = {
  checked: boolean;
  shopName: string;
  onToggle?: () => void;
  onPressShop?: () => void;
  onDeleteShop?: () => void;
};

export default function CartShopHeader({
  checked,
  shopName,
  onToggle,
  onPressShop,
  onDeleteShop,
}: CartShopHeaderProps) {
  const [showDelete, setShowDelete] = useState(false);
  const anim = useSharedValue(0);

  const toggleDelete = () => {
    const nextState = !showDelete;
    setShowDelete(nextState);
    anim.value = withTiming(nextState ? 1 : 0, { duration: 300 });
  };

  const handleDelete = () => {
    Alert.alert(
      'Xóa shop',
      `Bạn có chắc muốn xóa toàn bộ sản phẩm của ${shopName} khỏi giỏ hàng?`,
      [
        { text: 'Hủy', style: 'cancel', onPress: () => toggleDelete() },
        { 
          text: 'Xóa', 
          style: 'destructive', 
          onPress: () => {
            onDeleteShop?.();
            toggleDelete();
          } 
        },
      ]
    );
  };

  const deleteBtnStyle = useAnimatedStyle(() => ({
    width: interpolate(anim.value, [0, 1], [0, 70]),
    opacity: anim.value,
    transform: [{ translateX: interpolate(anim.value, [0, 1], [20, 0]) }],
  }));

  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.checkbox, checked && styles.checkboxChecked]}
        onPress={onToggle}
      >
        {checked && <Ionicons name="checkmark" size={14} color="#FFF" />}
      </Pressable>

      <Pressable style={styles.shopRow} onPress={onPressShop}>
        <View style={styles.mallBadge}>
          <Ionicons name="storefront" size={10} color="#EE4D2D" />
          <Text style={styles.mallText}>Mall</Text>
        </View>
        <Text style={styles.shopName} numberOfLines={1}>
          {shopName}
        </Text>
        <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
      </Pressable>

      <View style={styles.rightActions}>
        <Animated.View style={[styles.deleteBtnWrapper, deleteBtnStyle]}>
          <Pressable style={styles.deleteBtn} onPress={handleDelete}>
            <Text style={styles.deleteText}>Xóa</Text>
          </Pressable>
        </Animated.View>

        <Pressable style={styles.moreBtn} onPress={toggleDelete}>
          <Ionicons 
            name={showDelete ? "close" : "ellipsis-vertical"} 
            size={18} 
            color="#9CA3AF" 
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 10,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    borderColor: '#EE4D2D',
    backgroundColor: '#EE4D2D',
  },
  shopRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mallBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    borderWidth: 1,
    borderColor: '#EE4D2D',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  mallText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#EE4D2D',
  },
  shopName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreBtn: {
    padding: 4,
    marginLeft: 4,
    zIndex: 10,
  },
  deleteBtnWrapper: {
    height: 30,
    overflow: 'hidden',
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: '#EE4D2D',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  deleteText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});