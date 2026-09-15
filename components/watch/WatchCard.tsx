"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { RealWatch, formatINR } from "@/lib/data/realWatches";
import { useCartStore } from "@/lib/store/cartStore";
import { useUserStore } from "@/lib/store/userStore";
import { WatchProduct } from "@/lib/types/watch";

const toProduct = (w: RealWatch): WatchProduct => ({
  id: w.id,
  name: `${w.brand} ${w.name}`,
  slug: w.id,
  tagline: w.reference,
  collection: "Luxury",
  budgetTier:
    w.priceINR < 200000
      ? "affordable_luxury"
      : w.priceINR < 1000000
        ? "premium"
        : w.priceINR < 5000000
          ? "high_luxury"
          : "collector",
  priceINR: w.priceINR,
  formattedPrice: formatINR(w.priceINR),
  limitedEdition: false,
  stockQuantity: 5,
  movement: "Automatic",
  calibre: w.movement,
  powerReserve: "—",
  frequency: "—",
  jewels: 0,
  waterResistance: "—",
  caseMaterial: "Stainless Steel",
  caseDiameter: w.caseSize,
  caseThickness: "—",
  strapMaterial: "—",
  dialColor: "—",
  description: `${w.brand} ${w.name} · ${w.reference}. ${w.movement}. Case ${w.caseSize}.`,
  craftsmanshipNotes: [],
  features: [w.movement, `Case ${w.caseSize}`, w.reference],
  images: [w.image],
  modelUrl: "",
});

export const WatchCard: React.FC<{ watch: RealWatch }> = ({ watch }) => {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);

  const handleAddToCart = () => {
    const product = toProduct(watch);
    if (!isAuthenticated) {
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "aurelion_pending_cart_item",
          JSON.stringify({ product, quantity: 1 }),
        );
      }
      router.push("/login?redirect=cart");
      return;
    }
    addItem(product, 1);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ y: -10, scale: 1.02, rotateX: 2, rotateY: -2 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      data-gsap-reveal
      className="watch-card group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-[0_22px_50px_-15px_rgba(15,35,60,0.25)] transition-shadow duration-300"
    >
      <div className="relative aspect-[4/3] bg-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(185,151,91,0.12),transparent_65%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <motion.div
          whileHover={{ scale: 1.1, rotateZ: 1.2, y: -6 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
          className="watch-card-image-shell w-full h-full relative"
        >
          <Image
            src={watch.image}
            alt={`${watch.brand} ${watch.name} — exact photograph`}
            fill
            className="watch-card-image object-contain p-5"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </motion.div>
        <span className="absolute top-3 left-3 text-[10px] font-bold tracking-[0.16em] uppercase bg-slate-900 text-white px-2.5 py-1 rounded shadow-md z-10">
          {watch.brand}
        </span>
        <span className="watch-card-gold-line absolute left-0 right-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[#b9975b] to-transparent opacity-70" />
      </div>
      <div className="p-4 border-t border-slate-100 bg-white">
        <h3 className="text-[17px] font-bold text-slate-900 leading-snug group-hover:text-[#0e3a5d] transition-colors">
          {watch.brand} {watch.name}
        </h3>
        <p className="mt-1 text-xs text-slate-400 font-mono">
          {watch.reference}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {watch.movement} · {watch.caseSize}
        </p>
        <p className="mt-3 text-[15px] font-extrabold text-[#0e3a5d]">
          {formatINR(watch.priceINR)}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-[#0e3a5d] hover:bg-slate-900 text-white text-[13px] font-bold rounded-lg px-4 py-2.5 transition-colors shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" /> Add to cart
          </button>
          <Link
            href={`/watches/${watch.id}`}
            className="text-[13px] font-bold text-[#0e3a5d] border border-slate-200 rounded-lg px-4 py-2.5 hover:border-[#0e3a5d] hover:bg-slate-50 transition-all"
          >
            Details
          </Link>
        </div>
      </div>
    </motion.article>
  );
};
