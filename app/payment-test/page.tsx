"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, CheckCircle2, XCircle, CreditCard, Smartphone, Building, Wallet, ArrowLeft, Loader2 } from "lucide-react";
import { LuxuryButton } from "@/components/ui/LuxuryButton";
import { saveLocalOrder } from "@/lib/supabase/mockStore";
import { Order } from "@/lib/types/watch";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentTestPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "otp" | "processing" | "success" | "failed">("idle");
  const [paymentError, setPaymentError] = useState("");
  const [selectedAmount, setSelectedAmount] = useState(249900);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "netbanking" | "wallet">("card");
  const [customerInfo, setCustomerInfo] = useState({
    name: "Test User",
    email: "test@aura.com",
    phone: "9876543210",
  });
  const [otpValue, setOtpValue] = useState("");
  const [orderData, setOrderData] = useState<any>(null);

  const testAmounts = [
    { label: "₹2,499", value: 249900, desc: "Classic Collection" },
    { label: "₹4,999", value: 499900, desc: "Dynasty Sport" },
    { label: "₹9,999", value: 999900, desc: "Heritage GMT" },
    { label: "₹24,999", value: 2499900, desc: "Skeleton Limited" },
  ];

  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentError("");

    try {
      // Step 1: Create order on server
      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountINR: selectedAmount / 100,
          receiptId: `aur_test_${Date.now()}`,
          notes: { customer: customerInfo.name, email: customerInfo.email, test_mode: "true", payment_method: paymentMethod },
        }),
      });

      const data = await orderRes.json();
      if (!orderRes.ok) throw new Error(data.error || "Order creation failed");

      setOrderData(data);

      // Step 2: For UPI, show OTP verification screen
      if (paymentMethod === "upi") {
        setPaymentStatus("otp");
        setIsProcessing(false);
        return;
      }

      // Step 3: For other methods, open Razorpay checkout
      const isTestMode = data.mode === "sandbox_simulator" || data.id.includes("aur_");
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_luxury_aura";

      const options = {
        key: razorpayKey,
        amount: data.amount,
        currency: data.currency || "INR",
        name: "AURA",
        description: `Test Payment - ${testAmounts.find((a) => a.value === selectedAmount)?.desc || "Watch"}`,
        order_id: data.id,
        prefill: { name: customerInfo.name, email: customerInfo.email, contact: customerInfo.phone },
        notes: { customer: customerInfo.name, email: customerInfo.email, test_mode: "true" },
        theme: { color: "#D4AF37" },
        handler: async function (response: any) {
          await verifyAndSavePayment(response.razorpay_order_id, response.razorpay_payment_id, response.razorpay_signature, isTestMode);
        },
        modal: { ondismiss: function () { setIsProcessing(false); setPaymentError("Payment cancelled. Please try again."); } },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err: unknown) {
      setIsProcessing(false);
      setPaymentError((err as Error).message || "Failed to initialize payment.");
    }
  };

  const verifyAndSavePayment = async (razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string, isTestMode: boolean) => {
    setPaymentStatus("processing");
    setIsProcessing(true);

    try {
      const verifyRes = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ razorpayOrderId, razorpayPaymentId, razorpaySignature, isSandbox: isTestMode, isTestMode }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyData.verified) throw new Error("Payment verification failed");

      const orderNumber = `AUR-TEST-${Math.floor(10000 + Math.random() * 90000)}`;
      const completedOrder: Order = {
        id: `ord_test_${Date.now()}`,
        orderNumber,
        createdAt: new Date().toISOString(),
        customerName: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        shippingAddress: { street: "123 Test Street", city: "Mumbai", state: "Maharashtra", postalCode: "400001", country: "India" },
        items: [{ id: `item_test_${Date.now()}`, productId: "test_product", productName: testAmounts.find((a) => a.value === selectedAmount)?.desc || "Test Watch", quantity: 1, priceINR: selectedAmount / 100, image: "/assets/intro/media_1788505911678.jpg" }],
        subtotalINR: selectedAmount / 100,
        taxINR: Math.round((selectedAmount / 100) * 0.18),
        shippingINR: 0,
        totalINR: Math.round((selectedAmount / 100) * 1.18),
        paymentStatus: "VERIFIED",
        orderStatus: "Payment Confirmed",
        paymentMethod: paymentMethod === "upi" ? "UPI" : "RAZORPAY",
        razorpayOrderId,
        razorpayPaymentId,
        trackingNumber: `AUR-TEST-${Math.floor(100000 + Math.random() * 900000)}`,
      };

      saveLocalOrder(completedOrder);
      setPaymentStatus("success");
      setIsProcessing(false);
      // FIXED: Redirect to payment-success page with order details
      router.push(`/payment-success?orderId=${completedOrder.id}&orderNumber=${completedOrder.orderNumber}&paymentMethod=${paymentMethod === "upi" ? "UPI" : "RAZORPAY"}`);
    } catch (err: unknown) {
      setIsProcessing(false);
      setPaymentStatus("failed");
      setPaymentError((err as Error).message || "Payment verification failed.");
    }
  };

  const handleOtpVerify = async (otp: string) => {
    setPaymentStatus("processing");
    setIsProcessing(true);

    try {
      // Simulate OTP verification
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const isTestMode = orderData?.mode === "sandbox_simulator" || orderData?.id?.includes("aur_");
      const mockPaymentId = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      const mockSignature = `sig_${Date.now()}`;

      await verifyAndSavePayment(orderData.id, mockPaymentId, mockSignature, isTestMode);
    } catch (err: unknown) {
      setIsProcessing(false);
      setPaymentStatus("failed");
      setPaymentError("OTP verification failed. Please try again.");
    }
  };

  const handleOtpSuccess = () => {
    handleOtpVerify("1234");
  };

  const handleOtpFailure = () => {
    setIsProcessing(false);
    setPaymentStatus("failed");
    setOtpValue("");
  };

  if (paymentStatus === "success") {
    return (
      <div className="min-h-screen bg-obsidian-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-obsidian-900 border border-emerald-glow/30 rounded-lg p-8 text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-emerald-glow/20 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-glow" />
          </div>
          <h1 className="text-2xl font-serif text-white">Payment Successful</h1>
          <p className="text-silver-dark text-sm">Your test payment has been processed successfully.</p>
          <div className="bg-obsidian-950 rounded border border-white/10 p-4 text-left space-y-2">
            <p className="text-xs text-silver-dark">Amount: <span className="text-white font-mono">{(selectedAmount / 100).toLocaleString("en-IN")}</span></p>
            <p className="text-xs text-silver-dark">Mode: <span className="text-emerald-glow font-mono">TEST</span></p>
            <p className="text-xs text-silver-dark">Status: <span className="text-emerald-glow font-mono">VERIFIED</span></p>
          </div>
          <LuxuryButton variant="gold" size="lg" onClick={() => setPaymentStatus("idle")} className="w-full">
            Test Another Payment
          </LuxuryButton>
          <button onClick={() => router.push("/checkout")} className="text-xs text-silver-dark hover:text-white flex items-center gap-1.5 mx-auto">
            <ArrowLeft className="w-4 h-4" /> Go to Checkout
          </button>
        </div>
      </div>
    );
  }

  if (paymentStatus === "otp") {
    return (
      <div className="min-h-screen bg-obsidian-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-obsidian-900 border border-gold/30 rounded-lg p-8 space-y-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gold/20 rounded-full flex items-center justify-center"><Smartphone className="w-8 h-8 text-gold" /></div>
            <h1 className="text-2xl font-serif text-white">Verify OTP</h1>
            <p className="text-silver-dark text-sm">Enter the 6-digit OTP sent to your UPI app</p>
          </div>
          <div className="space-y-4">
            <input type="text" maxLength={6} value={otpValue} onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ""))} placeholder="Enter 6-digit OTP" className="w-full bg-obsidian-950 border border-white/10 rounded px-4 py-3 text-white text-center text-xl tracking-widest focus:border-gold focus:outline-none" />
            <p className="text-xs text-silver-dark text-center">Test OTP: 123456 (or click buttons below)</p>
            <div className="grid grid-cols-2 gap-4">
              <LuxuryButton variant="gold" size="lg" onClick={handleOtpSuccess} className="w-full"><CheckCircle2 className="w-4 h-4 mr-2" />Success</LuxuryButton>
              <LuxuryButton variant="outline" size="lg" onClick={handleOtpFailure} className="w-full"><XCircle className="w-4 h-4 mr-2" />Failure</LuxuryButton>
            </div>
            <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div><div className="relative flex justify-center text-xs"><span className="bg-obsidian-900 px-2 text-silver-dark">Or verify with OTP</span></div></div>
            <LuxuryButton variant="outline" size="lg" onClick={() => handleOtpVerify(otpValue)} disabled={otpValue.length !== 6} className="w-full">Verify OTP & Pay</LuxuryButton>
          </div>
          <button onClick={() => { setPaymentStatus("idle"); setOtpValue(""); }} className="text-xs text-silver-dark hover:text-white flex items-center gap-1.5 mx-auto"><ArrowLeft className="w-4 h-4" /> Back to Payment</button>
        </div>
      </div>
    );
  }

  if (paymentStatus === "processing") {
    return (
      <div className="min-h-screen bg-obsidian-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-obsidian-900 border border-gold/30 rounded-lg p-8 text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-gold/20 rounded-full flex items-center justify-center"><Loader2 className="w-8 h-8 text-gold animate-spin" /></div>
          <h1 className="text-2xl font-serif text-white">Processing Payment</h1>
          <p className="text-silver-dark text-sm">Please wait while we verify your payment...</p>
        </div>
      </div>
    );
  }

  if (paymentStatus === "failed") {
    return (
      <div className="min-h-screen bg-obsidian-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-obsidian-900 border border-red-500/30 rounded-lg p-8 text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center"><XCircle className="w-8 h-8 text-red-400" /></div>
          <h1 className="text-2xl font-serif text-white">Payment Failed</h1>
          <p className="text-silver-dark text-sm">{paymentError || "Your payment could not be processed. Please try again."}</p>
          <div className="bg-obsidian-950 rounded border border-white/10 p-4 text-left space-y-2">
            <p className="text-xs text-silver-dark">Amount: <span className="text-white font-mono">₹{(selectedAmount / 100).toLocaleString("en-IN")}</span></p>
            <p className="text-xs text-silver-dark">Mode: <span className="text-red-400 font-mono">TEST</span></p>
            <p className="text-xs text-silver-dark">Status: <span className="text-red-400 font-mono">FAILED</span></p>
          </div>
          <LuxuryButton variant="gold" size="lg" onClick={() => { setPaymentStatus("idle"); setPaymentError(""); setOtpValue(""); }} className="w-full">Try Again</LuxuryButton>
          <button onClick={() => router.push("/checkout")} className="text-xs text-silver-dark hover:text-white flex items-center gap-1.5 mx-auto"><ArrowLeft className="w-4 h-4" /> Go to Checkout</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian-950 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30 rounded-full">
            <div className="w-2 h-2 bg-gold rounded-full animate-pulse" />
            <span className="text-xs font-mono text-gold uppercase tracking-wider">Test Mode Active</span>
          </div>
          <h1 className="text-3xl font-serif text-white">Razorpay Payment Test</h1>
          <p className="text-silver-dark text-sm max-w-md mx-auto">
            Test the Razorpay payment integration with simulated transactions. No real charges will be made.
          </p>
        </div>

        <div className="bg-obsidian-900 border border-white/10 rounded-lg p-6 space-y-4">
          <h2 className="text-sm font-serif text-white flex items-center gap-2">
            <Wallet className="w-4 h-4 text-gold" />
            Select Test Amount
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {testAmounts.map((amount) => (
              <button key={amount.value} onClick={() => setSelectedAmount(amount.value)} className={`p-4 rounded border text-left transition-all ${selectedAmount === amount.value ? "border-gold bg-gold/10" : "border-white/10 hover:border-white/20"}`}>
                <span className="text-white font-mono block">{amount.label}</span>
                <span className="text-silver-dark text-xs">{amount.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-obsidian-900 border border-white/10 rounded-lg p-6 space-y-4">
          <h2 className="text-sm font-serif text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-gold" />
            Payment Method
          </h2>
          <div className="grid grid-cols-4 gap-3">
            <button onClick={() => setPaymentMethod("card")} className={`p-3 rounded border text-center transition-all ${paymentMethod === "card" ? "border-gold bg-gold/10" : "border-white/10 hover:border-white/20"}`}>
              <CreditCard className={`w-5 h-5 mx-auto mb-1 ${paymentMethod === "card" ? "text-gold" : "text-silver-dark"}`} />
              <span className="text-xs text-silver-dark">Card</span>
            </button>
            <button onClick={() => setPaymentMethod("upi")} className={`p-3 rounded border text-center transition-all ${paymentMethod === "upi" ? "border-gold bg-gold/10" : "border-white/10 hover:border-white/20"}`}>
              <Smartphone className={`w-5 h-5 mx-auto mb-1 ${paymentMethod === "upi" ? "text-gold" : "text-silver-dark"}`} />
              <span className="text-xs text-silver-dark">UPI</span>
            </button>
            <button onClick={() => setPaymentMethod("netbanking")} className={`p-3 rounded border text-center transition-all ${paymentMethod === "netbanking" ? "border-gold bg-gold/10" : "border-white/10 hover:border-white/20"}`}>
              <Building className={`w-5 h-5 mx-auto mb-1 ${paymentMethod === "netbanking" ? "text-gold" : "text-silver-dark"}`} />
              <span className="text-xs text-silver-dark">Net Banking</span>
            </button>
            <button onClick={() => setPaymentMethod("wallet")} className={`p-3 rounded border text-center transition-all ${paymentMethod === "wallet" ? "border-gold bg-gold/10" : "border-white/10 hover:border-white/20"}`}>
              <Wallet className={`w-5 h-5 mx-auto mb-1 ${paymentMethod === "wallet" ? "text-gold" : "text-silver-dark"}`} />
              <span className="text-xs text-silver-dark">Wallet</span>
            </button>
          </div>
        </div>

        <div className="bg-obsidian-900 border border-white/10 rounded-lg p-6 space-y-4">
          <h2 className="text-sm font-serif text-white">Customer Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-silver-dark block mb-1">Name</label>
              <input type="text" value={customerInfo.name} onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })} className="w-full bg-obsidian-950 border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-gold focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-silver-dark block mb-1">Email</label>
              <input type="email" value={customerInfo.email} onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })} className="w-full bg-obsidian-950 border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-gold focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-silver-dark block mb-1">Phone</label>
              <input type="tel" value={customerInfo.phone} onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })} className="w-full bg-obsidian-950 border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-gold focus:outline-none" />
            </div>
          </div>
        </div>

        {paymentError && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm">{paymentError}</div>
        )}

        <LuxuryButton variant="gold" size="lg" onClick={handlePayment} disabled={isProcessing} className="w-full">
          {isProcessing ? "Processing..." : `Pay ₹${(selectedAmount / 100).toLocaleString("en-IN")}`}
        </LuxuryButton>

        <div className="bg-obsidian-950 border border-white/10 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2 text-gold text-xs font-mono uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            Test Mode Information
          </div>
          <ul className="text-xs text-silver-dark space-y-1 ml-6 list-disc">
            <li>Use Razorpay test card: 4111 1111 1111 1111</li>
            <li>Use any future expiry date (e.g., 12/25)</li>
            <li>Use any 3-digit CVV</li>
            <li>OTP for test mode: 1234</li>
          </ul>
        </div>
      </div>
    </div>
  );
}