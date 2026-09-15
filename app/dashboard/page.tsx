"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Search,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { REAL_WATCHES } from "@/lib/data/realWatches";
import { WatchCard } from "@/components/watch/WatchCard";
import { WatchCinematicShowcase } from "@/components/watch/WatchCinematicShowcase";

const BRANDS = [
  "All",
  ...Array.from(new Set(REAL_WATCHES.map((w) => w.brand))).sort(),
];

export default function DashboardPage() {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return REAL_WATCHES.filter((w) => {
      if (brand !== "All" && w.brand !== brand) return false;
      if (q && !`${w.brand} ${w.name}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, brand]);

  const grails = useMemo(
    () => [...REAL_WATCHES].sort((a, b) => b.priceINR - a.priceINR).slice(0, 4),
    [],
  );

  return (
    <div className="bg-[#fbfcfd] text-slate-900 overflow-hidden">
      <section className="border-b border-slate-200 bg-white relative min-h-[calc(100svh-72px)] flex items-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(185,151,91,0.12),transparent_62%),linear-gradient(135deg,rgba(14,58,93,0.04),transparent)]" />
        <div className="relative max-w-[1600px] mx-auto px-4 sm:px-5 md:px-8 py-8 sm:py-10 w-full">
          <div className="text-center max-w-[1500px] mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.25 }}
              className="mb-7 sm:mb-10 w-full max-w-[1700px] mx-auto"
            >
              <WatchCinematicShowcase />
              <p
                data-gsap-reveal
                className="mt-4 text-center text-xs text-slate-400"
              >
                Live turntable film · move your cursor for 3D parallax
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mb-4"
            >
              <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.24em] uppercase text-[#0e3a5d] bg-slate-50 border border-slate-200 rounded-full px-4 py-2">
                <BadgeCheck className="w-4 h-4 text-[#b9975b]" /> Authentic ·
                Real Market Prices
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.05 }}
              className="mt-2 text-[clamp(2.25rem,10vw,4.5rem)] leading-[1.02] font-extrabold tracking-tight text-slate-900"
            >
              Brand watches.
              <br />
              Honest prices.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.12 }}
              className="mt-5 text-[15px] sm:text-[16px] md:text-[17px] text-slate-500 leading-relaxed max-w-3xl mx-auto px-2"
            >
              Rolex, Patek Philippe, Omega, Cartier and more — each shown with
              its exact photograph, full name and real India market price.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.18 }}
              className="mt-7 flex flex-col sm:flex-row flex-wrap justify-center gap-3 px-2"
            >
              <a
                href="#collection"
                className="inline-flex items-center justify-center gap-2 bg-[#0e3a5d] text-white text-sm font-bold rounded-lg px-7 py-3.5 hover:bg-[#0a2a44] transition-colors"
              >
                Shop the collection <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                href="/watches"
                className="inline-flex items-center justify-center gap-2 text-sm font-bold text-[#0e3a5d] border border-slate-300 rounded-lg px-7 py-3.5 hover:border-[#0e3a5d] hover:bg-slate-50 transition-all"
              >
                All watches
              </Link>
            </motion.div>

            <div className="mt-9 flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-3 text-[13px] font-semibold text-slate-700 shadow-sm">
                <ShieldCheck className="w-5 h-5 text-[#0e3a5d]" /> Certified
              </div>
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-3 text-[13px] font-semibold text-slate-700 shadow-sm">
                <Truck className="w-5 h-5 text-[#0e3a5d]" /> Insured
              </div>
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-3 text-[13px] font-semibold text-slate-700 shadow-sm">
                <BadgeCheck className="w-5 h-5 text-[#0e3a5d]" /> 5-yr warranty
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="collection" className="max-w-7xl mx-auto px-5 md:px-8 pt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <p className="text-[11px] font-bold tracking-[0.24em] uppercase text-[#b9975b]">
              The full catalogue
            </p>
            <h2 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">
              Shop every watch
            </h2>
            <p className="mt-2 text-slate-500 text-[15px]">
              Exact photo · full name · real price · {filtered.length}{" "}
              references
            </p>
          </div>
          <label className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-4 py-2.5 w-full md:w-80 shadow-sm focus-within:border-[#0e3a5d] transition-colors">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Rolex, Omega…"
              className="bg-transparent outline-none text-sm w-full"
            />
          </label>
        </motion.div>
        <div className="mt-4 flex flex-wrap gap-2">
          {BRANDS.map((b) => (
            <button
              key={b}
              onClick={() => setBrand(b)}
              className={
                brand === b
                  ? "text-[13px] font-semibold rounded-lg px-4 py-2 border bg-[#0e3a5d] text-white border-[#0e3a5d] transition-all"
                  : "text-[13px] font-medium rounded-lg px-4 py-2 border bg-white text-slate-600 border-slate-200 hover:border-slate-400 transition-all"
              }
            >
              {b}
            </button>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((w) => (
            <WatchCard key={w.id} watch={w} />
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 md:px-8 py-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[11px] font-bold tracking-[0.24em] uppercase text-[#b9975b]">
            Collector grails
          </p>
          <h2 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">
            The most coveted references
          </h2>
        </motion.div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {grails.map((w) => (
            <WatchCard key={w.id} watch={w} />
          ))}
        </div>
        <p className="mt-8 text-xs text-slate-400">
          Prices reflect Jan-2026 India market levels incl. duties where
          applicable.
        </p>
      </section>
    </div>
  );
}
