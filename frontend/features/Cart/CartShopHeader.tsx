import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
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

  const deleteBtnStyle = useAnimatedStyle(() => {
    return {
      width: interpolate(anim.value, [0, 1], [0, 70]),
      opacity: anim.value,
      transform: [
        { translateX: interpolate(anim.value, [0, 1], [20, 0]) }
      ]
    };
  });

  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.checkbox, checked && styles.checkboxChecked]}
        onPress={onToggle}
      >
        {checked ? <View style={styles.checkboxInner} /> : null}
      </Pressable>

      <Pressable style={styles.shopRow} onPress={onPressShop}>
        <Text style={styles.mallBadge}>Mall</Text>
        <Text style={styles.shopName} numberOfLines={1}>
          {shopName}
        </Text>
      </Pressable>

      <View style={styles.rightActions}>
        <Animated.View style={[styles.deleteBtnWrapper, deleteBtnStyle]}>
          <Pressable style={styles.deleteBtn} onPress={handleDelete}>
            <Text style={styles.deleteText}>Xóa</Text>
          </Pressable>
        </Animated.View>

        <Pressable style={styles.moreBtn} onPress={toggleDelete}>
          <Feather 
            name={showDelete ? "x" : "more-vertical"} 
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
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    borderColor: '#FF4D4F',
    backgroundColor: '#FF4D4F',
  },
  checkboxInner: {
    width: 8,
    height: 8,
    borderRadius: 2,
    backgroundColor: '#fff',
  },
  shopRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mallBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#EF4444',
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginRight: 8,
  },
  shopName: {
    flex: 1,
    fontSize: 14,
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
    backgroundColor: '#FF4747',
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