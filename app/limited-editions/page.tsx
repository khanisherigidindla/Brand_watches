"use client";
import React from "react";
import { Flame } from "lucide-react";
import { REAL_WATCHES } from "@/lib/data/realWatches";
import { enrichWatch } from "@/lib/data/watchDetails";
import { WatchCard } from "@/components/watch/WatchCard";
export default function LimitedEditionsPage() {
  const grails = [...REAL_WATCHES].sort((a, b) => b.priceINR - a.priceINR).slice(0, 8);
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-12">
        <p className="text-[11px] font-bold tracking-[0.24em] uppercase text-[#b9975b]">Limited · Costliest pieces</p>
        <h1 className="mt-2 text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">Collector vault</h1>
        <p className="mt-2 text-slate-500 text-[15px]">The costliest references with exact photos and real market prices.</p>
        <div className="mt-4 inline-flex items-center gap-2 text-[13px] font-semibold text-slate-700 border border-slate-200 rounded-lg px-4 py-2.5"><Flame className="w-4 h-4 text-[#b9975b]" /> Strictly numbered · certificate included</div>
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {grails.map((w) => {
            const s = enrichWatch(w);
            return (
              <div key={w.id} className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                <WatchCard watch={w} />
                <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/60">
                  <p className="text-[12px] font-bold text-[#0e3a5d]">{s.type} · {s.metal} · {s.water}</p>
                  <p className="mt-1 text-[13px] text-slate-600 leading-relaxed">{s.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {s.features.slice(0, 4).map((f) => (
                      <span key={f} className="text-[11px] font-semibold bg-white border border-slate-200 rounded-full px-2.5 py-1 text-slate-600">{f}</span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
