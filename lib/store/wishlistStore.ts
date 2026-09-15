import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistStore {
  productIds: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  notificationCount: number;
  setNotificationCount: (count: number) => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      productIds: ["aur-pan2-06", "aur-pan3-01"],
      notificationCount: 0,

      toggleWishlist: (productId: string) => {
        set((state) => {
          const exists = state.productIds.includes(productId);
          return {
            productIds: exists
              ? state.productIds.filter((id) => id !== productId)
              : [...state.productIds, productId],
          };
        });
      },

      isInWishlist: (productId: string) => {
        return get().productIds.includes(productId);
      },

      clearWishlist: () => set({ productIds: [] }),

      setNotificationCount: (count: number) => set({ notificationCount: count }),
    }),
    {
      name: "aura_luxury_wishlist",
    }
  )
);

/* ---- Notification Store ---- */

export type NotificationType = "exclusive" | "system" | "order";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationStore {
  notifications: NotificationItem[];
  unreadCount: number;
  addNotification: (item: Omit<NotificationItem, "id">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [
        {
          id: "notif-1",
          type: "order",
          title: "Order #AUR-28491 Confirmed",
          message: "Your timepiece has entered production. Estimated delivery in 3-5 days.",
          timestamp: "2 hours ago",
          read: false,
        },
        {
          id: "notif-2",
          type: "exclusive",
          title: "New Rare Collection Drop",
          message: "The Celestial Grand Complication is now available for a select circle of collectors.",
          timestamp: "1 day ago",
          read: false,
        },
        {
          id: "notif-3",
          type: "system",
          title: "Atelier Assurance Active",
          message: "Your 5-Year Global Haute Horlogerie Guarantee is now registered in the Geneva Archives.",
          timestamp: "3 days ago",
          read: true,
        },
      ],

      unreadCount: 2,

            addNotification: (item) =>
        set((state) => ({
          notifications: [{ ...item, id: `notif_${Date.now()}` }, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        })),

      markAsRead: (id) =>
        set((state) => {
          const updated = state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          );
          const unread = updated.filter((n) => !n.read).length;
          return { notifications: updated, unreadCount: unread };
        }),

      markAllAsRead: () =>
        set(() => ({
          notifications: get().notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        })),

      clearNotification: (id) =>
        set((state) => {
          const updated = state.notifications.filter((n) => n.id !== id);
          const unread = updated.filter((n) => !n.read).length;
          return { notifications: updated, unreadCount: unread };
        }),

      clearAll: () => set({ notifications: [], unreadCount: 0 }),
    }),
    {
      name: "aura_luxury_notifications",
    }
  )
);
