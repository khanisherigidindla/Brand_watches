export type BudgetTierId =
  | "everyday"
  | "luxury"
  | "rare"
  | "affordable_luxury"
  | "premium"
  | "high_luxury"
  | "collector"
  | "ultra_luxury";

export interface BudgetTier {
  id: BudgetTierId;
  label: string;
  tagline: string;
  minPrice: number;
  maxPrice: number;
  formattedRange: string;
  description: string;
  badge: string;
}

export type MovementType =
  | "Quartz"
  | "Automatic"
  | "Manual Wind"
  | "Spring Drive"
  | "Tourbillon"
  | "Automatic Tourbillon"
  | "Skeleton Chronograph"
  | "Perpetual Calendar"
  | "Manual-Wind Haute Horlogerie"
  | "Automatic GMT"
  | "Grand Complication";

export type CaseMaterial =
  | "Stainless Steel"
  | "Titanium"
  | "18K Gold"
  | "Platinum"
  | "Ceramic"
  | "Carbon Fiber"
  | "18K Rose Gold"
  | "Platinum 950"
  | "Titanium Grade 5"
  | "Forged Carbon & Sapphire"
  | "Stainless Steel 316L"
  | "Diamond & Sapphire Paved";

export interface WatchProduct {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  collection:
    | "Imperial"
    | "Tourbillon"
    | "Skeleton"
    | "Chronograph"
    | "Heritage"
    | "Grand Complication"
    | "Everyday"
    | "Premium"
    | "Luxury"
    | "Rare";
  budgetTier: BudgetTierId;
  priceINR: number;
  formattedPrice: string;
  limitedEdition: boolean;
  editionSize?: number;
  pieceNumber?: string;
  stockQuantity: number;
  movement: MovementType;
  calibre: string;
  powerReserve: string;
  frequency: string;
  jewels: number;
  waterResistance: string;
  caseMaterial: CaseMaterial;
  caseDiameter: string;
  caseThickness: string;
  strapMaterial: string;
  dialColor: string;
  description: string;
  craftsmanshipNotes: string[];
  features: string[];
  images: string[];
  modelUrl: string; // URL or GLB placeholder path
  modelPreset?: {
    metalColor: string;
    bezelColor: string;
    dialColor: string;
    gemColor?: string;
    strapColor: string;
    accentColor: string;
    roughness: number;
    metalness: number;
    hasGems?: boolean;
    gemType?: "sapphire" | "diamond" | "ruby";
  };
  isNewArrival?: boolean;
  isBestSeller?: boolean;
}

export interface CartItem {
  product: WatchProduct;
  quantity: number;
  engraving?: string;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  priceINR: number;
  image: string;
}

export type OrderStatus =
  | "Order Placed"
  | "Payment Confirmed"
  | "Processing"
  | "Craftsmanship Verification"
  | "Dispatched"
  | "Delivered";

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  email: string;
  phone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: OrderItem[];
  subtotalINR: number;
  taxINR: number;
  shippingINR: number;
  totalINR: number;
  paymentStatus: "PENDING" | "PAID" | "VERIFIED" | "FAILED" | "COD Pending";
  orderStatus: OrderStatus | "Order Confirmed (COD)";
  paymentMethod: "RAZORPAY" | "STRIPE" | "UPI" | "CARD" | "NETBANKING" | "WALLET" | "CONCIERGE_WIRE" | "COD";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  trackingNumber?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
  preferredBudget?: BudgetTierId;
  savedAddresses?: Array<{
    id: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  }>;
}
