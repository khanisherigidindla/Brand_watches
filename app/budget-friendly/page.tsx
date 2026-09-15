"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Filter } from "lucide-react";
import { ULTRA_BUDGET_WATCHES } from "@/lib/data/ultraBudgetWatches";
import { formatINR } from "@/lib/data/realWatches";
import { enrichWatch } from "@/lib/data/watchDetails";
import { Watch360Viewer } from "@/components/watch/Watch360Viewer";

const BRANDS = ["All", ...Array.from(new Set(ULTRA_BUDGET_WATCHES.map((w) => w.brand))).sort()];
const MIN = 400;
const MAX = 2000;

export default function BudgetPage() {
  const [brand, setBrand] = useState("All");
  const [focus, setFocus] = useState(ULTRA_BUDGET_WATCHES[0]);
  const featured = ULTRA_BUDGET_WATCHES.filter((w) => {
    if (brand !== "All" && w.brand !== brand) return false;
    return w.priceINR >= MIN && w.priceINR <= MAX;
  });
  return (
    <div className="bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-12">
          <p className="text-[11px] font-bold tracking-[0.24em] uppercase text-[#b9975b]">
            Budget-friendly • Rs {MIN} – Rs {MAX}
          </p>
          <h1 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight">
            Entry-tier watches at honest prices
          </h1>
          <p className="mt-3 text-slate-500 max-w-2xl text-[15px]">
            Real photographs of genuine starter timepieces — every watch shown
            with its exact picture and real market price.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 md:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: filters + featured watch grid */}
          <div className="w-full">
            <div className="flex flex-wrap gap-2 mb-6">
              {BRANDS.map((b) => (
                <button
                  key={b}
                  onClick={() => setBrand(b)}
                  className={
                    brand === b
                      ? "text-[13px] font-semibold rounded-lg px-4 py-2 border bg-[#0e3a5d] text-white border-[#0e3a5d]"
                      : "text-[13px] font-medium rounded-lg px-4 py-2 border bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                  }
                >
                  {b}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.length === 0 ? (
                <p className="text-slate-400">No watches match that filter.</p>
              ) : (
                featured.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => setFocus(w)}
                    className="group text-left border border-slate-200 rounded-xl overflow-hidden bg-white hover:shadow-[0_18px_45px_-18px_rgba(15,35,60,0.25)] hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div className="relative aspect-[4/3] bg-white">
                      <img
                        src={w.image}
                        alt={`${w.brand} ${w.name}`}
                        className="absolute inset-0 w-full h-full object-contain p-5"
                        loading="lazy"
                      />
                      <span className="absolute top-3 left-3 text-[10px] font-bold tracking-[0.16em] uppercase bg-slate-900 text-white px-2.5 py-1 rounded">
                        {w.brand}
                      </span>
                    </div>
                    <div className="p-3 border-t border-slate-100">
                      <p className="text-[15px] font-bold text-slate-900 group-hover:text-[#0e3a5d] transition-colors">
                        {w.brand} {w.name}
                      </p>
                      {(() => { const s = enrichWatch(w); return (
                        <>
                          <p className="mt-0.5 text-[11px] font-semibold text-slate-500">{s.type} · {s.metal}</p>
                          <p className="mt-0.5 text-[11px] text-slate-400">{s.dial} · {s.strap} · {s.water}</p>
                        </>
                      ); })()}
                      <p className="mt-1 text-[13px] text-[#0e3a5d] font-extrabold">{formatINR(w.priceINR)}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
            <div className="mt-8 inline-flex items-center gap-2 text-sm text-slate-600">
              <Filter className="w-4 h-4 text-[#0e3a5d]" />
              Showing {featured.length} watches between Rs {MIN} – Rs {MAX}
            </div>
          </div>

          {/* Right: live 360° viewer — pick a watch above to see it spin */}
          <div className="sticky top-8 w-full">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-[0_30px_70px_-30px_rgba(15,35,60,0.15)]">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b9975b] mb-3">360° VIEW</p>
              <Watch360Viewer src={focus.image} alt={`${focus.brand} ${focus.name}`} className="w-full" />
              <div className="mt-4 text-center">
                <h3 className="text-lg font-bold text-slate-900">{focus.brand} {focus.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{focus.reference}</p>
                {(() => { const s = enrichWatch(focus); return (
                  <>
                    <p className="mt-1 text-[12px] font-bold text-[#0e3a5d]">{s.type} · {s.metal}</p>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-left text-[12px]">
                      {[
                        ["Dial", s.dial],
                        ["Strap", s.strap],
                        ["Movement", focus.movement],
                        ["Power", s.power],
                        ["Water", s.water],
                        ["Glass", s.glass],
                      ].map(([k, v]) => (
                        <div key={k} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                          <p className="text-slate-400 font-medium">{k}</p>
                          <p className="text-slate-800 font-semibold">{v}</p>
                        </div>
                      ))}
                    </div>
                    <p className="mt-3 text-[13px] leading-relaxed text-slate-600 text-left">{s.description}</p>
                  </>
                ); })()}
                <p className="mt-2 text-xl font-extrabold text-[#0e3a5d]">{formatINR(focus.priceINR)}</p>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <Link
                    href={`/watches/${focus.id}`}
                    className="inline-flex items-center justify-center gap-2 bg-[#0e3a5d] hover:bg-[#0a2a44] text-white text-sm font-bold rounded-lg px-6 py-3"
                  >
                    View details <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/budget-friendly"
                    className="inline-flex items-center justify-center gap-2 text-[#0e3a5d] border border-slate-300 rounded-lg px-5 py-2.5 text-sm font-bold hover:border-[#0e3a5d]"
                  >
                    <BadgeCheck className="w-4 h-4 text-[#b9975b]" /> Verified
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
