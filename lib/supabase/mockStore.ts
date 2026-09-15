import { WatchProduct, Order, UserProfile } from "../types/watch";
import { WATCH_PRODUCTS } from "../data/seedProducts";

const PRODUCTS_KEY = "aurelion_products_db";
const ORDERS_KEY = "aurelion_orders_db";
const USER_KEY = "aurelion_active_user";

export function getLocalProducts(): WatchProduct[] {
  if (typeof window === "undefined") return WATCH_PRODUCTS;
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (!raw) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(WATCH_PRODUCTS));
      return WATCH_PRODUCTS;
    }
    return JSON.parse(raw);
  } catch {
    return WATCH_PRODUCTS;
  }
}

export function saveLocalProducts(products: WatchProduct[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

export function getLocalProductBySlug(slug: string): WatchProduct | undefined {
  const products = getLocalProducts();
  return products.find((p) => p.slug === slug);
}

export function updateLocalProduct(updated: WatchProduct): void {
  const products = getLocalProducts();
  const index = products.findIndex((p) => p.id === updated.id);
  if (index !== -1) {
    products[index] = updated;
  } else {
    products.unshift(updated);
  }
  saveLocalProducts(products);
}

export function getLocalOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalOrder(order: Order): void {
  if (typeof window === "undefined") return;
  const orders = getLocalOrders();
  orders.unshift(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function updateLocalOrderStatus(orderId: string, status: Order["orderStatus"]): void {
  if (typeof window === "undefined") return;
  const orders = getLocalOrders();
  const order = orders.find((o) => o.id === orderId);
  if (order) {
    order.orderStatus = status;
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }
}

export function getActiveUserProfile(): UserProfile {
  if (typeof window === "undefined") {
    return {
      id: "usr_vip_001",
      email: "collector@aurelion.luxury",
      firstName: "Julian",
      lastName: "Vanderbilt",
      phone: "+91 98201 54321",
      preferredBudget: "collector",
      savedAddresses: [
        {
          id: "addr_1",
          street: "42 Altamount Road, Penthouse B",
          city: "Mumbai",
          state: "Maharashtra",
          postalCode: "400026",
          country: "India",
          isDefault: true
        }
      ]
    };
  }

  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) {
      const defaultUser: UserProfile = {
        id: "usr_vip_001",
        email: "collector@aurelion.luxury",
        firstName: "Julian",
        lastName: "Vanderbilt",
        phone: "+91 98201 54321",
        preferredBudget: "collector",
        savedAddresses: [
          {
            id: "addr_1",
            street: "42 Altamount Road, Penthouse B",
            city: "Mumbai",
            state: "Maharashtra",
            postalCode: "400026",
            country: "India",
            isDefault: true
          }
        ]
      };
      localStorage.setItem(USER_KEY, JSON.stringify(defaultUser));
      return defaultUser;
    }
    return JSON.parse(raw);
  } catch {
    return {
      id: "usr_vip_001",
      email: "collector@aurelion.luxury",
      firstName: "Julian",
      lastName: "Vanderbilt"
    };
  }
}

export function saveActiveUserProfile(profile: UserProfile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, JSON.stringify(profile));
}
