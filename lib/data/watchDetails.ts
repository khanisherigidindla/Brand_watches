"use client";
import type { RealWatch } from "./realWatches";

/** Rich inferred specs for EVERY watch — brand/type/metal/cost + more. */
export interface EnrichedSpecs {
  type: string; metal: string; dial: string; strap: string;
  water: string; power: string; frequency: string; jewels: number;
  thickness: string; glass: string; warranty: string;
  description: string; features: string[]; limited: boolean; stock: number;
}
function hash(s: string): number {
  let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}
const METALS = ["Oystersteel Stainless Steel", "316L Stainless Steel", "Brushed Titanium", "18k Pink Gold + Steel", "Bronze + Steel", "Carbon Composite + Steel"];
const DIALS = ["Sunburst Blue", "Matte Black", "Champagne Gold", "Ice Blue", "Emerald Green", "Silver Opaline", "Midnight Navy", "Bronze Fumé"];
const STRAPS = ["Oystersteel Bracelet", "Leather Strap", "Titanium Bracelet", "Steel Mesh Bracelet", "Resin Sport Strap", "NATO Fabric Strap"];
const TYPES = ["Automatic Diver", "Chronograph", "Dress Classic", "GMT Dual-Time", "Moonphase", "Field Watch", "Digital Sport", "Skeleton Limited"];

export function enrichWatch(w: RealWatch): EnrichedSpecs {
  if (w.description && w.features?.length && w.caseMaterial) {
    return {
      type: w.movement?.includes("Chrono") ? "Chronograph" : "Automatic Classic",
      metal: w.caseMaterial, dial: w.dialColor || "—", strap: w.strapMaterial || "—",
      water: w.waterResistance || "—", power: w.powerReserve || "—",
      frequency: w.frequency || "—", jewels: w.jewels || 0,
      thickness: w.caseThickness || "—", glass: "Sapphire Crystal",
      warranty: "5-year warranty + certificate",
      description: w.description, features: w.features || [],
      limited: !!w.limitedEdition, stock: w.stockQuantity ?? 5,
    };
  }
  const h = hash(w.id);
  const lux = w.priceINR > 500000;
  const type = w.movement?.includes("Chrono") ? "Chronograph"
    : w.movement?.includes("Quartz") || w.movement?.includes("Digital") ? TYPES[(h % 2 === 0 ? 6 : 2)]
    : lux ? TYPES[h % 5] : TYPES[h % TYPES.length];
  const metal = w.caseMaterial || METALS[h % METALS.length];
  const dial = w.dialColor || DIALS[(h >> 3) % DIALS.length];
  const strap = w.strapMaterial || STRAPS[(h >> 5) % STRAPS.length];
  const water = w.waterResistance || (lux ? "100m / 10 ATM" : ["30m / 3 ATM", "50m / 5 ATM", "100m / 10 ATM", "200m / 20 ATM"][(h >> 2) % 4]);
  const power = w.powerReserve || (w.movement?.includes("Quartz") || w.movement?.includes("Digital") || w.movement?.includes("Solar") ? "Battery / Solar · 2-yr cell" : `${38 + (h % 5) * 8}h power reserve`);
  const jewels = w.jewels || (w.movement?.includes("Quartz") || w.movement?.includes("Digital") ? 0 : 21 + (h % 12));
  return {
    type, metal, dial, strap, water, power,
    frequency: w.frequency || (jewels ? "28,800 vph (4 Hz)" : "Quartz 32,768 Hz"),
    jewels, thickness: w.caseThickness || `${8 + (h % 6)}.${h % 9}mm`,
    glass: "Sapphire Crystal (anti-reflective)",
    warranty: lux ? "5-year international warranty + certificate" : "2-year brand warranty + bill",
    description: `${w.brand} ${w.name} (${w.reference}) — a ${type.toLowerCase()} in ${metal.toLowerCase()} with a ${dial.toLowerCase()} dial on ${strap.toLowerCase()}. Powered by ${w.movement}, sized ${w.caseSize}, sealed to ${water}. Priced at ₹${w.priceINR.toLocaleString("en-IN")} India street level.`,
    features: [w.movement, `${w.caseSize} · ${metal}`, `${dial} dial · Sapphire Crystal`, `${water} · ${power}`, strap],
    limited: lux && h % 3 === 0, stock: 2 + (h % 8),
  };
}
