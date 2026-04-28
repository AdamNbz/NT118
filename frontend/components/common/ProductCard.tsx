import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
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
  const cardWidth = isHorizontal ? 180 : (width - 40) / 2;

  return (
    <TouchableOpacity
      style={[
        styles.productCard,
        isHorizontal ? styles.horizontalCard : { width: cardWidth },
        isMasonry && { marginBottom: 12 }
      ]}
      onPress={() => onPress?.(product)}
      activeOpacity={0.9}
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

        <View style={styles.imageOverlay} />
        
        {onToggleFavorite && (
          <TouchableOpacity
            style={styles.heartButton}
            onPress={(e) => { e.stopPropagation?.(); onToggleFavorite(product); }}
          >
            <Ionicons
              name={isFavorited ? 'heart' : 'heart-outline'}
              size={16}
              color={isFavorited ? '#FF4D4F' : '#666'}
            />
          </TouchableOpacity>
        )}
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
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  horizontalCard: {
    width: 180,
    marginRight: 12,
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
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  discountBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(255, 77, 79, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomLeftRadius: 10,
    zIndex: 2,
  },
  discountBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  heartButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    zIndex: 2,
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
    color: '#374151',
    height: 36,
    marginBottom: 6,
  },
  priceContainer: {
    marginBottom: 8,
    minHeight: 40,
    justifyContent: 'center',
  },
  mainPrice: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currencySymbol: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF4D4F',
    marginRight: 1,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#EE4D2D',
  },
  originalPrice: {
    fontSize: 11,
    color: '#999',
    textDecorationLine: 'line-through',
    marginTop: 1,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
    marginLeft: 3,
  },
  divider: {
    width: 1,
    height: 12,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  soldText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
});

export default ProductCard;
