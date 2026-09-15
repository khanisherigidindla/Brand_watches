"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ShoppingBag, Heart, Menu, X, Bell, LogOut, User, UserPlus } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { useWishlistStore } from "@/lib/store/wishlistStore";
import { useUserStore } from "@/lib/store/userStore";
import { SearchOverlay } from "@/components/navigation/SearchOverlay";
import { NotificationPopover } from "@/components/navigation/NotificationPopover";
import { AuthDropdown } from "@/components/navigation/AuthDropdown";

export const Navbar = () => {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const toggleCart = useCartStore((s) => s.toggleCart);
  const wishlistCount = useWishlistStore((s) => s.productIds.length);

  const { user, isAuthenticated, logout } = useUserStore();

  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const links = [
    { href: "/home", label: "Home" },
    { href: "/watches", label: "Watches" },
    { href: "/limited-editions", label: "Limited" },
    { href: "/budget-friendly", label: "Budget-Friendly" },
    { href: "/about", label: "About" },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur border-b border-paper-line">
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-[72px] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 -ml-2 text-ink-900"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link href="/dashboard" className="flex flex-col leading-none">
              <span className="font-serif text-xl md:text-2xl tracking-[0.22em] font-bold text-ink-950">
                AURELION
              </span>
              <span className="text-[10px] tracking-[0.3em] text-brand-gold uppercase mt-1">
                Fine Watches
              </span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-7">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-[13px] font-medium tracking-wide text-ink-700 hover:text-brand-deep transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-3 relative">
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2.5 rounded-full text-ink-900 hover:bg-paper-soft transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Button */}
            <Link
              href="/wishlist"
              className="p-2.5 rounded-full text-ink-900 hover:bg-paper-soft transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-brand-deep text-white text-[10px] w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center font-semibold px-1">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </Link>

            {/* Notifications Button */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen((v) => !v)}
                className="p-2.5 rounded-full text-ink-900 hover:bg-paper-soft transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-[#b9975b] w-2 h-2 rounded-full animate-pulse" />
                )}
              </button>
              <NotificationPopover isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
            </div>

            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className="p-2.5 rounded-full text-ink-900 hover:bg-paper-soft transition-colors relative"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-brand-deep text-white text-[10px] min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center font-semibold px-1">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </button>

            {/* Auth Dropdown (Register / Login / Profile) */}
            <AuthDropdown />
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-paper-line bg-white px-5 py-3 flex flex-col space-y-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="py-2.5 text-sm font-medium text-ink-900 border-b border-paper-soft last:border-0"
              >
                {l.label}
              </Link>
            ))}

            <div className="pt-2 border-t border-paper-soft space-y-2">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="py-2 text-sm font-semibold text-red-600 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Logout ({user?.email})
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="py-2 px-3 rounded-lg bg-[#b9975b] text-slate-900 text-center text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <UserPlus className="w-3.5 h-3.5" /> Register
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="py-2 px-3 rounded-lg bg-[#0e3a5d] text-white text-center text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <User className="w-3.5 h-3.5" /> Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};
