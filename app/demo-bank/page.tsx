"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCartStore } from "@/lib/store/cartStore";
import { saveLocalOrder } from "@/lib/supabase/mockStore";

function DemoBankContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const amount = searchParams.get("amount") || "0";
  const method = (searchParams.get("method") === "COD" ? "COD" : "UPI") as
    | "UPI"
    | "COD";

  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  const handleResult = (outcome: "success" | "failure") => {
    if (outcome === "failure") {
      router.push(
        `/payment-processing?outcome=failure&paymentMethod=${method}&amount=${amount}`,
      );
      return;
    }

    // Success: save the order locally (with real checkout details if provided)
    let customer = {
      customerName: "Guest Customer",
      email: "",
      phone: "",
      shippingAddress: {
        fullName: "Guest Customer",
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
      },
    };
    try {
      const raw = window.sessionStorage.getItem("aura_checkout_customer");
      if (raw) customer = JSON.parse(raw);
    } catch {
      /* fall back to guest */
    }

    const subtotal = items.reduce(
      (sum, item) => sum + item.product.priceINR * item.quantity,
      0,
    );
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + tax;
    const orderId = `ord_${Date.now()}`;
    const orderNumber = `AUR-${Math.floor(10000 + Math.random() * 89999)}`;

    saveLocalOrder({
      id: orderId,
      orderNumber,
      createdAt: new Date().toISOString(),
      customerName: customer.customerName,
      email: customer.email,
      phone: customer.phone,
      shippingAddress: customer.shippingAddress,
      items: items.map((item) => ({
        id: `item_${item.product.id}`,
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        priceINR: item.product.priceINR,
        image: item.product.images?.[0] || "",
      })),
      subtotalINR: subtotal,
      taxINR: tax,
      shippingINR: 0,
      totalINR: total,
      paymentStatus: "PAID",
      orderStatus: "Payment Confirmed",
      paymentMethod: method,
      razorpayOrderId: `pay_${method.toLowerCase()}_${Date.now()}`,
      razorpayPaymentId: `pay_ref_${Date.now()}`,
      trackingNumber: `AUR-EXP-${Math.floor(100000 + Math.random() * 900000)}`,
    });
    clearCart();

    router.push(
      `/payment-processing?outcome=success&orderId=${orderId}&orderNumber=${orderNumber}&paymentMethod=${method}`,
    );
  };

  return (
    <div className="min-h-screen bg-[#f5f6f8] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-sm border border-gray-200 px-8 py-10 text-center">
        {/* Razorpay-style logo mark */}
        <div className="flex justify-center mb-6">
          <svg width="44" height="52" viewBox="0 0 44 52" fill="none">
            <path
              d="M15 2h24L22 22h14L6 50 15 28H2L15 2z"
              fill="#3395FF"
              stroke="#1a6fd4"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        <h1 className="text-lg font-bold text-gray-900">
          Welcome to Razorpay Software Private Ltd Bank
        </h1>
        <p className="mt-3 text-sm text-gray-700">
          This is just a demo bank page.
        </p>
        <p className="mt-1 text-sm text-gray-700">
          You can choose whether to make this payment successful or not:
        </p>

        <p className="mt-4 text-xs font-mono text-gray-500">
          Amount: ₹{Number(amount).toLocaleString("en-IN")} · Method: {method}
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-6">
          <button
            onClick={() => handleResult("success")}
            className="w-full sm:min-w-[140px] sm:w-auto px-8 py-3 bg-[#22a06b] hover:bg-[#1c8a5b] text-white text-sm font-semibold rounded-md transition-colors"
          >
            Success
          </button>
          <button
            onClick={() => handleResult("failure")}
            className="w-full sm:min-w-[140px] sm:w-auto px-8 py-3 bg-[#e5635a] hover:bg-[#d14e45] text-white text-sm font-semibold rounded-md transition-colors"
          >
            Failure
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DemoBankPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f5f6f8] flex items-center justify-center text-sm text-gray-500">
          Loading bank page...
        </div>
      }
    >
      <DemoBankContent />
    </Suspense>
  );
}
