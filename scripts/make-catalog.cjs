/* Emits lib/data/catalogPanels.ts: 3 panels x 20 distinct watches. */
const fs = require("fs");
const path = require("path");

const PANELS = [
  {
    key: "pan1",
    label: "Affordable & Premium",
    range: "₹50,000 – ₹10,00,000",
    series: [
      "Classic",
      "Dynasty Sport",
      "Heritage",
      "Meridian",
      "Horizon GMT",
      "Riva Chrono",
      "Onyx",
      "Sonata",
      "Voyager",
      "Aria",
    ],
    tier: ["affordable_luxury", "premium"],
    metal: "Stainless Steel 316L",
    price: (k) => (k < 10 ? 55000 + k * 13000 : 200000 + (k - 10) * 70000),
    dials: [
      "Silver",
      "White",
      "Midnight Blue",
      "Ivory",
      "Black",
      "Steel Grey",
      "Forest Green",
      "Midnight Navy",
    ],
    comp: [
      "Chronograph",
      "Dress",
      "Sport",
      "Dress",
      "Chronograph",
      "GMT",
      "Skeleton",
    ],
    movement: [
      "Skeleton Chronograph",
      "Manual-Wind Haute Horlogerie",
      "Automatic GMT",
      "Automatic Tourbillon",
    ],
  },
  {
    key: "pan2",
    label: "High-Luxury Executive",
    range: "₹10,00,000 – ₹50,00,000",
    series: [
      "Atelier",
      "Sovereign",
      "Eclat",
      "Infinito",
      "Regal",
      "Midas",
      "Velour",
      "Triomphe",
      "Celeste",
      "Majestic",
    ],
    tier: ["high_luxury", "collector"],
    metal: "18K Rose Gold",
    price: (k) => (k < 10 ? 1100000 + k * 65000 : 4000000 + (k - 10) * 180000),
    dials: [
      "Ivory",
      "Florentine",
      "Midnight Navy",
      "Claret",
      "Silver Linen",
      "Azure",
      "Champagne",
      "Skeleton Rhodium",
    ],
    comp: ["Skeleton", "Rose", "Skeleton", "GMT", "Dress", "Skeleton"],
    movement: [
      "Automatic GMT",
      "Skeleton Chronograph",
      "Manual-Wind Haute Horlogerie",
    ],
  },
  {
    key: "pan3",
    label: "Billionaire & Gem-Set",
    range: "₹1,00,00,000+",
    series: [
      "Royale Tourbillon",
      "Lumiere",
      "Celeste Eternelle",
      "Imperial",
      "Astron",
      "Sultan",
      "Heritage Royal",
      "Cosmopolite",
    ],
    tier: ["ultra_luxury", "collector"],
    metal: "Platinum 950",
    price: (k) =>
      k < 10 ? 11000000 + k * 1800000 : 40000000 + (k - 10) * 6000000,
    dials: [
      "Midnight Navy",
      "Obsidian Black",
      "Burgundy",
      "Slate",
      "Royal Blue",
      "Skeleton Gold",
      "Astral Blue",
    ],
    comp: ["Tourbillon", "Moon", "Tourbillon", "Moon", "Perpetual Calendar"],
    movement: [
      "Automatic Tourbillon",
      "Perpetual Calendar",
      "Grand Complication",
    ],
  },
];

const inr = (n) => {
  if (n >= 10000000) {
    const c = n / 10000000;
    return (
      "\u20B9" +
      (c % 1 === 0 ? c : c.toFixed(2).replace(/\.00$/, "")) +
      " Crore"
    );
  }
  if (n >= 100000) {
    const l = n / 100000;
    return (
      "\u20B9" + (l % 1 === 0 ? l : l.toFixed(2).replace(/\.00$/, "")) + " Lakh"
    );
  }
  const s = String(n);
  const last = s.slice(-3);
  const rest = s.slice(0, -3);
  const out = rest
    ? rest.length > 3
      ? "\u20B9" + rest.slice(0, -2) + "," + rest.slice(-2)
      : "\u20B9" + rest
    : "\u20B9";
  return out + "," + last;
};

function compToCollection(c) {
  if (c === "Tourbillon") return "Tourbillon";
  if (c === "GMT") return "Imperial";
  if (c === "Skeleton") return "Skeleton";
  if (c === "Chronograph") return "Chronograph";
  return "Heritage";
}

