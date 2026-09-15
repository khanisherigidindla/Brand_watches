"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  UserPlus,
  LogIn,
  LogOut,
  ChevronDown,
  ShieldCheck,
  Lock,
  ChevronRight,
} from "lucide-react";
import { useUserStore } from "@/lib/store/userStore";

export const AuthDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, logout } = useUserStore();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push("/login");
  };

  return (
    <div className="relative inline-block text-left z-50">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-[#0e3a5d] text-slate-800 bg-white text-xs font-semibold transition-all shadow-sm group"
        aria-label="Account options menu"
      >
        <User className="w-3.5 h-3.5 text-[#0e3a5d]" />
        <span className="max-w-[100px] truncate font-mono">
          {isAuthenticated ? user?.firstName || "Patron" : "Account"}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-[#0e3a5d] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden animate-fadeIn font-sans">
          {isAuthenticated ? (
            /* Logged In View */
            <div>
              <div className="p-4 bg-slate-900 text-white space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#b9975b]">
                    {isAdmin ? "Executive Admin" : "Patron Member"}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <h4 className="text-sm font-bold font-serif truncate">
                  {user?.firstName} {user?.lastName}
                </h4>
                <p className="text-[11px] text-slate-400 font-mono truncate">{user?.email}</p>
              </div>

              <div className="p-2 space-y-1 border-b border-slate-100">
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#0e3a5d]" />
                    <span>My Acquisition Vault</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-amber-50 text-xs font-medium text-amber-900 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-[#b9975b]" />
                      <span>Executive Command Center</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-amber-600" />
                  </Link>
                )}
              </div>

              <div className="p-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout from Session</span>
                </button>
              </div>
            </div>
          ) : (
            /* Logged Out View - Register & Sign In Options */
            <div className="divide-y divide-slate-100">
              <div className="p-3 bg-slate-900 text-white">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#b9975b] block">
                  Atelier Aura Access
                </span>
                <p className="text-xs font-serif text-slate-200 mt-0.5">
                  Haute Horlogerie Private Client Portal
                </p>
              </div>

              <div className="p-2 space-y-1">
                {/* REGISTER OPTION */}
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-200/60 hover:border-[#b9975b] text-slate-900 group transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-[#b9975b] text-slate-900 rounded-md shadow-sm">
                      <UserPlus className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900">Create Account</span>
                        <span className="text-[9px] font-mono bg-[#0e3a5d] text-white px-1.5 py-0.2 rounded uppercase font-bold">
                          Register
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">Join the Guild of Collectors</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#b9975b] group-hover:translate-x-0.5 transition-transform" />
                </Link>

                {/* SIGN IN OPTION */}
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 text-slate-800 group transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-slate-100 text-[#0e3a5d] rounded-md">
                      <LogIn className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800">Sign In</span>
                      <p className="text-[10px] text-slate-500">Existing Patron Vault Access</p>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
