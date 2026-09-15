"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ShieldCheck, Clock, ArrowRight, Download, Eye } from "lucide-react";
import { LuxuryButton } from "@/components/ui/LuxuryButton";
import { getLocalOrders } from "@/lib/supabase/mockStore";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const orderNumber = searchParams.get("orderNumber") || "AUR-89201";

  const orders = getLocalOrders();
  const order = orders.find((o) => o.id === orderId || o.orderNumber === orderNumber) || orders[0];

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 bg-obsidian-950 min-h-screen flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto text-center space-y-8 animate-fadeIn">
        {/* Subtle Luxury Success Icon */}
        <div className="w-20 h-20 rounded-full border border-gold/40 bg-gradient-to-b from-gold/10 to-transparent flex items-center justify-center mx-auto text-gold shadow-gold-glow">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        {/* Headline */}
        <div className="space-y-3">
          <span className="text-[10px] font-mono tracking-super-wide uppercase text-gold">
            Official Acquisition Confirmation
          </span>
          <h1 className="text-3xl md:text-5xl font-serif text-white tracking-wide">
            PAYMENT CONFIRMED
          </h1>
          <p className="text-xs md:text-sm text-silver-dark max-w-md mx-auto leading-relaxed">
            Your timepiece has been reserved and registered into the Atelier Aurelion Geneva Ledger. Your provenance certificate is being prepared.
          </p>
        </div>

        {/* Order Details Card */}
        {order && (
          <div className="bg-obsidian-900/90 border border-gold/30 p-6 md:p-8 rounded-sm text-left space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono text-silver-dark uppercase tracking-wider block">
                  Order Designation
                </span>
                <span className="text-lg font-mono text-white font-bold">
                  {order.orderNumber}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono text-silver-dark uppercase tracking-wider block">
                  Total Settlement
                </span>
                <span className="text-lg font-mono text-gold font-bold">
                  ₹{order.totalINR.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Items Summary */}
            <div className="space-y-2 py-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-silver-dark block">
                Acquired Timepiece(s):
              </span>
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-xs font-serif text-white">
                  <span>{item.productName} (×{item.quantity})</span>
                  <span className="font-mono text-gold">
                    ₹{(item.priceINR * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            {/* Status Timeline Preview */}
            <div className="p-3 bg-obsidian-950 rounded border border-white/5 space-y-1.5 text-xs font-mono">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-silver-dark">Current Stage:</span>
                <span className="text-gold font-semibold uppercase">{order.orderStatus}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-silver-dark">Tracking ID:</span>
                <span className="text-white">{order.trackingNumber || "AUR-EXP-401928"}</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Link href={order ? `/dashboard/orders/${order.id}` : "/dashboard"}>
            <LuxuryButton variant="gold" size="md" icon={<Eye className="w-4 h-4" />}>
              Track Order in Private Vault
            </LuxuryButton>
          </Link>
          <Link href="/watches">
            <LuxuryButton variant="outline" size="md">
              Continue Exploring Catalog
            </LuxuryButton>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-obsidian-950" />}>
      <OrderSuccessContent />
    </Suspense>
  );
}
