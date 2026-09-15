"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Trash2, ArrowLeft, Sparkles } from "lucide-react";
import { useWishlistStore } from "@/lib/store/wishlistStore";
import { useCartStore } from "@/lib/store/cartStore";
import { useUserStore } from "@/lib/store/userStore";
import { getLocalProducts } from "@/lib/supabase/mockStore";
import { LuxuryButton } from '@/components/ui/LuxuryButton';
import { WatchProduct } from '@/lib/types/watch';

export default function WishlistPage() {
const productIds = useWishlistStore(s => s.productIds);
const toggleWishlist = useWishlistStore(s => s.toggleWishlist);
const addToCart = useCartStore((s) => s.addItem);

  const isAuthenticated = useUserStore((s) => s.isAuthenticated);

  const allProducts = getLocalProducts();


  const wishlistedProducts = allProducts.filter((p) =>
    productIds.includes(p.id)
  );

  const handleAddToCart = (product: WatchProduct) => {
    if (!isAuthenticated) {
      window.location.href = "/login?redirect=wishlist";
      return;
    }
    addToCart(product, 1);
  };
  const handleRemove = (productId: string) => { toggleWishlist(productId); };


  if (productIds.length === 0) {
    return (
      <div className="min-h-screen bg-obsidian-950 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <Heart className="w-16 h-16 mx-auto text-silver-dark/30" />
            <h1 className="text-3xl md:text-4xl font-serif text-white">
              Your Wishlist is Empty
            </h1>
            <p className="text-silver-dark text-sm max-w-md mx-auto">
              Discover exceptional timepieces and add them to your wishlist
              for later. Every piece in your collection matters.
            </p>
          </div>
          <Link href="/watches">
            <LuxuryButton
              variant="gold"
              size="lg"
              icon={<ShoppingBag className="w-4 h-4" />}
            >
              Explore Watches
            </LuxuryButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <button className="p-2 rounded-full text-silver-dark hover:text-white hover:bg-obsidian-800 transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </button>
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-serif text-white">My Wishlist</h1>
              <p className="text-xs text-silver-dark font-mono uppercase tracking-wider mt-1">
                {productIds.length} {productIds.length === 1 ? "Timepiece" : "Timepieces"} Saved
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistedProducts.map((product) => (
            <div
              key={product.id}
              className="group relative bg-obsidian-900 border border-white/10 rounded-lg overflow-hidden transition-all duration-300 hover:border-gold/30"
            >
              <Link href={`/watches/${product.slug}`} className="block">
                <div className="aspect-square relative bg-obsidian-800/50 overflow-hidden">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-contain p-8 group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.limitedEdition && (
                    <div className="absolute top-3 left-3 bg-gold text-obsidian-950 text-[10px] px-2 py-1 uppercase tracking-wider font-bold">
                      Rare
                    </div>
                  )}
                  {product.isNewArrival && (
                    <div className="absolute top-3 right-3 bg-emerald-glow/20 text-emerald-glow text-[10px] px-2 py-1 uppercase tracking-wider font-bold border border-emerald-glow/30">
                      New
                    </div>
                  )}
                </div>
              </Link>
              <div className="p-5 space-y-3">
                <div>
                  <h3 className="text-sm font-mono text-silver-dark uppercase tracking-wider">{product.collection}</h3>
                  <h4 className="text-lg font-serif text-white group-hover:text-gold transition-colors mt-1">{product.name}</h4>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-mono text-gold font-semibold">{product.formattedPrice}</span>
                  <div className="flex items-center gap-1 text-xs text-silver-dark">
                    <span>{product.movement}</span>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <LuxuryButton
                    variant="gold"
                    size="sm"
                    icon={<ShoppingBag className="w-3 h-3" />}
                    onClick={() => handleAddToCart(product)}
                    className="flex-1"
                  >
                    Add to Cart
                  </LuxuryButton>
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="p-2 rounded-lg border border-white/10 text-silver-dark hover:text-red-400 hover:border-red-500/30 transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {productIds.filter((id) => !allProducts.some((p) => p.id === id)).map((missingId) => (
            <div
              key={missingId}
              className="group relative bg-obsidian-900 border border-white/10 rounded-lg p-5 text-center"
            >
              <div className="py-8">
                <Sparkles className="w-10 h-10 text-silver-dark/40 mx-auto mb-3" />
                <p className="text-silver-dark text-sm">
                  Product data unavailable for ID: {missingId}
                </p>
              </div>
              <button
                onClick={() => handleRemove(missingId)}
                className="absolute top-3 right-3 p-1.5 rounded text-silver-dark hover:text-red-400 hover:bg-red-500/10 transition-colors"
                aria-label="Remove from wishlist"
              >
                <Heart className="w-4 h-4 fill-current text-red-400" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/watches">
            <button className="text-sm text-silver-dark hover:text-white font-mono flex items-center justify-center gap-2">
              <ShoppingBag className="w-4 h-4" /> Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
