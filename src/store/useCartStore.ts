import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  spiceLevel: 'Mild' | 'Medium' | 'Extra' | string;
  quantity: number;
}

interface CartStore {
  cart: CartItem[];
  isOpen: boolean;
  toggleCart: () => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cart: [],
      isOpen: false,

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addToCart: (newItem: CartItem) =>
        set((state) => {
          const existingItem = state.cart.find((item) => item.id === newItem.id);

          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.id === newItem.id
                  ? { ...item, quantity: item.quantity + newItem.quantity }
                  : item,
              ),
            };
          }

          return { cart: [...state.cart, newItem] };
        }),

      removeFromCart: (id: string) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        })),

      updateQuantity: (id: string, delta: number) =>
        set((state) => ({
          cart: state.cart
            .map((item) => {
              if (item.id === id) {
                const newQuantity = item.quantity + delta;
                return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
              }
              return item;
            })
            .filter((item): item is CartItem => item !== null),
        })),

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'chaat_cart_v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ cart: state.cart }),
      skipHydration: true,
    },
  ),
);