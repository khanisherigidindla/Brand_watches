"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { useUserStore } from "@/lib/store/userStore";
import { useCartStore } from "@/lib/store/cartStore";
import { AuthWatchStage } from "@/components/auth/AuthWatchStage";

const inputCls =
  "w-full bg-white border border-slate-200 focus:border-[#0e3a5d] rounded-lg px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors";

function RegisterContent() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const isCartRedirect = searchParams?.get("redirect") === "cart";
  const login = useUserStore((s) => s.login);
  const updateProfile = useUserStore((s) => s.updateProfile);
  const openCart = useCartStore((s) => s.openCart);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      login(email, password);
      updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
      });
      setIsLoading(false);
      if (isCartRedirect) openCart();
      router.push("/home");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      <div className="lg:w-6/12 min-h-[420px] lg:min-h-screen border-b lg:border-b-0 lg:border-r border-slate-200">
        <AuthWatchStage />
      </div>

      <div className="lg:w-6/12 flex items-center justify-center px-6 py-12 lg:py-16 bg-white">
        <div className="w-full max-w-md space-y-7">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Create Account</h1>
            <p className="text-sm text-slate-500 mt-2">
              Just a few details and you are ready to shop.
            </p>
          </div>

          {isCartRedirect && (
            <div className="p-3.5 bg-[#b9975b]/10 border border-[#b9975b]/40 rounded-lg text-xs text-slate-700 animate-fadeIn">
              Create an account to add this watch to your cart.
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700 animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">First Name</label>
                <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" className={inputCls} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Last Name</label>
                <input type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" className={inputCls} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputCls} />
            </div>

            <div className="space-y-1.5 relative">
              <label className="text-xs font-semibold text-slate-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
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
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="text-center text-sm text-slate-500 pt-2">
            Already have an account?{" "}
            <Link href="/login" className="text-[#0e3a5d] hover:underline font-semibold">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center text-slate-400 text-sm">
          Loading...
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
