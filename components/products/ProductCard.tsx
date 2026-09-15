"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Heart, ShoppingBag } from "lucide-react";
import { WatchProduct } from "@/lib/types/watch";
import { useWishlistStore } from "@/lib/store/wishlistStore";
import { useCartStore } from "@/lib/store/cartStore";
import { useUserStore } from "@/lib/store/userStore";
import { QuickViewModal } from "@/components/products/QuickViewModal";

export const ProductCard: React.FC<{ product: WatchProduct }> = ({ product }) => {
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      if (typeof window !== "undefined") {
        localStorage.setItem("aura_pending_cart_item", JSON.stringify({ product, quantity: 1 }));
      }
      router.push("/login?redirect=cart");
      return;
    }
    addItem(product, 1);
  };

  return (
    <article className="group flex flex-col space-y-4">
      <div className="relative aspect-square w-full bg-obsidian-900/60 border border-white/10 overflow-hidden rounded-lg">
        <Link href={`/watches/${product.slug}`} className="block h-full">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-contain p-6 group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </Link>

        {product.limitedEdition && (
          <div className="absolute top-4 left-4 bg-gold text-obsidian-950 text-[10px] px-2 py-1 uppercase tracking-widest font-semibold">
            Rare
          </div>
        )}

        <div className="absolute top-4 right-4 flex gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`p-2 rounded-full border transition-colors ${
              isInWishlist
                ? "border-red-400 bg-red-500 text-white"
                : "border-white/15 bg-obsidian-950/70 text-silver hover:border-gold hover:text-gold"
            }`}
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`w-4 h-4 ${isInWishlist ? "fill-current" : ""}`} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setQuickViewOpen(true);
            }}
            className="p-2 rounded-full border border-white/15 bg-obsidian-950/70 text-silver hover:border-gold hover:text-gold transition-colors"
            aria-label="Quick view in 3D"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          className="absolute bottom-4 right-4 p-2 rounded-full bg-gold text-obsidian-950 hover:brightness-110 transition-colors shadow-md"
          aria-label="Add to cart"
        >
          <ShoppingBag className="w-4 h-4" />
        </button>
      </div>

      {/* Watch Information */}
      <div className="flex flex-col space-y-1">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h3 className="text-[10px] font-mono text-silver-dark uppercase tracking-widest">Aura</h3>
            <h4 className="text-base font-serif text-white line-clamp-1 mt-1 group-hover:text-gold transition-colors">
              {product.name}
            </h4>
          </div>
          <span className="text-sm font-mono text-gold font-semibold whitespace-nowrap">{product.formattedPrice}</span>
        </div>
        <div className="pt-2 flex items-center justify-between">
          <Link
            href={`/watches/${product.slug}`}
            className="text-sm text-silver-dark group-hover:text-gold transition-colors underline underline-offset-4 decoration-zinc-700 group-hover:decoration-gold"
          >
            View Details
          </Link>
          <button
            type="button"
            onClick={() => setQuickViewOpen(true)}
            className="text-[10px] font-mono uppercase tracking-wide text-silver-dark hover:text-gold transition-colors"
          >
            Quick View 3D
          </button>
        </div>
      </div>

      <QuickViewModal product={product} isOpen={quickViewOpen} onClose={() => setQuickViewOpen(false)} />
    </article>
  );
};