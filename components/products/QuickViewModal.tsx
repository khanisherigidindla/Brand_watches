"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { X, Eye, ShieldCheck, ArrowRight, Layers, RotateCcw } from "lucide-react";
import { WatchProduct } from "@/lib/types/watch";
import { useCartStore } from "@/lib/store/cartStore";
import { LuxuryButton } from "../ui/LuxuryButton";
import Link from "next/link";
import { CameraPreset } from "../3d/CameraController";

// Dynamic import for WatchCanvas to avoid SSR WebGL context errors
const WatchCanvas = dynamic(
  () => import("../3d/WatchCanvas").then((mod) => mod.WatchCanvas),
  { ssr: false }
);

interface QuickViewModalProps {
  product: WatchProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("hero");
  const [exploded, setExploded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Modal Container */}
      <div className="relative bg-obsidian-950 border border-gold/30 w-full max-w-5xl rounded-sm shadow-2xl overflow-hidden z-10 grid grid-cols-1 lg:grid-cols-12 max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-silver hover:text-gold transition-colors duration-200"
          aria-label="Close"
          data-cursor="CLOSE"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: 3D Interactive Viewer Canvas */}
        <div className="lg:col-span-7 bg-gradient-to-b from-obsidian-900 to-obsidian-950 p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 relative">
          <div className="flex justify-between items-center z-10">
            <span className="text-[10px] font-mono tracking-super-wide text-gold uppercase">
              Interactive 3D Showroom
            </span>
            <span className="text-[10px] font-mono text-silver-dark flex items-center gap-1">
              <RotateCcw className="w-3 h-3 text-gold" /> Drag to Rotate · Scroll to Zoom
            </span>
          </div>

          <div className="h-[360px] md:h-[420px] w-full my-2">
            <WatchCanvas
              product={product}
              cameraPreset={cameraPreset}
              exploded={exploded}
              enableZoom={true}
              interactive={true}
              className="w-full h-full"
            />
          </div>

          {/* Camera View Presets Controls */}
          <div className="flex flex-wrap gap-2 z-10 pt-2 border-t border-white/10">
            {(["hero", "front", "movement", "crown", "macro"] as CameraPreset[]).map((preset) => (
              <button
                key={preset}
                onClick={() => setCameraPreset(preset)}
                className={`px-3 py-1 text-[10px] font-mono uppercase tracking-wider rounded-sm border transition-all duration-300 ${
                  cameraPreset === preset
                    ? "bg-gold text-obsidian-950 border-gold font-bold"
                    : "border-white/15 text-silver-dark hover:text-gold hover:border-gold/50"
                }`}
              >
                {preset}
              </button>
            ))}
            <button
              onClick={() => setExploded(!exploded)}
              className={`px-3 py-1 text-[10px] font-mono uppercase tracking-wider rounded-sm border transition-all duration-300 flex items-center gap-1 ${
                exploded
                  ? "bg-gold text-obsidian-950 border-gold font-bold"
                  : "border-white/15 text-silver-dark hover:text-gold hover:border-gold/50"
              }`}
            >
              <Layers className="w-3 h-3" />
              {exploded ? "Assembled" : "Exploded View"}
            </button>
          </div>
        </div>

        {/* Right: Watch Details & Acquisition */}
        <div className="lg:col-span-5 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-super-wide text-gold">
                  {product.collection}
                </span>
                {product.limitedEdition && (
                  <span className="text-[9px] font-mono bg-gold/15 text-gold border border-gold/30 px-1.5 py-0.5 rounded">
                    {product.pieceNumber || "Limited Edition"}
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-serif text-white mt-1">
                {product.name}
              </h3>
              <p className="text-xl font-mono text-gold font-semibold mt-2">
                {product.formattedPrice}
              </p>
              <p className="text-xs text-silver-dark mt-2 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Micro Specs */}
            <div className="grid grid-cols-2 gap-3 py-3 border-y border-white/10 text-xs font-mono">
              <div>
                <span className="text-silver-dark block text-[10px]">Movement</span>
                <span className="text-white">{product.movement}</span>
              </div>
              <div>
                <span className="text-silver-dark block text-[10px]">Case Material</span>
                <span className="text-white">{product.caseMaterial}</span>
              </div>
              <div>
                <span className="text-silver-dark block text-[10px]">Power Reserve</span>
                <span className="text-white">{product.powerReserve}</span>
              </div>
              <div>
                <span className="text-silver-dark block text-[10px]">Diameter</span>
                <span className="text-white">{product.caseDiameter}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-white/60">
              <ShieldCheck className="w-4 h-4 text-gold flex-shrink-0" />
              <span>Includes 5-year International Maison Warranty & Geneva Certificate</span>
            </div>
          </div>

          <div className="pt-6 space-y-3">
            <LuxuryButton
              variant="gold"
              size="md"
              className="w-full"
              onClick={() => {
                addItem(product);
                onClose();
              }}
            >
              Add to Acquisition Portfolio
            </LuxuryButton>

            <Link
              href={`/watches/${product.slug}`}
              onClick={onClose}
              className="block text-center text-xs font-mono uppercase tracking-wider text-silver-dark hover:text-gold transition-colors duration-200"
            >
              View Full Timepiece Dossier →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
