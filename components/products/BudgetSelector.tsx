"use client";

import React, { useState } from "react";
import { BUDGET_TIERS, WATCH_PRODUCTS } from "@/lib/data/seedProducts";
import { BudgetTierId, WatchProduct } from "@/lib/types/watch";
import { ProductCard } from "./ProductCard";
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { LuxuryButton } from "../ui/LuxuryButton";

interface BudgetSelectorProps {
  initialTier?: BudgetTierId;
  onSelectTier?: (tier: BudgetTierId) => void;
  showPreviewGrid?: boolean;
}

export const BudgetSelector: React.FC<BudgetSelectorProps> = ({
  initialTier = "collector",
  onSelectTier,
  showPreviewGrid = true,
}) => {
  const [activeTierId, setActiveTierId] = useState<BudgetTierId>(initialTier);

  const activeTier = BUDGET_TIERS.find((t) => t.id === activeTierId) || BUDGET_TIERS[3];

  const handleTierChange = (id: BudgetTierId) => {
    setActiveTierId(id);
    if (onSelectTier) onSelectTier(id);
  };

  // Filter watches matching active tier
  const recommendedWatches = WATCH_PRODUCTS.filter(
    (w) => w.budgetTier === activeTierId
  );

  return (
    <section id="budget-discovery" className="py-24 px-6 md:px-12 bg-obsidian-950 relative overflow-hidden">
      {/* Subtle radial ambient background light */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-b from-gold/10 via-gold/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-[10px] uppercase font-mono tracking-super-wide text-gold">
            <Sparkles className="w-3 h-3" />
            Budget Priority Horological Advisory
          </div>
          <h2 className="text-3xl md:text-5xl font-serif text-white tracking-wide">
            CURATE BY INVESTMENT PRIORITY
          </h2>
          <p className="text-sm md:text-base text-silver-dark font-sans leading-relaxed">
            Select your capital allocation tier to unveil handcrafted masterpieces calibrated precisely to your acquisition ambition.
          </p>
        </div>

        {/* The 5-Tier Selector Tabs / Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-14">
          {BUDGET_TIERS.map((tier) => {
            const isSelected = activeTierId === tier.id;
            return (
              <button
                key={tier.id}
                onClick={() => handleTierChange(tier.id)}
                className={`text-left p-4 md:p-5 rounded-sm transition-all duration-500 relative border flex flex-col justify-between group select-none ${
                  isSelected
                    ? "bg-gradient-to-b from-obsidian-850 to-obsidian-900 border-gold shadow-gold-glow"
                    : "bg-obsidian-900/50 border-white/10 hover:border-white/30 hover:bg-obsidian-850/50"
                }`}
                data-cursor="SELECT"
              >
                {/* Active Indicator Top Line */}
                {isSelected && (
                  <span className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold-champagne via-gold to-gold-dark shadow-sm" />
                )}

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span
                      className={`text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded ${
                        isSelected
                          ? "bg-gold text-obsidian-950 font-bold"
                          : "bg-white/10 text-silver-dark"
                      }`}
                    >
                      {tier.badge}
                    </span>
                    <span className="w-2 h-2 rounded-full transition-colors duration-300 ${isSelected ? 'bg-gold shadow-gold-glow' : 'bg-white/20'}" />
                  </div>

                  <h3
                    className={`font-serif text-sm md:text-base tracking-wide transition-colors duration-300 ${
                      isSelected ? "text-gold font-medium" : "text-white group-hover:text-silver-light"
                    }`}
                  >
                    {tier.label}
                  </h3>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10">
                  <span className="block text-xs font-mono text-silver-light font-semibold">
                    {tier.formattedRange}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Tier Description Banner */}
        <div className="bg-obsidian-900/90 border border-gold/30 p-6 md:p-8 rounded-sm mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 backdrop-blur-sm">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono tracking-super-wide text-gold uppercase">
                {activeTier.badge} Allocation
              </span>
              <span className="text-xs text-white/30">|</span>
              <span className="text-xs font-mono text-gold-champagne">
                {activeTier.formattedRange}
              </span>
            </div>
            <h4 className="text-xl md:text-2xl font-serif text-white">
              {activeTier.tagline}
            </h4>
            <p className="text-xs md:text-sm text-silver-dark leading-relaxed">
              {activeTier.description}
            </p>
          </div>

          <div className="flex-shrink-0 flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <span className="text-xs text-silver-dark block font-mono">Curated Pieces</span>
              <span className="text-xl font-serif text-white font-bold">{recommendedWatches.length} Available</span>
            </div>
            <Link href={`/watches?tier=${activeTierId}`}>
              <LuxuryButton variant="gold" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
                View Full Tier ({recommendedWatches.length})
              </LuxuryButton>
            </Link>
          </div>
        </div>

        {/* Dynamic Recommended Watches Preview Grid */}
        {showPreviewGrid && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendedWatches.map((watch) => (
                <ProductCard key={watch.id} product={watch} />
              ))}
            </div>

            {recommendedWatches.length === 0 && (
              <div className="text-center py-16 border border-white/10 p-8 rounded bg-obsidian-900/40">
                <p className="text-silver-dark font-serif text-lg">
                  Atelier allocation in progress for this tier.
                </p>
                <p className="text-xs text-silver-dark mt-2 font-mono">
                  Inquire with our private client salon for bespoke commission requests.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
