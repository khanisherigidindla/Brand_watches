"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
export const CartDrawer: React.FC = () => {
  const { items, isOpen, closeCart, removeItem, updateQuantity } = useCartStore();
  const sub = items.reduce((a, i) => a + i.product.priceINR * i.quantity, 0);
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div onClick={closeCart} className="absolute inset-0 bg-slate-900/40" />
      <div className="absolute inset-y-0 right-0 w-screen max-w-md bg-white shadow-2xl flex flex-col animate-slideLeft">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900">Your Bag ({items.reduce((a, i) => a + i.quantity, 0)})</h2>
          <button onClick={closeCart} aria-label="Close cart" className="p-2 hover:bg-slate-100 rounded-full"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="w-10 h-10 mx-auto text-slate-300" />
              <p className="mt-3 font-bold text-slate-900">Your bag is empty</p>
              <Link href="/dashboard" onClick={closeCart} className="mt-4 inline-block bg-[#0e3a5d] text-white text-sm font-bold rounded-lg px-6 py-3">Shop watches</Link>
            </div>
          ) : items.map(({ product, quantity }) => (
            <div key={product.id} className="flex gap-3 border border-slate-200 rounded-xl p-3">
              <div className="relative w-20 h-20 bg-white shrink-0">
                <Image src={product.images[0]} alt={product.name} fill className="object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{product.name}</p>
                <p className="text-xs text-slate-500">Rs {product.priceINR.toLocaleString("en-IN")}</p>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center border border-slate-200 rounded-lg">
                    <button onClick={() => updateQuantity(product.id, quantity - 1)} className="px-2.5 py-1 text-sm font-bold">-</button>
                    <span className="px-2 text-sm font-bold">{quantity}</span>
                    <button onClick={() => updateQuantity(product.id, quantity + 1)} className="px-2.5 py-1 text-sm font-bold">+</button>
                  </div>
                  <button onClick={() => removeItem(product.id)} className="text-xs font-bold text-red-600">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div className="p-5 border-t border-slate-200">
            <div className="text-center">
              <div className="flex justify-center text-sm font-bold text-slate-900 mb-3">
                <span>Subtotal</span><span className="ml-2">Rs {sub.toLocaleString("en-IN")}</span>
              </div>
              <Link href="/checkout" onClick={closeCart} className="block w-full max-w-xs mx-auto bg-[#0e3a5d] text-white text-sm font-bold rounded-lg px-6 py-3.5">Proceed to checkout</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
