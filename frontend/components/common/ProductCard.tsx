import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Share, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

const { width } = Dimensions.get('window');

export interface Product {
  id: number | string;
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  rating: number;
  reviews: string;
  image: any;
  imageHeight?: number;
}

interface ProductCardProps {
  product: Product;
  onPress?: (product: Product) => void;
  isHorizontal?: boolean;
  isMasonry?: boolean;
  isFavorited?: boolean;
  onToggleFavorite?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  isHorizontal = false,
  isMasonry = false,
  isFavorited,
  onToggleFavorite,
}) => {
  const cardWidth = isHorizontal ? 160 : (width - 36) / 2;

  return (
    <TouchableOpacity
      style={[
        styles.productCard,
        isHorizontal ? styles.horizontalCard : { width: cardWidth },
        isMasonry && { marginBottom: 10 }
      ]}
      onPress={() => onPress?.(product)}
      activeOpacity={0.85}
    >
      <View style={[
        styles.productImageContainer,
        isMasonry && product.imageHeight ? { height: product.imageHeight } : { aspectRatio: 1 }
      ]}>
        <Image 
          source={product.image} 
          style={styles.productImage} 
          contentFit="cover"
          transition={300}
          cachePolicy="disk"
        />
        
        {product.discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountBadgeText}>{product.discount}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.heartButton, isFavorited && styles.heartButtonActive]}
          onPress={(e) => { 
            e.stopPropagation?.(); 
            if (onToggleFavorite) {
              onToggleFavorite(product);
            } else {
              Alert.alert('Yêu thích', 'Vui lòng đăng nhập để thêm vào yêu thích.');
            }
          }}
        >
          <Ionicons
            name={isFavorited ? 'heart' : 'heart-outline'}
            size={16}
            color={isFavorited ? '#FFF' : '#888'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        
        <View style={styles.priceContainer}>
          <View style={styles.mainPrice}>
            <Text style={styles.currencySymbol}>₫</Text>
            <Text style={styles.productPrice}>
              {product.price.replace('₫', '')}
            </Text>
          </View>
          {product.originalPrice && (
            <Text style={styles.originalPrice}>
              {product.originalPrice}
            </Text>
          )}
        </View>

        <View style={styles.footerRow}>
          <View style={styles.ratingBox}>
            <Ionicons name="star" size={10} color="#FFD700" />
            <Text style={styles.ratingText}>{product.rating}</Text>
          </View>
          <View style={styles.divider} />
          <Text style={styles.soldText}>{product.reviews}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 0.5,
    borderColor: '#ECECEC',
  },
  horizontalCard: {
    width: 160,
    marginRight: 10,
    marginBottom: 4,
  },
  productImageContainer: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(238, 77, 45, 0.92)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderBottomLeftRadius: 8,
    zIndex: 2,
  },
  discountBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  heartButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 14,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 2,
  },
  heartButtonActive: {
    backgroundColor: '#FF4D4F',
  },
  productInfo: {
    padding: 8,
  },
  productName: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    color: '#1F2937',
    marginBottom: 4,
  },
  priceContainer: {
    marginBottom: 4,
  },
  mainPrice: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currencySymbol: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EE4D2D',
    marginRight: 1,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#EE4D2D',
  },
  originalPrice: {
    fontSize: 12,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    marginTop: 2,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
    marginLeft: 2,
  },
  divider: {
    width: 1,
    height: 10,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 6,
  },
  soldText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
});

export default ProductCard;
