import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export interface Product {
  id: number | string;
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  discount: string;
  rating: number;
  reviews: string;
  image: any;
}

interface ProductCardProps {
  product: Product;
  onPress?: (product: Product) => void;
  isHorizontal?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onPress, isHorizontal = false }) => {
  return (
    <TouchableOpacity 
      style={[styles.productCard, isHorizontal && styles.horizontalCard]} 
      onPress={() => onPress?.(product)}
      activeOpacity={0.9}
    >
      <View style={styles.productImageContainer}>
        <Image source={product.image} style={styles.productImage} />
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
        <Text style={styles.productDesc} numberOfLines={2}>{product.description}</Text>
        <Text style={styles.productPrice}>{product.price}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.originalPrice}>{product.originalPrice}</Text>
          <Text style={styles.discountText}>{product.discount}</Text>
        </View>
        <View style={styles.ratingRow}>
          <View style={styles.stars}>
            {[1, 2, 3, 4].map((i) => (
              <Ionicons key={i} name="star" size={12} color="#EDB310" />
            ))}
            {product.rating % 1 !== 0 && <Ionicons name="star-half" size={12} color="#EDB310" />}
          </View>
          <Text style={styles.reviewsText}>{product.reviews}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productCard: {
    width: (width - 48) / 2,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  horizontalCard: {
    width: 170,
    marginRight: 12,
    marginBottom: 0,
  },
  productImageContainer: {
    width: '100%',
    height: 128,
    backgroundColor: '#F0F0F0',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    padding: 8,
  },
  productName: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Montserrat_500Medium',
  },
  productDesc: {
    fontSize: 10,
    color: '#676767',
    marginTop: 4,
    fontFamily: 'Montserrat_400Regular',
  },
  productPrice: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    fontFamily: 'Montserrat_600SemiBold',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 8,
  },
  originalPrice: {
    fontSize: 10,
    color: '#BBBBBB',
    textDecorationLine: 'line-through',
    fontFamily: 'Montserrat_300Light',
  },
  discountText: {
    fontSize: 10,
    color: '#FE735C',
    fontFamily: 'Montserrat_400Regular',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  stars: {
    flexDirection: 'row',
  },
  reviewsText: {
    fontSize: 10,
    color: '#A8A8A9',
    fontFamily: 'Montserrat_400Regular',
  },
});

export default ProductCard;
