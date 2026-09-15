"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Truck, CalendarClock, Package } from "lucide-react";
import { LuxuryButton } from "@/components/ui/LuxuryButton";
import { getLocalOrders } from "@/lib/supabase/mockStore";

function OrderConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const orderNumber = searchParams.get("orderNumber");
  const paymentMethod = searchParams.get("paymentMethod") || "RAZORPAY";

  const [deliveryDate, setDeliveryDate] = useState("");

  useEffect(() => {
    // Calculate estimated delivery: 5-7 days from today
    const date = new Date();
    const days = Math.floor(Math.random() * 3) + 5; // 5, 6, or 7
    date.setDate(date.getDate() + days);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setDeliveryDate(date.toLocaleDateString("en-IN", options));
  }, []);

  const orders = getLocalOrders();
  const order =
    orders.find((o) => o.id === orderId || o.orderNumber === orderNumber) ||
    orders[orders.length - 1];

  return (
    <div className="min-h-screen bg-obsidian-950 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Success Icon & Title */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-full border border-emerald-glow/40 bg-gradient-to-b from-emerald-glow/10 to-transparent flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-emerald-glow" />
          </div>
          <span className="text-[10px] font-mono tracking-super-wide uppercase text-emerald-glow">
            Order Confirmed
          </span>
          <h1 className="text-3xl md:text-4xl font-serif text-white">
            Order #
            <span className="text-gold">{orderNumber || order?.orderNumber || "N/A"}</span>
          </h1>
        </div>

        {/* Delivery Timeline Card */}
        <div className="bg-obsidian-900 border border-white/10 rounded-lg p-8 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <Truck className="w-6 h-6 text-gold" />
            <h2 className="text-xl font-serif text-white">
              Delivery Timeline
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <CalendarClock className="w-5 h-5 text-emerald-glow mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-white">
                  Estimated Delivery
                </p>
                <p className="text-sm text-silver-dark">
                  Order will be delivered within{" "}
                  <span className="text-gold font-semibold">5 - 7 days</span>
                  .
                </p>
                <p className="text-xs text-silver-dark mt-1">
                  Expected on:{" "}
                  <span className="text-white font-mono">{deliveryDate}</span>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Package className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-white">
                  Quality Assurance
                </p>
                <p className="text-sm text-silver-dark">
                  Each timepiece undergoes 200-hour chronometric testing
                  and is registered in the Geneva Archives upon shipment.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4 space-y-2 text-xs text-silver-dark">
            <div className="flex justify-between">
              <span>Payment Method</span>
              <span className="text-white">{paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span>Order Total</span>
              <span className="text-gold font-mono">
                ₹{(order?.totalINR || 0).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tracking Number</span>
              <span className="text-white font-mono">
                {order?.trackingNumber || "Will be assigned shortly"}
              </span>
            </div>
          </div>
        </div>

        {/* Receipt Button */}
        <div className="flex justify-center">
          <LuxuryButton
            variant="gold"
            size="lg"
            icon={<span>🧾</span>}
            onClick={() =>
              router.push(
                `/payment-success?orderId=${orderId || ""}&orderNumber=${orderNumber || ""}&paymentMethod=${paymentMethod}`
              )
            }
          >
            View Printable Receipt
          </LuxuryButton>
        </div>

        {/* Background decorative elements */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-gold/20 rounded-full animate-butterfly-dot"></div>
        <div className="absolute bottom-32 right-16 w-1.5 h-1.5 bg-gold/30 rounded-full animate-butterfly-dot [animation-delay:1s]"></div>
        <div className="absolute top-40 right-8 w-2.5 h-2.5 bg-gold/15 rounded-full animate-butterfly-dot [animation-delay:2s]"></div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-obsidian-950 flex items-center justify-center">
          <div className="text-gold font-mono">Loading...</div>
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
