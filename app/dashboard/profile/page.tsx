"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Save, LogOut } from "lucide-react";
import { useUserStore } from "@/lib/store/userStore";
import { useWishlistStore } from "@/lib/store/wishlistStore";
import { useCartStore } from "@/lib/store/cartStore";
import { LuxuryButton } from "@/components/ui/LuxuryButton";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, updateProfile } = useUserStore();
  const wishlistCount = useWishlistStore((s) => s.productIds.length);
  const cartCount = useCartStore((s) =>
    s.items.reduce((acc, i) => acc + i.quantity, 0)
  );

  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [saved, setSaved] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-obsidian-950 py-12 px-4">
        <div className="max-w-md mx-auto text-center space-y-6">
          <User className="w-12 h-12 mx-auto text-silver-dark/40" />
          <h1 className="text-2xl font-serif text-white">Sign in required</h1>
          <p className="text-sm text-silver-dark">
            Please sign in to view your patron profile.
          </p>
          <Link href="/login">
            <LuxuryButton variant="gold" size="lg">
              Sign In
            </LuxuryButton>
          </Link>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    updateProfile(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-obsidian-950 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <button className="p-2 rounded-full text-silver-dark hover:text-white hover:bg-obsidian-800 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-serif text-white">Patron Profile</h1>
            <p className="text-xs text-silver-dark font-mono uppercase tracking-wider mt-1">
              {wishlistCount} wishlisted · {cartCount} in bag
            </p>
          </div>
        </div>

        <div className="bg-obsidian-900 border border-white/10 rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-silver-dark block mb-1">First name</label>
              <input
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className="w-full bg-obsidian-950 border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-silver-dark block mb-1">Last name</label>
              <input
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className="w-full bg-obsidian-950 border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-silver-dark block mb-1">Email</label>
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-obsidian-950 border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-silver-dark block mb-1">Phone</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-obsidian-950 border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <LuxuryButton
              variant="gold"
              size="md"
              icon={<Save className="w-4 h-4" />}
              onClick={handleSave}
            >
              {saved ? "Saved" : "Save Profile"}
            </LuxuryButton>
            <LuxuryButton
              variant="outline"
              size="md"
              icon={<LogOut className="w-4 h-4" />}
              onClick={handleLogout}
            >
              Logout
            </LuxuryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
