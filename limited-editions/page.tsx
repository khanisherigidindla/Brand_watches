"use client";

import React from "react";
import { WATCH_PRODUCTS } from "@/lib/data/seedProducts";
import { ProductCard } from "@/components/products/ProductCard";
import { Sparkles, ShieldCheck, Flame, Lock } from "lucide-react";

export default function LimitedEditionsPage() {
  const limitedWatches = WATCH_PRODUCTS.filter((w) => w.limitedEdition);

  return (
    <div className="pt-28 pb-24 px-6 md:px-12 bg-obsidian-950 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 border border-gold/40 text-[10px] uppercase font-mono tracking-super-wide text-gold">
            <Lock className="w-3 h-3" /> Strictly Numbered Provenance
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-white tracking-wide">
            THE LIMITED COLLECTOR VAULT
          </h1>
          <p className="text-xs md:text-sm text-silver-dark max-w-xl mx-auto leading-relaxed">
            Reserved exclusively for discerning collectors. Each timepiece is produced in strictly finite numbers, individually numbered upon caseback engraving, and backed by Geneva archival registration.
          </p>
        </div>

        {/* Scarcity Banner */}
        <div className="bg-gradient-to-r from-obsidian-900 via-obsidian-850 to-obsidian-900 border border-gold/30 p-6 md:p-8 rounded-sm grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="space-y-1 border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0">
            <span className="text-[10px] font-mono uppercase tracking-widest text-silver-dark">Total Limited References</span>
            <span className="text-3xl font-serif text-white font-bold block">{limitedWatches.length} References</span>
          </div>
          <div className="space-y-1 border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0">
            <span className="text-[10px] font-mono uppercase tracking-widest text-silver-dark">Rarest Allocation</span>
            <span className="text-3xl font-serif text-gold font-bold block">Only 5 Pieces Worldwide</span>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-silver-dark">Registry Status</span>
            <span className="text-3xl font-serif text-emerald-glow font-bold block">Live Synchronized</span>
          </div>
        </div>

        {/* Limited Watches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {limitedWatches.map((watch) => (
            <div key={watch.id} className="relative">
              <ProductCard product={watch} />
              {/* Scarcity Sub-Bar */}
              <div className="mt-2 p-2 bg-obsidian-900 border border-white/10 flex items-center justify-between text-[11px] font-mono">
                <span className="text-gold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" /> {watch.pieceNumber || `Limited to ${watch.editionSize}`}
                </span>
                <span className="text-white/60">
                  {watch.stockQuantity} Remaining in Atelier
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
