"use client";
import React, { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { REAL_WATCHES } from "@/lib/data/realWatches";
import { WatchCard } from "@/components/watch/WatchCard";
const ALL_WATCHES = [...REAL_WATCHES];
const BRANDS = ["All", ...Array.from(new Set(ALL_WATCHES.map((w) => w.brand))).sort()];
const RANGES = [
  { id: "all", label: "All prices" },
  { id: "u250", label: "Under Rs 2.5 Lakh" },
  { id: "250_1000", label: "Rs 2.5L - Rs 10L" },
  { id: "1000up", label: "Above Rs 10 Lakh" },
];
function inRange(p: number, r: string) {
  if (r === "u250") return p < 250000;
  if (r === "250_1000") return p >= 250000 && p < 1000000;
  if (r === "1000up") return p >= 1000000;
  return true;
}
function WatchesContent() {
  const sp = useSearchParams();
  const [q, setQ] = useState(sp.get("q") || "");
  const [brand, setBrand] = useState("All");
  const [range, setRange] = useState("all");
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return ALL_WATCHES.filter((w) => {
      if (brand !== "All" && w.brand !== brand) return false;
      if (!inRange(w.priceINR, range)) return false;
      if (s && !`${w.brand} ${w.name} ${w.reference}`.toLowerCase().includes(s)) return false;
      return true;
    });
  }, [q, brand, range]);
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-12">
        <p className="text-[11px] font-bold tracking-[0.24em] uppercase text-[#b9975b]">The catalogue</p>
        <h1 className="mt-2 text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">All watches</h1>
        <p className="mt-2 text-slate-500 text-[15px]">Exact photos, full names, real market prices · {list.length} references</p>
        <div className="mt-6 flex flex-col md:flex-row gap-3 md:items-center">
          <label className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-4 py-2.5 w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search brand, model, reference…" className="bg-transparent outline-none text-sm w-full" />
          </label>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {RANGES.map((r) => (
            <button key={r.id} onClick={() => setRange(r.id)} className={range === r.id ? "text-[13px] font-semibold rounded-lg px-4 py-2 border bg-[#0e3a5d] text-white border-[#0e3a5d]" : "text-[13px] rounded-lg px-4 py-2 border bg-white text-slate-600 border-slate-200"}>{r.label}</button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {BRANDS.map((b) => (
            <button key={b} onClick={() => setBrand(b)} className={brand === b ? "text-[13px] rounded-lg px-4 py-2 border bg-slate-900 text-white border-slate-900" : "text-[13px] rounded-lg px-4 py-2 border bg-white text-slate-600 border-slate-200"}>{b}</button>
          ))}
        </div>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {list.map((w) => (<WatchCard key={w.id} watch={w} />))}
        </div>
        {list.length === 0 && (<div className="mt-8 border border-slate-200 rounded-xl p-10 text-center text-slate-500">No watches match. Clear the search or pick another brand.</div>)}
      </div>
    </div>
  );
}
export default function WatchesPage() {
  return (<Suspense fallback={<div className="min-h-screen bg-white" />}><WatchesContent /></Suspense>);
}
