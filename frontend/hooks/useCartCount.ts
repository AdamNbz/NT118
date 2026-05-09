import { useState, useEffect, useCallback } from 'react';
import { getCartCount } from '../lib/cartApi';

// A simple event system for cart updates
const cartListeners = new Set<() => void>();

export const notifyCartUpdate = () => {
  cartListeners.forEach(listener => listener());
};

export function useCartCount() {
  const [count, setCount] = useState(0);

  const fetchCount = useCallback(async () => {
    try {
      const c = await getCartCount();
      setCount(c);
    } catch (err) {
      console.log('Failed to fetch cart count:', err);
    }
  }, []);

  useEffect(() => {
    fetchCount();
    
    const listener = () => fetchCount();
    cartListeners.add(listener);
    
    return () => {
      cartListeners.delete(listener);
    };
  }, [fetchCount]);

  return count;
}
