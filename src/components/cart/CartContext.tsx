'use client';

import { useEffect } from 'react';
import { useCartStore, type CartItem } from '@/src/store/useCartStore';

function isCartItem(item: unknown): item is CartItem {
  if (typeof item !== 'object' || item === null) return false;
  const candidate = item as Partial<CartItem>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    Number.isFinite(Number(candidate.price)) &&
    Number.isInteger(candidate.quantity) &&
    Number(candidate.quantity) > 0
  );
}

export default function CartHydrator() {
  useEffect(() => {
    const hydrate = async () => {
      try {
        await useCartStore.persist.rehydrate();

        const legacyCart = localStorage.getItem('chaat_cart');
        if (!legacyCart) return;

        const parsed: unknown = JSON.parse(legacyCart);
        if (Array.isArray(parsed)) {
          const items = parsed.filter(isCartItem);
          if (useCartStore.getState().cart.length === 0 && items.length > 0) {
            useCartStore.setState({ cart: items });
          }
        }
        localStorage.removeItem('chaat_cart');
      } catch (error) {
        console.error('Could not restore the saved cart:', error);
      }
    };

    void hydrate();
  }, []);

  return null;
}
