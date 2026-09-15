"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Lock,
  ArrowRight,
  ArrowLeft,
  CreditCard,
  Truck,
  Building,
  Sparkles
} from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { useUserStore } from "@/lib/store/userStore";
import { LuxuryButton } from "@/components/ui/LuxuryButton";
import { saveLocalOrder } from "@/lib/supabase/mockStore";
import { Order } from "@/lib/types/watch";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotalINR, getTaxINR, getTotalINR, clearCart } = useCartStore();
  const user = useUserStore((s) => s.user);

  const [step, setStep] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  // Payment method & fields
  const [payMethod, setPayMethod] = useState<"UPI" | "COD">("UPI");
  const [upiId, setUpiId] = useState("");
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "success" | "failed">("idle");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [isOtpVerifying, setIsOtpVerifying] = useState(false);

  // Customer Form State
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    deliveryInstructions: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePayment = (): string => {
    if (payMethod === "UPI") {
      if (!/^[\w.\-]{2,}@[A-Za-z]{2,}$/.test(upiId.trim())) {
        return "Please enter a valid UPI ID (e.g. yourname@upi).";
      }
    }
    // Stripe and Cash on Delivery require no extra validation here
    return "";
  };

  const handleUPISubmit = () => {
    const err = validatePayment();
    if (err) {
      setPaymentError(err);
      return;
    }
    if (!formData.street.trim() || !formData.city.trim()) {
      setPaymentError("Please provide a complete delivery address before paying.");
      return;
    }
    setPaymentError("");
    setOtpError("");
    setOtpValue("");
    setShowOtpScreen(true);
  };

  const saveOrder = (method: "UPI" | "COD") => {
    const orderNumber = `AUR-${Math.floor(10000 + Math.random() * 90000)}`;
    const savedOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      customerName: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      shippingAddress: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
      },
      items: items.map((item) => ({
        id: `item_${item.product.id}`,
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        priceINR: item.product.priceINR,
        image: item.product.images[0] || "/assets/intro/media_1788505911678.jpg",
      })),
      subtotalINR: subtotal,
      taxINR: tax,
      shippingINR: 0,
      totalINR: total,
      paymentStatus: method === "COD" ? "COD Pending" : "PAID",
      orderStatus: method === "COD" ? "Order Confirmed (COD)" : "Payment Confirmed",
      paymentMethod: method,
      razorpayOrderId: method !== "COD" ? `pay_${method.toLowerCase()}_${Date.now()}` : undefined,
      razorpayPaymentId: method !== "COD" ? `pay_ref_${Date.now()}` : undefined,
      trackingNumber: `AUR-EXP-${Math.floor(100000 + Math.random() * 900000)}`,
    };
    saveLocalOrder(savedOrder);
    clearCart();
    return savedOrder;
  };

  const handleVerifyOTP = () => {
    const value = otpValue.trim();
    if (value.length !== 6) {
      setOtpError("Please enter the 6-digit OTP.");
      return;
    }
    setOtpError("");
    setIsOtpVerifying(true);
    // Stash checkout details so the demo bank page can attach them to the order
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(
        "aura_checkout_customer",
        JSON.stringify({
          customerName: `${formData.firstName} ${formData.lastName}`.trim() || "Guest Customer",
          email: formData.email || "",
          phone: formData.phone || "",
          shippingAddress: {
            fullName: `${formData.firstName} ${formData.lastName}`.trim() || "Guest Customer",
            street: formData.street || "",
            city: formData.city || "",
            state: formData.state || "",
            postalCode: formData.postalCode || "",
            country: "India",
          },
        })
      );
    }
    setTimeout(() => {
      setIsOtpVerifying(false);
      // Hand off to the demo bank page where the user picks Success / Failure
      router.push(`/demo-bank?amount=${total}&method=UPI`);
    }, 400);
  };

  const handleRetryPayment = () => {
    setPaymentStatus("idle");
    setOtpValue("");
    setOtpError("");
    setShowOtpScreen(false);
  };

  const handleCOD = () => {
    if (!formData.street.trim() || !formData.city.trim()) {
      setPaymentError("Please provide a complete delivery address before placing order.");
      return;
    }
    setPaymentError("");
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const savedOrder = saveOrder("COD");
      const days = Math.floor(Math.random() * 5) + 3;
      const date = new Date();
      date.setDate(date.getDate() + days);
      const options: Intl.DateTimeFormatOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
      setDeliveryDate(date.toLocaleDateString("en-IN", options));
      setPaymentStatus("success");
      router.push(`/payment-success?orderId=${savedOrder.id}&orderNumber=${savedOrder.orderNumber}&paymentMethod=COD`);
    }, 1500);
  };

  const subtotal = getSubtotalINR();
  const tax = getTaxINR();
  const total = getTotalINR();

  const handleRazorpayPayment = async () => {
    // Validate delivery destination (Step 2)
    if (!formData.street.trim() || !formData.city.trim() || !formData.state.trim() || !formData.postalCode.trim()) {
      setPaymentError("Please provide a complete delivery address before paying.");
      return;
    }
    // Validate the chosen online payment method
    const payErr = validatePayment();
    if (payErr) {
      setPaymentError(payErr);
      return;
    }

    setIsProcessing(true);
    setPaymentError("");

    try {
      // 1. Create order on server
      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountINR: total,
          receiptId: `aur_rec_${Date.now()}`,
          notes: {
            customer: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            payment_method: payMethod,
          },
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || "Order creation failed");

      // 2. For UPI, show OTP verification screen
      if (payMethod === "UPI") {
        setShowOtpScreen(true);
        setIsProcessing(false);
        return;
      }

      // 3. For other methods, open Razorpay checkout popup
      const isTestMode = orderData.mode === "sandbox_simulator" || !orderData.id.startsWith("order_");
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_luxury_aura";

      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "AURA",
        description: "Luxury Timepiece Acquisition",
        order_id: orderData.id,
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          customer: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
        },
        theme: {
          color: "#D4AF37",
        },
        handler: async function (response: any) {
          // 3. Handle payment success callback
          try {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                isSandbox: isTestMode,
                isTestMode: isTestMode,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyData.verified) throw new Error("Payment signature verification failed");

            // 4. Save order to persistent store
            const orderNumber = `AUR-${Math.floor(10000 + Math.random() * 90000)}`;
            const completedOrder: Order = {
              id: `ord_${Date.now()}`,
              orderNumber,
              createdAt: new Date().toISOString(),
              customerName: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              phone: formData.phone,
              shippingAddress: {
                street: formData.street,
                city: formData.city,
                state: formData.state,
                postalCode: formData.postalCode,
                country: formData.country,
              },
              items: items.map((item) => ({
                id: `item_${item.product.id}`,
                productId: item.product.id,
                productName: item.product.name,
                quantity: item.quantity,
                priceINR: item.product.priceINR,
                image: item.product.images[0] || "/assets/intro/media_1788505911678.jpg",
              })),
              subtotalINR: subtotal,
              taxINR: tax,
              shippingINR: 0,
              totalINR: total,
              paymentStatus: "PAID",
              orderStatus: "Payment Confirmed",
              paymentMethod: payMethod,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              trackingNumber: `AUR-EXP-${Math.floor(100000 + Math.random() * 900000)}`,
            };

            saveLocalOrder(completedOrder);
            clearCart();
            setIsProcessing(false);
            router.push(`/payment-success?orderId=${completedOrder.id}&orderNumber=${completedOrder.orderNumber}&paymentMethod=${payMethod}`);
          } catch (err: unknown) {
            setIsProcessing(false);
            setPaymentError((err as Error).message || "Payment verification failed.");
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            setPaymentError("Payment cancelled. Please try again.");
          },
        },
      };

      // Open Razorpay checkout
      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (err: unknown) {
      setIsProcessing(false);
      setPaymentError((err as Error).message || "An unexpected error occurred during acquisition.");
    }
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && items.length === 0) {
      router.push("/watches");
    }
  }, [mounted, items.length, router]);

  if (!mounted || items.length === 0) {
    return null;
  }

  return (
    <div className="pt-28 pb-24 px-6 md:px-12 bg-white min-h-screen">
      <div className="max-w-screen-2xl mx-auto">
        {/* Checkout Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-super-wide text-[#0e3a5d]">
            Secured Client Acquisition Protocol
          </span>
          <h1 className="text-3xl md:text-5xl font-serif text-slate-900 tracking-wide">
            TIMEPIECE ACQUISITION
          </h1>
        </div>

        {/* Step Indicator */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex justify-between items-center relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
            <div
              className="absolute top-1/2 left-0 h-0.5 bg-[#0e3a5d] -translate-y-1/2 z-0 transition-all duration-500"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />

            {[
              { num: 1, label: "Client Details" },
              { num: 2, label: "Delivery Address" },
              { num: 3, label: "Review Portfolio" },
              { num: 4, label: "Payment & Settlement" },
            ].map((s) => (
              <div key={s.num} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 border ${
                    step >= s.num
                      ? "bg-[#0e3a5d] text-white border-[#0e3a5d]"
                      : "bg-white text-slate-500 border-slate-200"
                  }`}
                >
                  {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mt-2 hidden sm:block">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form & Summary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
          {/* Main Step Content Area */}
          <div className="lg:col-span-7 bg-white/70 border border-slate-200 p-6 md:p-10 rounded-sm">
            {/* STEP 1: CLIENT INFORMATION */}
            {step === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h3 className="text-xl font-serif text-slate-900">Client Identification</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Provide the official name for the Geneva Registry Certificate of Provenance.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full bg-white border border-slate-200 focus:border-[#0e3a5d] rounded px-3.5 py-2.5 text-xs text-slate-900 outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full bg-white border border-slate-200 focus:border-[#0e3a5d] rounded px-3.5 py-2.5 text-xs text-slate-900 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                    Email Address (for encrypted documentation)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-white border border-slate-200 focus:border-[#0e3a5d] rounded px-3.5 py-2.5 text-xs text-slate-900 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                    Contact Phone (for armored delivery courier coordination)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full bg-white border border-slate-200 focus:border-[#0e3a5d] rounded px-3.5 py-2.5 text-xs text-slate-900 outline-none"
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <LuxuryButton
                    variant="gold"
                    size="md"
                    onClick={() => setStep(2)}
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    Continue to Delivery Address
                  </LuxuryButton>
                </div>
              </div>
            )}

            {/* STEP 2: SHIPPING ADDRESS */}
            {step === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h3 className="text-xl font-serif text-slate-900">Insured Delivery Destination</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    White-glove armored transit with biometric ID verification upon arrival.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                    Street Address & Residence / Suite
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    required
                    className="w-full bg-white border border-slate-200 focus:border-[#0e3a5d] rounded px-3.5 py-2.5 text-xs text-slate-900 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full bg-white border border-slate-200 focus:border-[#0e3a5d] rounded px-3.5 py-2.5 text-xs text-slate-900 outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                      State / Province
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="w-full bg-white border border-slate-200 focus:border-[#0e3a5d] rounded px-3.5 py-2.5 text-xs text-slate-900 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                      Postal Code / PIN
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      required
                      className="w-full bg-white border border-slate-200 focus:border-[#0e3a5d] rounded px-3.5 py-2.5 text-xs text-slate-900 outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      disabled
                      className="w-full bg-white/50 border border-slate-200 rounded px-3.5 py-2.5 text-xs text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                    Special Concierge Delivery Protocol Notes
                  </label>
                  <textarea
                    name="deliveryInstructions"
                    rows={2}
                    value={formData.deliveryInstructions}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-200 focus:border-[#0e3a5d] rounded px-3.5 py-2 text-xs text-slate-900 outline-none"
                  />
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs font-mono text-slate-500 hover:text-slate-900 flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to Client Details
                  </button>
                  <LuxuryButton
                    variant="gold"
                    size="md"
                    onClick={() => setStep(3)}
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    Review Acquisition
                  </LuxuryButton>
                </div>
              </div>
            )}

            {/* STEP 3: ORDER REVIEW */}
            {step === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h3 className="text-xl font-serif text-slate-900">Review Portfolio Allocation</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Confirm timepiece references, serial provenance, and delivery destination.
                  </p>
                </div>

                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center gap-4 p-4 bg-white rounded border border-slate-200"
                    >
                      <div className="relative w-16 h-16 bg-white rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={item.product.images[0] || "/assets/intro/media_1788505911678.jpg"}
                          alt={item.product.name}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-serif text-slate-900">{item.product.name}</h4>
                        <span className="text-[10px] font-mono text-[#0e3a5d] block">
                          Qty: {item.quantity} · ₹{(item.product.priceINR * item.quantity).toLocaleString("en-IN")}
                        </span>
                        {item.engraving && (
                          <span className="text-[9px] text-slate-500 italic block">
                            Engraving: &ldquo;{item.engraving}&rdquo;
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-white rounded border border-slate-200 space-y-2 text-xs font-mono text-slate-500">
                  <span className="text-[#0e3a5d] uppercase tracking-wider text-[10px] block">
                    Designated Recipient:
                  </span>
                  <p className="text-slate-900">
                    {formData.firstName} {formData.lastName} ({formData.phone})
                  </p>
                  <p>
                    {formData.street}, {formData.city}, {formData.state} - {formData.postalCode}
                  </p>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    onClick={() => setStep(2)}
                    className="text-xs font-mono text-slate-500 hover:text-slate-900 flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" /> Edit Address
                  </button>
                  <LuxuryButton
                    variant="gold"
                    size="md"
                    onClick={() => setStep(4)}
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    Proceed to Payment Settlement
                  </LuxuryButton>
                </div>
              </div>
            )}

            {/* STEP 4: PAYMENT & SETTLEMENT VIA RAZORPAY */}
            {step === 4 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h3 className="text-xl font-serif text-slate-900">Payment Method</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Pay via UPI or choose Cash on Delivery. Your timepiece is insured and
                    delivered to the address confirmed in Step 2.
                  </p>
                </div>

                {/* Payment Status: Success */}
                {paymentStatus === "success" && (
                  <div className="p-8 bg-white rounded border border-emerald-500/50 text-center space-y-4">
                    <div className="text-5xl">✅</div>
                    <h4 className="text-xl font-serif text-emerald-600">Payment Successful!</h4>
                    <p className="text-sm text-slate-500">
                      Your order has been confirmed and will be delivered to:
                    </p>
                    <p className="text-xs text-slate-900 font-mono">
                      {formData.street}, {formData.city}, {formData.state} - {formData.postalCode}
                    </p>
                    <div className="p-3 bg-white/80 rounded border border-emerald-500/30">
                      <p className="text-xs text-[#0e3a5d] font-semibold">📦 Estimated Delivery</p>
                      <p className="text-sm text-slate-900 font-mono mt-1">{deliveryDate}</p>
                    </div>
                    <p className="text-xs text-slate-500">
                      You'll receive your ordered product within the estimated date. Track your order from the dashboard.
                    </p>
                    <Link href="/watches">
                      <LuxuryButton variant="gold" size="lg" icon={<Sparkles className="w-4 h-4" />}>
                        Continue Shopping
                      </LuxuryButton>
                    </Link>
                  </div>
                )}

                {/* Payment Status: Failed */}
                {paymentStatus === "failed" && (
                  <div className="p-8 bg-white rounded border border-red-500/50 text-center space-y-4">
                    <div className="text-5xl">❌</div>
                    <h4 className="text-xl font-serif text-red-600">Payment Failed</h4>
                    <p className="text-sm text-slate-500">
                      {otpError || "The OTP you entered is incorrect. Please try again."}
                    </p>
                    <div className="flex justify-center gap-3">
                      <LuxuryButton variant="gold" size="lg" onClick={handleRetryPayment} icon={<ArrowLeft className="w-4 h-4" />}>
                        Retry Payment
                      </LuxuryButton>
                    </div>
                  </div>
                )}

                {/* Payment Method Selection & Inputs */}
                {paymentStatus === "idle" && !showOtpScreen && (
                  <>
                    <div className="p-6 bg-white rounded border border-[#0e3a5d]/30 space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setPayMethod("UPI")}
                          className={`rounded border px-3 py-4 text-left transition-all ${
                            payMethod === "UPI"
                              ? "bg-[#0e3a5d] text-white border-[#0e3a5d]"
                              : "bg-white text-slate-900 border-slate-200 hover:border-[#0e3a5d]/60"
                          }`}
                        >
                          <div className="text-xl">📲</div>
                          <div className="text-[11px] font-mono uppercase tracking-wider mt-1">UPI</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPayMethod("COD")}
                          className={`rounded border px-3 py-4 text-left transition-all ${
                            payMethod === "COD"
                              ? "bg-[#0e3a5d] text-white border-[#0e3a5d]"
                              : "bg-white text-slate-900 border-slate-200 hover:border-[#0e3a5d]/60"
                          }`}
                        >
                          <div className="text-xl">💵</div>
                          <div className="text-[11px] font-mono uppercase tracking-wider mt-1">Cash on Delivery</div>
                        </button>
                      </div>

                      {payMethod === "UPI" && (
                        <div className="space-y-3 pt-3 border-t border-slate-200">
                          <label className="block text-xs text-slate-500 font-mono">
                            UPI ID <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="yourname@upi"
                            className="w-full bg-white border border-slate-200 rounded px-4 py-3 text-slate-900 text-sm focus:border-[#0e3a5d] focus:outline-none transition-colors"
                          />
                          <p className="text-[10px] text-slate-500">
                            Payment will be made to <span className="text-[#0e3a5d]">watchbrand@upi</span>
                          </p>
                        </div>
                      )}

                      {payMethod === "COD" && (
                        <div className="space-y-2 pt-3 border-t border-slate-200">
                          <p className="text-xs text-slate-500">
                            Pay with cash when your order is delivered. No online payment required.
                          </p>
                          <p className="text-[10px] text-[#0e3a5d]">
                            ⚠️ Additional ₹50 COD fee may apply.
                          </p>
                        </div>
                      )}

                      <div className="pt-4 border-t border-slate-200 flex justify-between items-baseline font-mono">
                        <span className="text-xs text-slate-500">Amount:</span>
                        <span className="text-2xl text-[#0e3a5d] font-bold">
                          ₹{total.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    {paymentError && (
                      <div className="p-3 bg-red-50 border border-red-300 rounded text-xs text-red-700">
                        {paymentError}
                      </div>
                    )}

                    <div className="pt-4 flex justify-between items-center">
                      <button
                        onClick={() => setStep(3)}
                        className="text-xs font-mono text-slate-500 hover:text-slate-900 flex items-center gap-1.5"
                      >
                        <ArrowLeft className="w-4 h-4" /> Back to Review
                      </button>

                      {payMethod === "UPI" ? (
                        <LuxuryButton
                          variant="gold"
                          size="lg"
                          onClick={handleUPISubmit}
                          icon={<Lock className="w-4 h-4" />}
                        >
                          Pay via UPI
                        </LuxuryButton>
                      ) : (
                        <LuxuryButton
                          variant="gold"
                          size="lg"
                          onClick={handleCOD}
                          disabled={isProcessing}
                          icon={<Truck className="w-4 h-4" />}
                        >
                          {isProcessing ? "Placing Order..." : "Place COD Order"}
                        </LuxuryButton>
                      )}
                    </div>
                  </>
                )}

                {/* OTP Verification Screen */}
                {paymentStatus === "idle" && showOtpScreen && (
                  <div className="p-8 bg-white rounded border border-[#0e3a5d]/30 space-y-5">
                    <div className="text-center space-y-2">
                      <div className="text-4xl">🔐</div>
                      <h4 className="text-lg font-serif text-slate-900">Verify OTP</h4>
                      <p className="text-xs text-slate-500">
                        Enter the 6-digit OTP sent to your UPI app for <span className="text-[#0e3a5d]">watchbrand@upi</span>
                      </p>
                    </div>

                    <div className="max-w-xs mx-auto space-y-3">
                      <label className="block text-xs text-slate-500 font-mono text-center">
                        Enter OTP
                      </label>
                      <input
                        type="text"
                        value={otpValue}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                          setOtpValue(val);
                          setOtpError("");
                        }}
                        placeholder="000000"
                        maxLength={6}
                        className="w-full bg-white border border-slate-200 rounded px-4 py-4 text-slate-900 text-2xl text-center tracking-[0.5em] font-mono focus:border-[#0e3a5d] focus:outline-none transition-colors"
                        autoFocus
                      />
                      {otpError && (
                        <p className="text-xs text-red-600 text-center">{otpError}</p>
                      )}
                    </div>

                    {/* Test-mode note: outcome chosen on the demo bank page */}
                    <p className="text-[10px] text-slate-500 text-center font-mono uppercase tracking-wider">
                      After verifying, the demo bank page will let you choose
                      Success or Failure
                    </p>

                    <div className="flex justify-between items-center pt-2">
                      <button
                        onClick={() => {
                          setShowOtpScreen(false);
                          setOtpValue("");
                          setOtpError("");
                        }}
                        className="text-xs font-mono text-slate-500 hover:text-slate-900 flex items-center gap-1.5"
                      >
                        <ArrowLeft className="w-4 h-4" /> Back
                      </button>

                      <LuxuryButton
                        variant="gold"
                        size="lg"
                        onClick={() => handleVerifyOTP()}
                        disabled={isOtpVerifying}
                        icon={<CheckCircle2 className="w-4 h-4" />}
                      >
                        {isOtpVerifying ? "Verifying..." : "Verify & Pay"}
                      </LuxuryButton>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Investment Summary Card */}
          <div className="lg:col-span-5 bg-white/90 border border-slate-200 p-6 md:p-8 rounded-sm self-start space-y-6">
            <h3 className="font-serif text-lg text-slate-900 border-b border-slate-200 pb-4">
              Acquisition Summary
            </h3>

            <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between items-center text-xs">
                  <div>
                    <span className="text-slate-900 block font-serif">{product.name}</span>
                    <span className="text-slate-500 font-mono text-[10px]">
                      Qty {quantity} × {product.formattedPrice}
                    </span>
                  </div>
                  <span className="font-mono text-slate-900">
                    ₹{(product.priceINR * quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="text-slate-900">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>GST & Excise (18%)</span>
                <span className="text-slate-900">₹{tax.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Insured Armored Courier</span>
                <span className="text-emerald-600">Complimentary</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-slate-900 pt-3 border-t border-slate-200">
                <span className="font-serif">Total Settlement</span>
                <span className="text-[#0e3a5d] font-mono">₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="p-3 bg-white rounded border border-slate-200 space-y-2 text-[10px] text-slate-500">
              <div className="flex items-center gap-2 text-[#0e3a5d]">
                <ShieldCheck className="w-4 h-4" />
                <span className="font-mono uppercase tracking-wider font-semibold">Atelier Assurance</span>
              </div>
              <p>
                All timepieces are backed by our 5-Year Global Haute Horlogerie Guarantee and registered in the Geneva Archives upon payment settlement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
