import { useMemo, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { CartSectionType } from './cart.types';
import {
  getCartSummary,
  toggleAllChecked,
  toggleItemChecked,
  toggleShopChecked,
  updateItemQuantity,
  mapBackendCartToSections,
} from './cart.utils';
import { Product } from '@/components/common/ProductCard';
import { getCartItems, updateCartItemQuantity, deleteCartItem } from '../../lib/cartApi';

const recommendedProducts: Product[] = [
  {
    id: 'p1',
    name: 'Áo thun Cotton Basic Unisex',
    description: 'Chất vải mềm mại, form rộng dễ mặc hằng ngày',
    price: '₫129.000',
    originalPrice: '₫199.000',
    discount: '-35%',
    rating: 4.5,
    reviews: '1.2k',
    image: { uri: 'https://picsum.photos/202' },
  },
  {
    id: 'p2',
    name: 'Đồng hồ thông minh Series 8',
    description: 'Thiết kế hiện đại, theo dõi sức khỏe và vận động',
    price: '₫1.450.000',
    originalPrice: '₫1.890.000',
    discount: '-23%',
    rating: 4.8,
    reviews: '860',
    image: { uri: 'https://picsum.photos/203' },
  },
];

export default function useCartScreen() {
  const router = useRouter();
  const [sections, setSections] = useState<CartSectionType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const items = await getCartItems();
      setSections(mapBackendCartToSections(items));
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const summary = useMemo(() => getCartSummary(sections), [sections]);

  const handleToggleShop = (shopId: string) => {
    setSections(prev => toggleShopChecked(prev, shopId));
  };

  const handleToggleItem = (shopId: string, itemId: string) => {
    setSections(prev => toggleItemChecked(prev, shopId, itemId));
  };

  const handleUpdateQuantity = async (shopId: string, itemId: string, newQty: number) => {
    if (newQty < 1) {
      // Handle delete
      const success = await deleteCartItem(parseInt(itemId));
      if (success) fetchCart();
      return;
    }

    const res = await updateCartItemQuantity(parseInt(itemId), newQty);
    if (res.success) {
      setSections(prev => {
        return prev.map(section => {
          if (section.shopId !== shopId) return section;
          return {
            ...section,
            items: section.items.map(item => {
              if (item.id !== itemId) return item;
              return { ...item, quantity: newQty };
            })
          };
        });
      });
    }
  };

  const handleIncreaseItem = (shopId: string, itemId: string) => {
    const section = sections.find(s => s.shopId === shopId);
    const item = section?.items.find(i => i.id === itemId);
    if (item) {
      handleUpdateQuantity(shopId, itemId, item.quantity + 1);
    }
  };

  const handleDecreaseItem = (shopId: string, itemId: string) => {
    const section = sections.find(s => s.shopId === shopId);
    const item = section?.items.find(i => i.id === itemId);
    if (item && item.quantity > 1) {
      handleUpdateQuantity(shopId, itemId, item.quantity - 1);
    } else if (item && item.quantity === 1) {
      handleUpdateQuantity(shopId, itemId, 0); // Trigger delete
    }
  };

  const handleToggleAll = () => {
    setSections(prev => toggleAllChecked(prev));
  };

  const handlePressVoucher = (shopId: string) => {
    console.log('voucher shop:', shopId);
  };

  const handlePressProduct = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  const handlePressItem = (shopId: string, itemId: string) => {
    const section = sections.find(s => s.shopId === shopId);
    const item = section?.items.find(i => i.id === itemId);
    if (item) {
      router.push(`/product/${item.productId}`);
    }
  };

  const handleCheckout = () => {
    console.log('checkout');
  };

  const handleDeleteShop = async (shopId: string) => {
    const section = sections.find(s => s.shopId === shopId);
    if (!section) return;
    
    try {
      // Xóa từng item trong shop (do API hiện tại chỉ hỗ trợ xóa từng cái)
      await Promise.all(section.items.map(item => deleteCartItem(parseInt(item.id))));
      fetchCart();
    } catch (error) {
      console.error('Failed to delete shop items:', error);
    }
  };

  return {
    sections,
    summary,
    recommendedProducts,
    isLoading,
    fetchCart,
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
  };
}
