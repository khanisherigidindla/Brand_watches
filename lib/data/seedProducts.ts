import { WatchProduct, BudgetTier } from "../types/watch";
import { CATALOG_PANELS } from "./catalogPanels";

/**
 * Single source of truth for the catalogue.
 * All 60 timepieces come from CATALOG_PANELS (3 curated price panels of 20
 * distinct watches each). Every watch has its own SVG image — no duplicates.
 *
 * BUDGET_TIERS / WATCH_PRODUCTS / MAISON_COLLECTIONS are re-exported here so
 * every page (home, watches, collections, dashboard, BudgetSelector, checkout)
 * reads from the same curated set with real attributes and images.
 */

export const BUDGET_TIERS: BudgetTier[] = [
  {
    id: "affordable_luxury",
    label: "Affordable & Premium",
    tagline: "The gateway to Swiss mechanical art",
    minPrice: 50000,
    maxPrice: 200000,
    formattedRange: "\u20B950,000 \u2013 \u20B92,00,000",
    description: "Steel, titanium and automatic calibres for the first collector.",
    badge: "Tier I & II",
  },
  {
    id: "premium",
    label: "Premium",
    tagline: "Fine horology & chronometric precision",
    minPrice: 200000,
    maxPrice: 1000000,
    formattedRange: "\u20B92,00,000 \u2013 \u20B910,00,000",
    description: "Skeletonized escapements, ceramic bezels and COSC-certified movements.",
    badge: "Tier III",
  },
  {
    id: "high_luxury",
    label: "High-Luxury Executive",
    tagline: "Precious metals & complex complications",
    minPrice: 1000000,
    maxPrice: 5000000,
    formattedRange: "\u20B910,00,000 \u2013 \u20B950,00,000",
    description: "18K gold and platinum cases with open-worked dials and alligator straps.",
    badge: "Tier IV",
  },
  {
    id: "collector",
    label: "Collector",
    tagline: "Flying tourbillons & museum-grade pieces",
    minPrice: 5000000,
    maxPrice: 10000000,
    formattedRange: "\u20B950,00,000 \u2013 \u20B91,00,00,000",
    description: "Baguette bezels, flying tourbillons and strictly numbered editions.",
    badge: "Tier V",
  },
  {
    id: "ultra_luxury",
    label: "Billionaire & Gem-Set",
    tagline: "Pinnacle grand complications",
    minPrice: 10000000,
    maxPrice: 50000000,
    formattedRange: "\u20B91,00,00,000+",
    description: "Gem-set tourbillons, perpetual calendars and one-of-a-kind royalty pieces.",
    badge: "Tier V+",
  },
];

export const CATALOG_WATCHES: WatchProduct[] = CATALOG_PANELS.flatMap((panel) => panel.watches);

export const WATCH_PRODUCTS: WatchProduct[] = CATALOG_WATCHES;

export const MAISON_COLLECTIONS = (() => {
  const counts: Record<string, number> = {};
  for (const w of CATALOG_WATCHES) {
    const key = w.collection.toLowerCase();
    counts[key] = (counts[key] || 0) + 1;
  }
  const base = [
    { id: "tourbillon", slug: "tourbillon", name: "Tourbillon Collection", tagline: "Defying gravity", description: "Flying tourbillons that cancel out gravity's pull on timekeeping.", image: "/assets/watches/w-panel-3-1.svg" },
    { id: "skeleton", slug: "skeleton", name: "Skeleton Collection", tagline: "Exposed mechanics", description: "Almost every gram of metal carved away to reveal the calibre.", image: "/assets/watches/w-panel-2-1.svg" },
    { id: "chronograph", slug: "chronograph", name: "Imperial Chronograph", tagline: "Measure of velocity", description: "Column-wheel chronographs engineered for split-second timing.", image: "/assets/watches/w-panel-1-5.svg" },
    { id: "heritage", slug: "heritage", name: "Heritage Dress", tagline: "Timeless elegance", description: "Classic dress timepieces for the refined collector.", image: "/assets/watches/w-panel-1-1.svg" },
    { id: "imperial", slug: "imperial", name: "Imperial Dual-Time", tagline: "Two time zones", description: "GMT complications made for the global traveller.", image: "/assets/watches/w-panel-2-12.svg" },
  ];
  return base.map((c) => ({ ...c, count: counts[c.id] || 0 }));
})();