let items = [];
let idx = 0;
for (let p = 0; p < PANELS.length; p++) {
  const P = PANELS[p];
  for (let k = 0; k < 20; k++) {
    idx++;
    const num = String(k + 1).padStart(2, "0");
    const slug = `${P.key}-${num}`;
    const series = `${P.series[k % P.series.length]} ${["I", "II", "III", "IV", "V"][k % 5]}`;
    const dial = P.dials[(k * 3) % P.dials.length];
    const comp =
      typeof P.comp === "string" ? P.comp : P.comp[k % P.comp.length];
    const mov = P.movement[k % P.movement.length];
    const tier = P.tier[k >= 10 ? P.tier.length - 1 : 0];
    const price = P.price(k);
    const strap =
      p === 2
        ? "Hand-Brushed Platinum 950 Triple-Link Bracelet"
        : comp === "Sport" || comp === "Chronograph"
          ? "Integrated 316L Steel Link Bracelet"
          : "Hand-Selected Alligator Leather Strap";
    items.push(`    {
      id: "aur-${slug}",
      name: "Aurelion ${series}",
      slug: "${slug}",
      tagline: "${dial} ${P.metal} · ${comp}",
      collection: ${JSON.stringify(compToCollection(comp))},
      budgetTier: "${tier}",
      priceINR: ${price},
      formattedPrice: "${inr(price)}",
      limitedEdition: ${p === 2},
      pieceNumber: ${p === 2 ? `"${(k % 25) + 1} / 25"` : "undefined"},
      stockQuantity: ${5 + (k % 5)},
      movement: "${mov}",
      calibre: "Calibre AUR-${1000 + idx * 13}",
      powerReserve: ${JSON.stringify(["72 Hours", "90 Hours", "50 Hours", "65 Hours"][k % 4])},
      frequency: ${JSON.stringify(["28,800 vph", "21,600 vph", "25,200 vph"][k % 3])},
      jewels: ${28 + (k % 14)},
      waterResistance: ${JSON.stringify(["50m", "100m", "30m", "300m"][k % 4])},
      caseMaterial: "${P.metal}",
      caseDiameter: ${JSON.stringify(["40mm", "41mm", "42mm", "39mm", "43mm"][k % 5])},
      caseThickness: ${JSON.stringify(["10.5mm", "11.8mm", "9.2mm", "12.1mm"][k % 4])},
      strapMaterial: "${strap}",
      dialColor: "${dial}",
      description: "The Aurelion ${series} pairs a ${dial} ${P.metal.toLowerCase()} timepiece with ${comp} precision — finished by hand in our Geneva atelier.",
      craftsmanshipNotes: ${JSON.stringify(["Hand-finished in Geneva", "Sapphire anti-reflective crystal", "Chronometric tested over 200 hours"])},
      features: ${JSON.stringify([comp, `${P.metal} case`, `${dial} dial`, "Secure online payment"])},
      images: ["/assets/watches/w-panel-${p + 1}-${k + 1}.svg"],
      modelUrl: "/models/watches/${slug}.glb"
    }`);
  }
}

const header = `import { WatchProduct } from "../types/watch";

// 3 curated panels: 20 distinct watches each, image per watch, no duplicates.
export type CatalogPanel = {
  id: string;
  label: string;
  range: string;
  badge: string;
  watches: WatchProduct[];
};

export const CATALOG_PANELS: CatalogPanel[] = [
  {
    id: "affordable-premium",
    label: "Affordable & Premium",
    range: "\u20B950,000 \u2013 \u20B910,00,000",
    badge: "Tier I & II",
    watches: [
${items.slice(0, 20).join(",\n")}
    ]
  },
  {
    id: "high-luxury-executive",
    label: "High-Luxury Executive",
    range: "\u20B910,00,000 \u2013 \u20B950,00,000",
    badge: "Tier III & IV",
    watches: [
${items.slice(20, 40).join(",\n")}
    ]
  },
  {
    id: "billionaire-gemset",
    label: "Billionaire & Gem-Set",
    range: "\u20B91,00,00,000+",
    badge: "Tier V",
    watches: [
${items.slice(40, 60).join(",\n")}
    ]
  }
];
`;
fs.writeFileSync(
  path.join(__dirname, "..", "lib", "data", "catalogPanels.ts"),
  header,
  "utf8",
);
console.log("Wrote lib/data/catalogPanels.ts with", items.length, "watches");
