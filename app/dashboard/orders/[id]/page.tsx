"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Truck,
  Award,
  Download,
  Calendar
} from "lucide-react";
import { getLocalOrders } from "@/lib/supabase/mockStore";
import { Order, OrderStatus } from "@/lib/types/watch";
import { LuxuryButton } from "@/components/ui/LuxuryButton";

const TIMELINE_STAGES: OrderStatus[] = [
  "Order Placed",
  "Payment Confirmed",
  "Processing",
  "Craftsmanship Verification",
  "Dispatched",
  "Delivered",
];

export default function OrderTrackingPage() {
  const params = useParams();
  const id = params?.id as string;

  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const orders = getLocalOrders();
    const found = orders.find((o) => o.id === id || o.orderNumber === id);
    if (found) {
      setOrder(found);
    } else if (orders.length > 0) {
      setOrder(orders[0]); // fallback to first order for seamless demonstration
    }
  }, [id]);

  if (!order) {
    return (
      <div className="pt-32 pb-24 px-6 md:px-12 bg-obsidian-950 min-h-screen text-center">
        <h1 className="text-2xl font-serif text-white">Acquisition Record Not Found</h1>
        <p className="text-xs text-silver-dark mt-2">
          Unable to locate the specified ledger record.
        </p>
        <Link href="/dashboard" className="inline-block mt-4">
          <LuxuryButton variant="gold" size="sm">
            Return to Vault
          </LuxuryButton>
        </Link>
      </div>
    );
  }

  const currentStageIndex = TIMELINE_STAGES.indexOf(order.orderStatus as OrderStatus);

  return (
    <div className="pt-28 pb-24 px-6 md:px-12 bg-obsidian-950 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Back Link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-silver-dark hover:text-gold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Private Vault
        </Link>

        {/* Order Header Card */}
        <div className="p-6 md:p-8 bg-obsidian-900/80 border border-gold/30 rounded-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] font-mono tracking-super-wide uppercase text-gold">
              Geneva Provenance Registry
            </span>
            <h1 className="text-2xl md:text-3xl font-serif text-white mt-1">
              Order #{order.orderNumber}
            </h1>
            <p className="text-xs font-mono text-silver-dark mt-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gold" />
              Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "full" })}
            </p>
          </div>

          <div className="text-left md:text-right">
            <span className="text-[10px] font-mono text-silver-dark uppercase tracking-widest block">
              Total Investment
            </span>
            <span className="text-xl md:text-2xl font-mono text-gold font-bold">
              ₹{order.totalINR.toLocaleString("en-IN")}
            </span>
            <span className="text-[10px] font-mono text-emerald-glow block">
              Payment Status: {order.paymentStatus}
            </span>
          </div>
        </div>

        {/* Horological Chronometer Timeline */}
        <div className="p-8 bg-obsidian-900/40 border border-white/10 rounded-sm space-y-8">
          <div>
            <h3 className="text-lg font-serif text-white">Acquisition Progress Timeline</h3>
            <p className="text-xs text-silver-dark mt-0.5">
              Live updates from the Atelier Aurelion Geneva workshop and transit logistics.
            </p>
          </div>

          {/* Timeline Steps */}
          <div className="relative pl-6 md:pl-8 border-l-2 border-gold/40 space-y-8">
            {TIMELINE_STAGES.map((stage, idx) => {
              const isPastOrCurrent = idx <= (currentStageIndex === -1 ? 1 : currentStageIndex);
              const isCurrent = idx === (currentStageIndex === -1 ? 1 : currentStageIndex);

              return (
                <div key={stage} className="relative">
                  {/* Step Dot */}
                  <div
                    className={`absolute -left-[31px] md:-left-[39px] top-0 w-4 h-4 rounded-full border-2 transition-colors ${
                      isPastOrCurrent
                        ? "bg-gold border-gold shadow-gold-glow"
                        : "bg-obsidian-950 border-white/20"
                    }`}
                  />

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-serif tracking-wide ${
                          isCurrent
                            ? "text-gold font-bold"
                            : isPastOrCurrent
                            ? "text-white"
                            : "text-silver-dark/60"
                        }`}
                      >
                        {stage}
                      </span>
                      {isCurrent && (
                        <span className="text-[9px] font-mono bg-gold/15 text-gold border border-gold/30 px-1.5 py-0.2 rounded animate-pulse uppercase">
                          Active Stage
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-silver-dark font-sans">
                      {stage === "Order Placed" && "Client reservation received and registered into Atelier queue."}
                      {stage === "Payment Confirmed" && "Cryptographic settlement verified via 256-bit Razorpay banking protocol."}
                      {stage === "Processing" && "Calibre selected from climate-controlled vault for final calibration."}
                      {stage === "Craftsmanship Verification" && "Master Watchmaker 6-position chronometric inspection and optical testing."}
                      {stage === "Dispatched" && `Released to armored courier under tracking reference ${order.trackingNumber}.`}
                      {stage === "Delivered" && "Personal white-glove hand delivery completed with biometric sign-off."}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timepiece Details & Shipping Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-obsidian-900/60 border border-white/10 rounded-sm space-y-4">
            <h4 className="font-serif text-white text-base border-b border-white/10 pb-3">
              Allocated Timepiece(s)
            </h4>
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="relative w-16 h-16 bg-obsidian-950 rounded overflow-hidden flex-shrink-0">
                  <Image src={item.image} alt={item.productName} fill className="object-contain p-1" />
                </div>
                <div>
                  <h5 className="text-sm font-serif text-white">{item.productName}</h5>
                  <span className="text-xs font-mono text-gold">
                    Qty {item.quantity} · ₹{(item.priceINR * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-obsidian-900/60 border border-white/10 rounded-sm space-y-3 text-xs font-mono">
            <h4 className="font-serif text-white text-base border-b border-white/10 pb-3">
              Insured Transit Route
            </h4>
            <div className="text-silver space-y-1">
              <span className="text-[10px] uppercase text-gold block">Consignee:</span>
              <p className="text-white font-medium">{order.customerName}</p>
              <p>{order.shippingAddress.street}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
            <div className="pt-2 border-t border-white/5 flex items-center gap-2 text-emerald-glow text-[11px]">
              <ShieldCheck className="w-4 h-4" />
              <span>Full In-Transit Risk Insured by Lloyd&apos;s of London</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
