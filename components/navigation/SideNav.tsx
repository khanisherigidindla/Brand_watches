"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Heart,
  User,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { useWishlistStore } from "@/lib/store/wishlistStore";
import { useUserStore } from "@/lib/store/userStore";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/watches", label: "Shop Watches", icon: ShoppingBag },
  { href: "/checkout", label: "Checkout", icon: Package },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

export const SideNav: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const cartCount = useCartStore((s) =>
    s.items.reduce((acc, i) => acc + i.quantity, 0),
  );
  const wishlistCount = useWishlistStore((s) => s.productIds.length);
  const { user, isAuthenticated, isAdmin, logout } = useUserStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const badgeFor = (href: string): number => {
    if (href === "/checkout") return cartCount;
    if (href === "/wishlist") return wishlistCount;
    return 0;
  };

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-white border-r border-paper-line min-h-[calc(100vh-72px)] sticky top-[72px] self-start">
      <div className="p-4 border-b border-paper-line">
        <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
          {isAuthenticated ? "Patron Member" : "Guest Session"}
        </p>
        <p className="text-sm font-bold font-serif truncate mt-0.5">
          {isAuthenticated
            ? `${user?.firstName || "Patron"} ${user?.lastName || ""}`.trim()
            : "Welcome to Aura Brand Watches"}
        </p>
        <p className="text-[11px] text-slate-400 font-mono truncate">
          {isAuthenticated ? user?.email : "Browse the atelier"}
        </p>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname?.startsWith(item.href));
          const badge = badgeFor(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-[13px] font-semibold transition-colors ${
                active
                  ? "bg-[#0e3a5d] text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-[#0e3a5d]"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Icon className="w-4 h-4" />
                {item.label}
              </span>
              {badge > 0 && (
                <span
                  className={`text-[10px] min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center font-bold ${
                    active
                      ? "bg-[#b9975b] text-slate-900"
                      : "bg-slate-100 text-[#0e3a5d]"
                  }`}
                >
                  {badge > 9 ? "9+" : badge}
                </span>
              )}
            </Link>
          );
        })}

        {isAdmin && (
          <Link
            href="/admin"
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-[13px] font-semibold transition-colors ${
              pathname?.startsWith("/admin")
                ? "bg-amber-500 text-slate-900 shadow-sm"
                : "text-amber-700 hover:bg-amber-50"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Admin Panel
          </Link>
        )}
      </nav>

      <div className="p-3 border-t border-paper-line">
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/register"
              className="py-2 px-3 rounded-lg bg-[#b9975b] text-slate-900 text-center text-xs font-bold"
            >
              Register
            </Link>
            <Link
              href="/login"
              className="py-2 px-3 rounded-lg bg-[#0e3a5d] text-white text-center text-xs font-bold"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
};
