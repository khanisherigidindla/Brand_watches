import { create } from "zustand";
import { persist } from "zustand/middleware";
import { WatchProduct, CartItem } from "../types/watch";
import { loadCartForUser, saveCartForUser } from "../supabase/cartSync";
import { useUserStore } from "./userStore";

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: WatchProduct, quantity?: number, engraving?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  loadUserCart: (userEmail: string) => Promise<void>;
  logoutUserCart: () => void;
  getTotalItems: () => number;
  getSubtotalINR: () => number;
  getTaxINR: () => number;
  getTotalINR: () => number;
}

const syncUserCart = (newItems: CartItem[]) => {
  const currentUser = useUserStore.getState().user;
  if (currentUser?.email) {
    saveCartForUser(currentUser.email, newItems);
  }
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (product, quantity = 1, engraving) => {
        let updatedItems: CartItem[] = [];
        set((state) => {
          const existing = state.items.find((item) => item.product.id === product.id);
          if (existing) {
            updatedItems = state.items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity, engraving: engraving || item.engraving }
                : item
            );
          } else {
            updatedItems = [...state.items, { product, quantity, engraving }];
          }
          return { items: updatedItems, isOpen: true };
        });
        syncUserCart(updatedItems);
      },

      removeItem: (productId) => {
        let updatedItems: CartItem[] = [];
        set((state) => {
          updatedItems = state.items.filter((item) => item.product.id !== productId);
          return { items: updatedItems };
        });
        syncUserCart(updatedItems);
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        let updatedItems: CartItem[] = [];
        set((state) => {
          updatedItems = state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          );
          return { items: updatedItems };
        });
        syncUserCart(updatedItems);
      },

      clearCart: () => {
        set({ items: [] });
        syncUserCart([]);
      },

      loadUserCart: async (userEmail: string) => {
        if (!userEmail) return;
        const savedItems = await loadCartForUser(userEmail);
        set({ items: savedItems });
      },

      logoutUserCart: () => {
        set({ items: [], isOpen: false });
      },

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotalINR: () => {
        return get().items.reduce(
          (sum, item) => sum + item.product.priceINR * item.quantity,
          0
        );
      },

      getTaxINR: () => {
        const subtotal = get().getSubtotalINR();
        return Math.round(subtotal * 0.18);
      },

      getTotalINR: () => {
        return get().getSubtotalINR() + get().getTaxINR();
      }
    }),
    {
      name: "aurelion_luxury_cart"
    }
  )
);
