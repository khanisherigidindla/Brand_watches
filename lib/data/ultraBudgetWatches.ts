import type { RealWatch } from "./realWatches";

/**
 * Ultra-budget entry tier — ₹400 – ₹2,000.
 * These use the real photographs uploaded into /public/budget (im3.webp,
 * image1.webp, img10.webp, etc.). Prices mirror India Jan-2026 street
 * levels for genuine starter timepieces.
 */
export const ULTRA_BUDGET_WATCHES: RealWatch[] = [
  { id: "sonata-fast-track", brand: "Sonata", name: "Fast Track", reference: "NRF33578/07 · 42mm Steel", priceINR: 1595, image: "/budget/im3.webp", movement: "Quartz", caseSize: "42mm" },
  { id: "sonata-classic", brand: "Sonata", name: "Classic Leather", reference: "NRF33578/08 · 40mm Steel", priceINR: 1295, image: "/budget/im5.webp", movement: "Quartz", caseSize: "40mm" },
  { id: "casio-f91w", brand: "Casio", name: "F-91W Resin", reference: "F-91W-1Y · Resin", priceINR: 1399, image: "/budget/im12.webp", movement: "Quartz", caseSize: "36.8mm" },
  { id: "casio-mq25", brand: "Casio", name: "MQ-25 Analog", reference: "MQ-25D · 42mm Steel", priceINR: 1199, image: "/budget/image1.webp", movement: "Quartz", caseSize: "42mm" },
  { id: "timex-easy-reader", brand: "Timex", name: "Easy Reader", reference: "TWE04J137 · 32mm", priceINR: 1899, image: "/budget/image2.webp", movement: "Quartz", caseSize: "32mm" },
  { id: "fastrack-chrono", brand: "Fastrack", name: "Chrono Black", reference: "NR38024PB · 46mm", priceINR: 1799, image: "/budget/img4.webp", movement: "Quartz", caseSize: "46mm" },
  { id: "titan-rika", brand: "Titan", name: "Raga Small", reference: "NL2342 · 36mm Steel", priceINR: 1699, image: "/budget/img6.webp", movement: "Quartz", caseSize: "36mm" },
  { id: "seiko-5-snkk", brand: "Seiko", name: "5 Sports Mini", reference: "SNKK95 · 37mm", priceINR: 1499, image: "/budget/img7.webp", movement: "Cal. 7S36 Automatic", caseSize: "37mm" },
  { id: "citizen-ecodrive-bm", brand: "Citizen", name: "Eco-Drive Compact", reference: "BM8180 · 36mm", priceINR: 1999, image: "/budget/img8.webp", movement: "Eco-Drive Solar Quartz", caseSize: "36mm" },
  { id: "sonata-creta", brand: "Sonata", name: "Creta", reference: "NRF33579/01 · 44mm", priceINR: 1199, image: "/budget/img10.webp", movement: "Quartz", caseSize: "44mm" },
  { id: "hmt-pilot", brand: "HMT", name: "Pilot", reference: "1041/Q · 36mm", priceINR: 1299, image: "/budget/img11.webp", movement: "Quartz", caseSize: "36mm" },
  { id: "casio-a158wa", brand: "Casio", name: "A158WA Steel", reference: "A158WA · 36mm", priceINR: 1699, image: "/budget/img12.webp", movement: "Digital Quartz", caseSize: "36.8mm" },
  { id: "timex-ironman", brand: "Timex", name: "Ironman", reference: "T5M370 · Resin", priceINR: 1499, image: "/budget/img13.webp", movement: "Digital Quartz", caseSize: "42mm" },
  { id: "fastrack-revibe", brand: "Fastrack", name: "Revibe", reference: "NR38024PD · 44mm", priceINR: 1599, image: "/budget/img14.webp", movement: "Quartz", caseSize: "44mm" },
  { id: "sonata-ace", brand: "Sonata", name: "Ace", reference: "NRF33578/06 · 42mm", priceINR: 999, image: "/budget/img15.webp", movement: "Quartz", caseSize: "42mm" },
];
