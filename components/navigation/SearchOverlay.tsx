"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X } from "lucide-react";
import { REAL_WATCHES, formatINR } from "@/lib/data/realWatches";
export const SearchOverlay: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [q, setQ] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (isOpen) { setTimeout(() => ref.current?.focus(), 100); document.body.style.overflow = "hidden"; }
    else { document.body.style.overflow = "unset"; setQ(""); }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);
  if (!isOpen) return null;
  const s = q.trim().toLowerCase();
  const res = s ? REAL_WATCHES.filter((w) => `${w.brand} ${w.name} ${w.reference}`.toLowerCase().includes(s)).slice(0, 6) : [];
  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col p-6 animate-fadeIn">
      <div className="flex justify-between items-center max-w-4xl mx-auto w-full border-b border-slate-200 pb-4">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0e3a5d]">Search the collection</span>
        <button onClick={onClose} aria-label="Close" className="p-2 hover:bg-slate-100 rounded-full"><X className="w-5 h-5" /></button>
      </div>
      <div className="max-w-3xl mx-auto w-full mt-8">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-slate-400 absolute left-3" />
          <input ref={ref} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rolex, Omega, Nautilus…" className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3.5 text-lg outline-none focus:border-[#0e3a5d]" />
        </div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {res.map((w) => (
            <Link key={w.id} href={`/watches/${w.id}`} onClick={onClose} className="flex gap-3 border border-slate-200 rounded-xl p-3 hover:border-[#0e3a5d]">
              <div className="relative w-20 h-20 shrink-0"><Image src={w.image} alt={w.name} fill className="object-contain" /></div>
              <div className="min-w-0"><p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{w.brand}</p><p className="text-sm font-bold text-slate-900 truncate">{w.name}</p><p className="text-sm font-bold text-[#0e3a5d]">{formatINR(w.priceINR)}</p></div>
            </Link>
          ))}
        </div>
        {s && res.length === 0 && (<p className="mt-8 text-center text-slate-400">No matches for “{q}”.</p>)}
      </div>
    </div>
  );
};
