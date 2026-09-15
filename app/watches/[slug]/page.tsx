"use client";
import React, { useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft, Heart, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { REAL_WATCHES, formatINR, RealWatch } from "@/lib/data/realWatches";
import { BUDGET_WATCHES } from "@/lib/data/budgetWatches";
import { ULTRA_BUDGET_WATCHES } from "@/lib/data/ultraBudgetWatches";
import { useCartStore } from "@/lib/store/cartStore";
import { useWishlistStore } from "@/lib/store/wishlistStore";
import { WatchCard } from "@/components/watch/WatchCard";
import { Watch360Viewer } from "@/components/watch/Watch360Viewer";
import { WatchProduct } from "@/lib/types/watch";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/userStore";
import { enrichWatch } from "@/lib/data/watchDetails";

export default function WatchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const ALL = [...REAL_WATCHES, ...BUDGET_WATCHES, ...ULTRA_BUDGET_WATCHES] as RealWatch[];
  const watch = ALL.find((w) => w.id === slug);
  const specs = React.useMemo(() => (watch ? enrichWatch(watch) : null), [watch?.id]);
  const addItem = useCartStore((s) => s.addItem);
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const isWished = useWishlistStore((s) => (watch ? s.isInWishlist(watch.id) : false));
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!watch || !specs) return notFound();

  const handleAddToCart = () => {
    const p = toProduct();
    if (!isAuthenticated) {
      if (typeof window !== "undefined") {
        localStorage.setItem("aurelion_pending_cart_item", JSON.stringify({ product: p, quantity: qty }));
      }
      router.push("/login?redirect=cart");
      return;
    }
    addItem(p, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };
  const toProduct = (): WatchProduct => ({
    id: watch.id, name: `${watch.brand} ${watch.name}`, slug: watch.id,
    tagline: watch.reference, collection: specs.limited ? "Heritage" : "Luxury",
    budgetTier: watch.priceINR < 200000 ? "affordable_luxury" : "premium",
    priceINR: watch.priceINR, formattedPrice: formatINR(watch.priceINR),
    limitedEdition: specs.limited, stockQuantity: specs.stock, movement: "Automatic" as any,
    calibre: watch.movement, powerReserve: specs.power, frequency: specs.frequency, jewels: specs.jewels,
    waterResistance: specs.water, caseMaterial: "Stainless Steel 316L" as any, caseDiameter: watch.caseSize,
    caseThickness: specs.thickness, strapMaterial: specs.strap, dialColor: specs.dial,
    description: specs.description, craftsmanshipNotes: [],
    features: specs.features, images: [watch.image], modelUrl: "",
  });
  const related = ALL.filter((w) => w.brand === watch.brand && w.id !== watch.id).slice(0, 4);
  const rel2 = related.length ? related : ALL.filter((w) => w.id !== watch.id).slice(0, 4);
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-10">
        <Link href="/watches" className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#0e3a5d]">
          <ArrowLeft className="w-4 h-4" /> Back to collection
        </Link>
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="relative">
              <Watch360Viewer src={watch.image} alt={`${watch.brand} ${watch.name}`} className="w-full" />
              <span className="absolute top-4 left-4 text-[11px] font-bold tracking-[0.16em] uppercase bg-slate-900 text-white px-3 py-1.5 rounded-full">{watch.brand}</span>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 grid grid-cols-3 gap-3 text-center">
              <div><p className="text-[11px] uppercase tracking-widest text-slate-400">Movement</p><p className="text-[13px] font-semibold text-slate-800">{watch.movement}</p></div>
              <div><p className="text-[11px] uppercase tracking-widest text-slate-400">Case</p><p className="text-[13px] font-semibold text-slate-800">{watch.caseSize}</p></div>
              <div><p className="text-[11px] uppercase tracking-widest text-slate-400">Reference</p><p className="text-[13px] font-semibold text-slate-800">{watch.reference}</p></div>
            </div>
          </div>
          <div data-gsap-reveal>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">{watch.brand} {watch.name}</h1>
            <p className="mt-2 text-sm text-slate-500">{watch.reference}</p>
            <p className="mt-2 text-[13px] font-bold text-[#0e3a5d]">{specs.type} · {specs.metal}</p>
            <p className="mt-5 text-3xl font-extrabold text-[#0e3a5d]">{formatINR(watch.priceINR)}</p>
            <p className="mt-1 text-xs text-slate-400">Real India market price · incl. duties where applicable</p>
            <p className="mt-4 text-[14px] leading-relaxed text-slate-600">{specs.description}</p>
            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center border border-slate-200 rounded-lg">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3.5 py-2.5 text-lg" aria-label="Decrease">-</button>
                <span className="px-3 text-sm font-bold">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="px-3.5 py-2.5 text-lg" aria-label="Increase">+</button>
              </div>
              <button onClick={handleAddToCart} className="flex-1 inline-flex justify-center items-center gap-2 bg-[#0e3a5d] text-white font-bold rounded-lg px-6 py-3.5">
                <ShoppingBag className="w-4 h-4" /> {added ? "Added to bag" : "Add to bag"}
              </button>
              <button onClick={() => toggleWishlist(watch.id)} className={isWished ? "p-3.5 rounded-lg border bg-[#0e3a5d] text-white border-[#0e3a5d]" : "p-3.5 rounded-lg border border-slate-200 text-slate-600"} aria-label="Wishlist">
                <Heart className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px] text-slate-600">
              <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-4 py-3"><ShieldCheck className="w-4 h-4 text-[#0e3a5d]" /> {specs.warranty}</div>
              <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-4 py-3"><Truck className="w-4 h-4 text-[#0e3a5d]" /> Insured India delivery</div>
            </div>

            {/* Full spec sheet: type, brand, cost, metal + more */}
            <div className="mt-6 border border-slate-200 rounded-2xl overflow-hidden">
              <div className="px-5 py-3 bg-slate-900 text-white text-[12px] font-bold tracking-[0.18em] uppercase">Full specifications</div>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-0 text-[13px]">
                {[
                  ["Brand", watch.brand],
                  ["Model", watch.name],
                  ["Type", specs.type],
                  ["Reference", watch.reference],
                  ["Price (INR)", formatINR(watch.priceINR)],
                  ["Case metal", specs.metal],
                  ["Case size", watch.caseSize],
                  ["Case thickness", specs.thickness],
                  ["Dial", specs.dial],
                  ["Strap / bracelet", specs.strap],
                  ["Movement", watch.movement],
                  ["Power reserve", specs.power],
                  ["Frequency", specs.frequency],
                  ["Jewels", String(specs.jewels)],
                  ["Crystal / glass", specs.glass],
                  ["Water resistance", specs.water],
                  ["Availability", specs.limited ? "Limited · numbered" : `In stock (${specs.stock} pcs)`],
                  ["Warranty", specs.warranty],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between gap-4 px-5 py-2.5 border-b border-slate-100 last:border-0">
                    <dt className="text-slate-400 font-medium">{k}</dt>
                    <dd className="text-slate-800 font-semibold text-right">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="px-5 py-4 bg-slate-50 border-t border-slate-200">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#b9975b]">Highlights</p>
                <ul className="mt-2 space-y-1.5">
                  {specs.features.map((f) => (
                    <li key={f} className="text-[13px] text-slate-600 flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#b9975b] shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <h2 className="mt-14 text-2xl font-extrabold tracking-tight text-slate-900">You may also like</h2>
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {rel2.map((w) => (<WatchCard key={w.id} watch={w} />))}
        </div>
      </div>
    </div>
  );
}
