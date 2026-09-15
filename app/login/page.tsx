"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { useUserStore } from "@/lib/store/userStore";
import { useCartStore } from "@/lib/store/cartStore";
import { AuthWatchStage } from "@/components/auth/AuthWatchStage";

function LoginContent() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get("redirect");
  const isCartRedirect = redirect === "cart";
  const login = useUserStore((s) => s.login);
  const openCart = useCartStore((s) => s.openCart);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      const result = login(identifier, password);
      setIsLoading(false);

      if (!result.success) {
        setError(result.error || "Wrong email or password. Please try again.");
        return;
      }
      if (result.isAdmin) {
        router.push("/admin");
        return;
      }
      if (isCartRedirect) openCart();
      if (redirect === "wishlist") {
        router.push("/wishlist");
        return;
      }
      router.push("/home");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* LEFT: moving animation */}
      <div className="lg:w-6/12 min-h-[420px] lg:min-h-screen border-b lg:border-b-0 lg:border-r border-slate-200">
        <AuthWatchStage />
      </div>

      {/* RIGHT: simple sign-in form */}
      <div className="lg:w-6/12 flex items-center justify-center px-6 py-12 lg:py-16 bg-white">
        <div className="w-full max-w-md space-y-7">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Sign In</h1>
            <p className="text-sm text-slate-500 mt-2">
              Enter your email or phone number and your password.
            </p>
          </div>

          {isCartRedirect && (
            <div className="p-3.5 bg-[#b9975b]/10 border border-[#b9975b]/40 rounded-lg text-xs text-slate-700 animate-fadeIn">
              Please sign in to add this watch to your cart.
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700 animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Email or Phone Number
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="you@example.com or 9876543210"
                className="w-full bg-white border border-slate-200 focus:border-[#0e3a5d] rounded-lg px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5 relative">
              <label className="text-xs font-semibold text-slate-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-white border border-slate-200 focus:border-[#0e3a5d] rounded-lg px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0e3a5d] hover:bg-[#0a2a44] disabled:opacity-60 text-white text-sm font-bold rounded-lg px-6 py-3.5 transition-colors"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="text-center text-sm text-slate-500 pt-2">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-[#0e3a5d] hover:underline font-semibold">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center text-slate-400 text-sm">
          Loading...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
