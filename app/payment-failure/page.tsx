"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { XCircle, ShoppingBag, RotateCw } from "lucide-react";
import { LuxuryButton } from "@/components/ui/LuxuryButton";
import { getLocalOrders } from "@/lib/supabase/mockStore";

function PaymentFailureContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const orderNumber = searchParams.get("orderNumber");
  const paymentMethod = searchParams.get("paymentMethod") || "UPI";

  const orders = getLocalOrders();
  const order =
    orders.find((o) => o.id === orderId || o.orderNumber === orderNumber) ||
    orders[orders.length - 1];

  const handleRetry = () => {
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-obsidian-950 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Failure Icon & Title */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-full border border-red-500/40 bg-gradient-to-b from-red-500/10 to-transparent flex items-center justify-center mx-auto">
            <XCircle className="w-10 h-10 text-red-400" />
          </div>
          <span className="text-[10px] font-mono tracking-super-wide uppercase text-red-400">
            Payment Declined
          </span>
          <h1 className="text-3xl md:text-4xl font-serif text-white">
            Transaction Failed
          </h1>
          <p className="text-silver-dark text-sm max-w-md mx-auto">
            Your payment could not be processed. The transaction has been
            cancelled and no funds were charged. Please review your details
            and try again.
          </p>
        </div>

        {/* Failure Details */}
        <div className="bg-obsidian-900 border border-white/10 rounded-lg p-6 space-y-4">
          <h2 className="text-sm font-serif text-white">Transaction Details</h2>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-silver-dark">Order Number</div>
            <div className="text-right text-white font-mono">
              {orderNumber || order?.orderNumber || "N/A"}
            </div>
            <div className="text-silver-dark">Payment Method</div>
            <div className="text-right text-white">{paymentMethod}</div>
            <div className="text-silver-dark">Amount</div>
            <div className="text-right text-white font-mono">
              ₹{(order?.totalINR || 0).toLocaleString("en-IN")}
            </div>
            <div className="text-silver-dark">Status</div>
            <div className="text-right text-red-400 font-mono">FAILED</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <LuxuryButton
            variant="gold"
            size="lg"
            icon={<RotateCw className="w-4 h-4" />}
            onClick={handleRetry}
          >
            Retry Payment
          </LuxuryButton>
          <Link href="/watches">
            <LuxuryButton variant="outline" size="lg" icon={<ShoppingBag className="w-4 h-4" />}>
              Continue Shopping
            </LuxuryButton>
          </Link>
        </div>

        {/* Help */}
        <div className="text-center text-xs text-silver-dark">
          Need assistance? Contact our concierge at{" "}
          <span className="text-gold">concierge@aurelion.com</span> or{" "}
          <span className="text-gold">+91 22 1234 5678</span>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailurePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-obsidian-950 flex items-center justify-center">
          <div className="text-gold font-mono">Loading...</div>
        </div>
      }
    >
      <PaymentFailureContent />
    </Suspense>
  );
}
