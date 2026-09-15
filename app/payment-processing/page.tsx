"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, CircleDollarSign, Loader2, XCircle } from "lucide-react";

function PaymentProcessingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const orderNumber = searchParams.get("orderNumber");
  const paymentMethod = searchParams.get("paymentMethod") || "UPI";

  const outcome = searchParams.get("outcome");
  const [phase, setPhase] = useState<"loading" | "result" | "testButtons">(
    outcome === "success" || outcome === "failure" ? "loading" : "testButtons",
  );

  useEffect(() => {
    if (!outcome) return;
    const timer = setTimeout(() => {
      setPhase("result");
    }, 1800);
    return () => clearTimeout(timer);
  }, [outcome]);

  useEffect(() => {
    if (phase !== "result") return;
    const timer = setTimeout(() => {
      if (outcome === "success") {
        router.push(
          `/payment-success?orderId=${orderId || ""}&orderNumber=${orderNumber || ""}&paymentMethod=${paymentMethod}`,
        );
      } else {
        router.push(
          `/payment-failure?orderId=${orderId || ""}&orderNumber=${orderNumber || ""}&paymentMethod=${paymentMethod}`,
        );
      }
    }, 1400);
    return () => clearTimeout(timer);
  }, [phase, outcome, orderId, orderNumber, paymentMethod, router]);

  const handleSuccess = () => {
    router.push(
      `/order-confirmation?orderId=${orderId || ""}&orderNumber=${orderNumber || ""}&paymentMethod=${paymentMethod}`,
    );
  };

  const handleFailure = () => {
    router.push(
      `/payment-failure?orderId=${orderId || ""}&orderNumber=${orderNumber || ""}&paymentMethod=${paymentMethod}`,
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div
        className={`max-w-md w-full rounded-2xl p-6 sm:p-8 text-center space-y-7 border shadow-2xl ${
          phase === "result" && outcome === "success"
            ? "bg-emerald-950/90 border-emerald-400/50"
            : phase === "result"
              ? "bg-red-950/90 border-red-400/50"
              : "bg-slate-900 border-amber-300/30"
        }`}
      >
        {phase === "loading" ? (
          <>
            <div className="w-16 h-16 mx-auto bg-gold/20 rounded-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-gold animate-spin" />
            </div>
            <div className="space-y-3">
              <h1 className="text-2xl font-serif text-white">
                Confirming Payment
              </h1>
              <p className="text-silver-dark text-sm">
                This will only take a few seconds. Please keep this window open.
              </p>
            </div>
            <div className="flex justify-center gap-1 pt-2">
              <span className="text-[10px] font-mono text-silver-dark">●</span>
              <span className="text-[10px] font-mono text-silver-dark animate-pulse">
                ●
              </span>
              <span className="text-[10px] font-mono text-silver-dark">●</span>
            </div>
          </>
        ) : phase === "result" ? (
          <>
            {outcome === "success" ? (
              <>
                <div className="w-20 h-20 mx-auto rounded-full bg-emerald-400/20 flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-emerald-300" />
                </div>
                <div className="space-y-2">
                  <p className="text-[11px] uppercase tracking-[0.25em] text-emerald-300 font-semibold">
                    Payment Successful
                  </p>
                  <h1 className="text-2xl font-serif text-white">
                    Redirecting to your receipt
                  </h1>
                  <p className="text-sm text-emerald-100/80">
                    Your order has been confirmed securely.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-20 h-20 mx-auto rounded-full bg-red-400/20 flex items-center justify-center">
                  <XCircle className="w-12 h-12 text-red-300" />
                </div>
                <div className="space-y-2">
                  <p className="text-[11px] uppercase tracking-[0.25em] text-red-300 font-semibold">
                    Payment Failed
                  </p>
                  <h1 className="text-2xl font-serif text-white">
                    Returning to the payment result
                  </h1>
                  <p className="text-sm text-red-100/80">
                    No funds were charged in this test transaction.
                  </p>
                </div>
              </>
            )}
            <div className="flex items-center justify-center gap-2 text-xs text-white/60">
              <Loader2 className="w-4 h-4 animate-spin" /> Updating your order
              status...
            </div>
          </>
        ) : (
          <>
            <div className="space-y-4">
              <CircleDollarSign className="w-12 h-12 text-amber-300 mx-auto" />
              <h1 className="text-2xl font-serif text-white">
                Choose Payment Result
              </h1>
              <p className="text-silver-dark text-sm">
                Test Mode: Select the desired outcome to continue.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <button
                onClick={handleSuccess}
                className="py-4 bg-emerald-glow/20 border-2 border-emerald-glow/30 rounded-lg text-center transition-all hover:bg-emerald-glow/30 hover:border-emerald-glow/50 flex flex-col items-center gap-2"
              >
                <CheckCircle2 className="w-6 h-6 text-emerald-glow" />
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-glow">
                  Success
                </span>
              </button>
              <button
                onClick={handleFailure}
                className="py-4 bg-red-500/20 border-2 border-red-500/30 rounded-lg text-center transition-all hover:bg-red-500/30 hover:border-red-500/50 flex flex-col items-center gap-2"
              >
                <XCircle className="w-6 h-6 text-red-400" />
                <span className="text-xs font-mono uppercase tracking-wider text-red-400">
                  Failure
                </span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentProcessingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-obsidian-950 flex items-center justify-center">
          <div className="text-gold font-mono">Loading...</div>
        </div>
      }
    >
      <PaymentProcessingContent />
    </Suspense>
  );
}
