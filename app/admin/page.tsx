"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  Package,
  Layers,
  ShoppingBag,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Search,
  Lock
} from "lucide-react";
import { getLocalProducts, saveLocalProducts, getLocalOrders, updateLocalOrderStatus } from "@/lib/supabase/mockStore";
import { WatchProduct, Order, OrderStatus, BudgetTierId } from "@/lib/types/watch";
import { LuxuryButton } from "@/components/ui/LuxuryButton";
import { useUserStore } from "@/lib/store/userStore";

export default function AdminDashboardPage() {
  const router = useRouter();
  const isAdmin = useUserStore((s) => s.isAdmin);
  const [products, setProducts] = useState<WatchProduct[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<"products" | "orders" | "inventory">("products");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isAdmin) {
      router.push("/login");
    }
  }, [isAdmin, router]);

  // New product form modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWatch, setNewWatch] = useState<Partial<WatchProduct>>({
    name: "",
    slug: "",
    tagline: "",
    collection: "Tourbillon",
    budgetTier: "high_luxury",
    priceINR: 2500000,
    stockQuantity: 5,
    limitedEdition: true,
    editionSize: 50,
    movement: "Automatic Tourbillon",
    calibre: "Calibre AUR-8000",
    powerReserve: "72 Hours",
    frequency: "28,800 vph (4 Hz)",
    jewels: 32,
    waterResistance: "50m / 5 ATM",
    caseMaterial: "18K Rose Gold",
    caseDiameter: "42mm",
    caseThickness: "11.5mm",
    strapMaterial: "Black Alligator Leather",
    dialColor: "Skeletonized Anthracite",
    description: "An exceptional new creation from Atelier Aurelion.",
    images: ["/assets/intro/media_1788505911678.jpg"],
    modelUrl: "/models/watches/custom-model.glb",
  });

  useEffect(() => {
    setProducts(getLocalProducts());
    setOrders(getLocalOrders());
  }, []);

  const handleUpdateStock = (productId: string, delta: number) => {
    const updated = products.map((p) =>
      p.id === productId ? { ...p, stockQuantity: Math.max(0, p.stockQuantity + delta) } : p
    );
    setProducts(updated);
    saveLocalProducts(updated);
  };

  const handleUpdatePrice = (productId: string, newPrice: number) => {
    const updated = products.map((p) =>
      p.id === productId
        ? { ...p, priceINR: newPrice, formattedPrice: `₹${newPrice.toLocaleString("en-IN")}` }
        : p
    );
    setProducts(updated);
    saveLocalProducts(updated);
  };

  const handleOrderStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateLocalOrderStatus(orderId, newStatus);
    setOrders(getLocalOrders());
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWatch.name || !newWatch.priceINR) return;

    const slug = (newWatch.slug || newWatch.name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const completeProduct: WatchProduct = {
      ...(newWatch as WatchProduct),
      id: `aur-custom-${Date.now()}`,
      slug,
      formattedPrice: `₹${Number(newWatch.priceINR).toLocaleString("en-IN")}`,
      craftsmanshipNotes: [
        "Hand-beveled internal angles using gentian wood",
        "Heat-blued titanium screws",
        "Single-watchmaker chronometric assembly"
      ],
      features: ["Exhibition Sapphire Caseback", "COSC Certified Calibre", "5-Year Guarantee"],
      images: ["/assets/intro/media_1788505911678.jpg"],
    };

    const updated = [completeProduct, ...products];
    setProducts(updated);
    saveLocalProducts(updated);
    setShowAddModal(false);
  };

  // Metrics
  const totalInventoryValue = products.reduce((acc, p) => acc + p.priceINR * p.stockQuantity, 0);
  const totalOrdersRevenue = orders.reduce((acc, o) => acc + o.totalINR, 0);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.collection.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pt-28 pb-24 px-6 md:px-12 bg-obsidian-950 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-super-wide text-gold">
              <Shield className="w-3.5 h-3.5" /> Executive Atelier Console
            </div>
            <h1 className="text-3xl md:text-4xl font-serif text-white tracking-wide mt-1">
              HAUTE HORLOGERIE ADMINISTRATION
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <LuxuryButton
              variant="gold"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setShowAddModal(true)}
            >
              Add New Reference
            </LuxuryButton>
          </div>
        </div>

        {/* Executive Metrics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-obsidian-900/80 border border-white/10 rounded-sm space-y-1">
            <span className="text-[10px] font-mono text-silver-dark uppercase tracking-widest">
              Total Managed References
            </span>
            <span className="text-2xl font-serif text-white font-bold block">
              {products.length} Timepieces
            </span>
          </div>

          <div className="p-6 bg-obsidian-900/80 border border-white/10 rounded-sm space-y-1">
            <span className="text-[10px] font-mono text-silver-dark uppercase tracking-widest">
              Total Inventory Valuation
            </span>
            <span className="text-2xl font-mono text-gold font-bold block">
              ₹{(totalInventoryValue / 10000000).toFixed(2)} Cr
            </span>
          </div>

          <div className="p-6 bg-obsidian-900/80 border border-white/10 rounded-sm space-y-1">
            <span className="text-[10px] font-mono text-silver-dark uppercase tracking-widest">
              Active Client Orders
            </span>
            <span className="text-2xl font-serif text-emerald-glow font-bold block">
              {orders.length} Acquisitions
            </span>
          </div>

          <div className="p-6 bg-obsidian-900/80 border border-white/10 rounded-sm space-y-1">
            <span className="text-[10px] font-mono text-silver-dark uppercase tracking-widest">
              Settled Revenue
            </span>
            <span className="text-2xl font-mono text-white font-bold block">
              ₹{(totalOrdersRevenue / 100000).toFixed(2)} Lakh
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 gap-8">
          <button
            onClick={() => setActiveTab("products")}
            className={`pb-3 text-xs md:text-sm font-mono uppercase tracking-widest transition-colors relative flex items-center gap-2 ${
              activeTab === "products" ? "text-gold font-bold" : "text-silver-dark hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4" /> Products Catalog ({products.length})
            {activeTab === "products" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3 text-xs md:text-sm font-mono uppercase tracking-widest transition-colors relative flex items-center gap-2 ${
              activeTab === "orders" ? "text-gold font-bold" : "text-silver-dark hover:text-white"
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> Client Orders & Status ({orders.length})
            {activeTab === "orders" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
          </button>

          <button
            onClick={() => setActiveTab("inventory")}
            className={`pb-3 text-xs md:text-sm font-mono uppercase tracking-widest transition-colors relative flex items-center gap-2 ${
              activeTab === "inventory" ? "text-gold font-bold" : "text-silver-dark hover:text-white"
            }`}
          >
            <Package className="w-4 h-4" /> Inventory & Scarcity Control
            {activeTab === "inventory" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
          </button>
        </div>

        {/* TAB 1: PRODUCTS MANAGEMENT */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="relative w-72">
                <Search className="w-4 h-4 text-silver-dark absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search timepieces..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-obsidian-900 border border-white/15 focus:border-gold rounded px-3 py-2 pl-9 text-xs text-white outline-none"
                />
              </div>
            </div>

            <div className="border border-white/10 rounded overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-obsidian-900 text-silver-dark border-b border-white/10 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Timepiece</th>
                    <th className="p-4">Collection</th>
                    <th className="p-4">Price (INR)</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">3D Model</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-obsidian-950">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <div className="relative w-12 h-12 bg-obsidian-900 rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={product.images[0] || "/assets/intro/media_1788505911678.jpg"}
                            alt={product.name}
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                        <div>
                          <span className="font-serif text-sm text-white block">{product.name}</span>
                          <span className="text-[10px] text-silver-dark">{product.movement}</span>
                        </div>
                      </td>
                      <td className="p-4 text-silver-light">{product.collection}</td>
                      <td className="p-4 text-gold font-bold">
                        ₹{product.priceINR.toLocaleString("en-IN")}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateStock(product.id, -1)}
                            className="px-2 py-0.5 bg-white/10 hover:bg-white/20 rounded text-silver"
                          >
                            -
                          </button>
                          <span className="text-white font-bold">{product.stockQuantity}</span>
                          <button
                            onClick={() => handleUpdateStock(product.id, 1)}
                            className="px-2 py-0.5 bg-white/10 hover:bg-white/20 rounded text-silver"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-[10px] px-2 py-0.5 bg-emerald-deep text-emerald-glow border border-emerald-glow/30 rounded">
                          WebGL Active
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/watches/${product.slug}`}
                          className="text-gold hover:underline mr-4"
                        >
                          Inspect
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="text-center py-16 bg-obsidian-900/40 border border-white/10 rounded text-silver-dark">
                No orders placed yet.
              </div>
            ) : (
              <div className="border border-white/10 rounded overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-obsidian-900 text-silver-dark border-b border-white/10 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4">Order #</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Total (INR)</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4">Workflow Status</th>
                      <th className="p-4 text-right">Change Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 bg-obsidian-950">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 text-white font-bold">{order.orderNumber}</td>
                        <td className="p-4">
                          <span className="text-white block">{order.customerName}</span>
                          <span className="text-[10px] text-silver-dark">{order.email}</span>
                        </td>
                        <td className="p-4 text-gold font-bold">
                          ₹{order.totalINR.toLocaleString("en-IN")}
                        </td>
                        <td className="p-4">
                          <span className="text-[10px] px-2 py-0.5 bg-emerald-deep text-emerald-glow rounded border border-emerald-glow/30">
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="p-4 text-white font-semibold">{order.orderStatus}</td>
                        <td className="p-4 text-right">
                          <select
                            value={order.orderStatus}
                            onChange={(e) =>
                              handleOrderStatusChange(order.id, e.target.value as OrderStatus)
                            }
                            className="bg-obsidian-900 border border-white/20 text-xs text-white rounded px-2 py-1 outline-none font-mono focus:border-gold"
                          >
                            <option value="Order Placed">Order Placed</option>
                            <option value="Payment Confirmed">Payment Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Craftsmanship Verification">Craftsmanship Verification</option>
                            <option value="Dispatched">Dispatched</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: INVENTORY */}
        {activeTab === "inventory" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((p) => (
              <div
                key={p.id}
                className="p-5 bg-obsidian-900/70 border border-white/10 rounded space-y-3"
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-serif text-white text-sm line-clamp-1">{p.name}</h4>
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                      p.stockQuantity <= 2
                        ? "bg-red-950 text-red-400 border border-red-500/40"
                        : "bg-emerald-deep text-emerald-glow border border-emerald-glow/30"
                    }`}
                  >
                    {p.stockQuantity} In Vault
                  </span>
                </div>
                <div className="text-xs font-mono text-silver-dark">
                  <p>Price: <span className="text-gold font-bold">{p.formattedPrice}</span></p>
                  <p>Movement: <span className="text-white">{p.movement}</span></p>
                  <p>Material: <span className="text-white">{p.caseMaterial}</span></p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODAL: ADD NEW TIMEPIECE */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-obsidian-950 border border-gold/40 p-8 rounded-sm max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6">
              <h3 className="text-2xl font-serif text-white">Create New Horological Reference</h3>

              <form onSubmit={handleCreateProduct} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-silver-dark">Reference Name</label>
                  <input
                    type="text"
                    required
                    value={newWatch.name}
                    onChange={(e) => setNewWatch({ ...newWatch, name: e.target.value })}
                    placeholder="Aurelion Perpetual Titanium"
                    className="w-full bg-obsidian-900 border border-white/15 rounded px-3 py-2 text-xs text-white outline-none focus:border-gold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-silver-dark">Price (INR)</label>
                    <input
                      type="number"
                      required
                      value={newWatch.priceINR}
                      onChange={(e) => setNewWatch({ ...newWatch, priceINR: Number(e.target.value) })}
                      className="w-full bg-obsidian-900 border border-white/15 rounded px-3 py-2 text-xs text-white outline-none focus:border-gold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-silver-dark">Initial Stock</label>
                    <input
                      type="number"
                      required
                      value={newWatch.stockQuantity}
                      onChange={(e) => setNewWatch({ ...newWatch, stockQuantity: Number(e.target.value) })}
                      className="w-full bg-obsidian-900 border border-white/15 rounded px-3 py-2 text-xs text-white outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-silver-dark">Collection</label>
                    <select
                      value={newWatch.collection}
                      onChange={(e) => setNewWatch({ ...newWatch, collection: e.target.value as any })}
                      className="w-full bg-obsidian-900 border border-white/15 rounded px-3 py-2 text-xs text-white outline-none focus:border-gold"
                    >
                      <option value="Tourbillon">Tourbillon</option>
                      <option value="Skeleton">Skeleton</option>
                      <option value="Chronograph">Chronograph</option>
                      <option value="Heritage">Heritage</option>
                      <option value="Grand Complication">Grand Complication</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-silver-dark">Budget Priority Tier</label>
                    <select
                      value={newWatch.budgetTier}
                      onChange={(e) => setNewWatch({ ...newWatch, budgetTier: e.target.value as BudgetTierId })}
                      className="w-full bg-obsidian-900 border border-white/15 rounded px-3 py-2 text-xs text-white outline-none focus:border-gold"
                    >
                      <option value="affordable_luxury">Affordable Luxury</option>
                      <option value="premium">Premium</option>
                      <option value="high_luxury">High Luxury</option>
                      <option value="collector">Collector</option>
                      <option value="ultra_luxury">Ultra Luxury</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-silver-dark">3D GLB Model Path</label>
                  <input
                    type="text"
                    value={newWatch.modelUrl}
                    onChange={(e) => setNewWatch({ ...newWatch, modelUrl: e.target.value })}
                    className="w-full bg-obsidian-900 border border-white/15 rounded px-3 py-2 text-xs text-white outline-none focus:border-gold font-mono"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded border border-white/20 text-xs text-silver hover:text-white"
                  >
                    Cancel
                  </button>
                  <LuxuryButton type="submit" variant="gold" size="sm">
                    Publish Reference to Vault
                  </LuxuryButton>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
