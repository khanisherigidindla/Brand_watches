/* Generates distinct premium vector SVG watch illustrations for the Atelier Aurelion
   catalogue. One image per product + collection banners. No external deps. */
const fs = require("fs");
const path = require("path");
const OUT = path.join(__dirname, "..", "public", "assets", "watches");
fs.mkdirSync(OUT, { recursive: true });

const METAL = {
  platinum: ["#eef1f6", "#d3dae4", "#93a0b2", "#e6ebf2"],
  steel: ["#e6eaf0", "#c8ced9", "#8f97a4", "#d9dee7"],
  rose: ["#f4cdab", "#e09f74", "#a86b47", "#efc3a3"],
  titanium: ["#bcc2cc", "#8b92a0", "#55606e", "#aeb6c2"],
  carbon: ["#3a3f47", "#262b33", "#0e1116", "#2e343d"],
  dlc: ["#242932", "#161b22", "#05070a", "#1c2129"],
  white: ["#f4f6f8", "#e6eaf0", "#b9c2d0", "#fbfcfd"]
};

const defs = [];
let _n = 0;
const uid = (p) => `${p}_${++_n}`;
const svg = (body, w = 900, h = 900) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
  `<defs>${defs.join("")}</defs>${body}</svg>`;

function radial(id, stops) {
  defs.push(`<radialGradient id="${id}" cx="50%" cy="42%" r="70%">` +
    stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("") + `</radialGradient>`);
}
function linear(id, x1, y1, x2, y2, stops) {
  defs.push(`<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">` +
    stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("") + `</linearGradient>`);
}

function stage(glow) {
  return `<rect width="900" height="900" fill="url(#bg${glow.id})"/>` +
    `<ellipse cx="450" cy="455" rx="360" ry="150" fill="url(#bg${glow.id}2)" opacity="0.9"/>` +
    `<rect width="900" height="900" fill="url(#sheen)"/>`;
}

function bracelet(col) {
  const [L, M, D] = col;
  const idL = uid("brL"), idD = uid("brD");
  linear(idL, 0, 0, 0, 1, [[0, L], [0.5, M], [1, L]]);
  linear(idD, 0, 0, 1, 0, [[0, D], [0.35, L], [0.7, M], [1, D]]);
  const cx = 450, w = 168;
  let rows = "";
  for (let i = 0; i < 6; i++) {
    for (const yTop of [92, 626]) {
      const y = yTop + i * 74;
      rows += `<rect x="${cx - w / 2 + 6}" y="${y}" width="${w - 12}" height="62" rx="26" fill="url(#${idL})" stroke="url(#${idD})" stroke-width="2"/>` +
        `<rect x="${cx - w / 2 + 6}" y="${y + 14}" width="${w - 12}" height="3" fill="#ffffff" opacity="0.28"/>` +
        `<rect x="${cx - w / 2 + 6}" y="${y + 42}" width="${w - 12}" height="3" fill="${D}" opacity="0.6"/>`;
    }
  }
  rows += `<rect x="${cx - 58}" y="820" width="116" height="46" rx="20" fill="url(#${idD})"/>`;
  return rows;
}

function strap(col) {
  const [L, D] = col;
  const idS = uid("st");
  linear(idS, 0, 0, 0, 1, [[0, L[0]], [0.5, D[0]], [1, L[0]]]);
  const cx = 450;
  let s = "";
  for (let i = 0; i < 5; i++) {
    const w0 = 150 - (i / 4) * 28;
    const y = 108 + i * 52;
    const yb = 600 + i * 52;
    for (const yy of [y, yb]) {
      s += `<rect x="${cx - w0 / 2}" y="${yy}" width="${w0}" height="46" rx="4" fill="url(#${idS})"/>` +
        `<ellipse cx="${cx}" cy="${yy + 23}" rx="${w0 / 2 - 8}" ry="15" fill="none" stroke="#000" stroke-width="1" opacity="0.15"/>`;
    }
  }
  return s;
}

function crown(col, cx, cy) {
  const [L, M, D] = col;
  const id = uid("cr");
  linear(id, 0, 0, 1, 0, [[0, D], [0.35, L], [0.7, M], [1, D]]);
  return `<rect x="${cx}" y="${cy - 11}" width="26" height="22" rx="5" fill="url(#${id})" stroke="${D}" stroke-width="1.5"/>` +
    `<rect x="${cx + 4}" y="${cy - 8}" width="8" height="16" fill="${L}" opacity="0.85"/>`;
}

function gemBezel(col, R, count, gem, gemR) {
  const [L, M, D] = col;
  const id = uid("gb");
  linear(id, 0, 0, 0, 1, [[0, L], [0.5, M], [1, D]]);
  let gems = "";
  const off = 1.05;
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const px = 450 + Math.cos(a) * R * off;
    const py = 455 - Math.sin(a) * R * off;
    gems += `<rect x="${px - gemR}" y="${py - gemR * 0.55}" width="${gemR * 2}" height="${gemR * 1.1}" rx="1" transform="rotate(${a * 180 / Math.PI} ${px} ${py})" fill="${gem}"/>`;
  }
  return `<circle cx="450" cy="455" r="${R}" fill="url(#${id})" stroke="${D}" stroke-width="2"/>` + gems;
}
function diamondBezel(col, R, count) {
  const [L, M, D] = col;
  const id = uid("db");
  linear(id, 0, 0, 0, 1, [[0, L], [0.5, M], [1, D]]);
  let gems = "";
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const off = 1.045;
    const px = 450 + Math.cos(a) * R * off;
    const py = 455 - Math.sin(a) * R * off;
    gems += `<circle cx="${px}" cy="${py}" r="4.2" fill="#f4f8ff" stroke="#b9c8e6" stroke-width="0.6"/>`;
  }
  return `<circle cx="450" cy="455" r="${R}" fill="url(#${id})" stroke="${D}" stroke-width="2"/>` + gems;
}
/*__PART2__*/function markers(Rin, col, opts = {}) {
  const len = opts.len || 18;
  const style = opts.style || "baton";
  let m = "";
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const cx = 450 + Math.cos(a) * Rin;
    const cy = 455 - Math.sin(a) * Rin;
    if (style === "dots") {
      m += `<circle cx="${cx}" cy="${cy}" r="${i % 3 === 0 ? 7 : 4}" fill="${col}"/>`;
    } else if (style === "roman") {
      const rn = ["XII", "I", "II", "III", "IIII", "V", "VI", "VII", "VIII", "IX", "X", "XI"][i];
      m += `<text x="${cx}" y="${cy + 7}" font-size="${i % 3 === 0 ? 26 : 19}" font-family="serif" fill="${col}" text-anchor="middle" transform="rotate(${a * 180 / Math.PI + 90} ${cx} ${cy})">${rn}</text>`;
    } else if (style === "arabic") {
      m += `<text x="${cx}" y="${cy + 7}" font-size="20" font-family="sans-serif" fill="${col}" text-anchor="middle" transform="rotate(${a * 180 / Math.PI + 90} ${cx} ${cy})">${i === 0 ? 12 : i}</text>`;
    } else {
      const c = Math.cos(a), s = Math.sin(a);
      m += `<line x1="${cx - c * len}" y1="${cy + s * len}" x2="${cx + c * 3}" y2="${cy - s * 3}" stroke="${col}" stroke-width="${i % 3 === 0 ? 7 : 4.5}" stroke-linecap="round"/>`;
    }
  }
  return m;
}

function hands(sweep, opts = {}) {
  const h = opts.hour || "#f6f7f8", minn = opts.minuted || "#f6f7f8";
  const ha = opts.hourAngle || 30, ma = opts.minAngle || 150;
  const hr = (a, len, w, col) => {
    const ang = (a - 90) * Math.PI / 180;
    return `<line x1="450" y1="455" x2="${450 + Math.cos(ang) * len}" y2="${455 - Math.sin(ang) * len}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`;
  };
  return hr(ha, 100, 7, h) + hr(ma, 150, 4.5, minn) +
    hr(sweep, 168, 1.6, "#ffffff") +
    `<circle cx="450" cy="455" r="9" fill="${opts.center || '#ffffff'}"/>` +
    `<circle cx="450" cy="455" r="4" fill="#000" opacity="0.55"/>`;
}
function gmtHand(col) {
  const ang = (-40 - 90) * Math.PI / 180;
  return `<line x1="450" y1="455" x2="${450 + Math.cos(ang) * 132}" y2="${455 - Math.sin(ang) * 132}" stroke="${col}" stroke-width="4" stroke-linecap="round"/>`;
}

function subdial(cx, cy, r, col, opts = {}) {
  const id = uid("sd");
  radial(id, [[0, opts.fill || "#f6f1e5"], [1, opts.dark || "#cfc59a"]]);
  let ticks = "";
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    ticks += `<line x1="${cx + Math.cos(a) * (r - 6)}" y1="${cy - Math.sin(a) * (r - 6)}" x2="${cx + Math.cos(a) * (r - 2)}" y2="${cy - Math.sin(a) * (r - 2)}" stroke="#fff" stroke-width="1.6"/>`;
  }
  const sm = (-70 - 90) * Math.PI / 180;
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${id})" stroke="${col}" stroke-width="2.5"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r - 3}" fill="none" stroke="${col}" stroke-width="1" opacity="0.6"/>` + ticks +
    `<line x1="${cx}" y1="${cy}" x2="${cx + Math.cos(sm) * (r - 8)}" y2="${cy - Math.sin(sm) * (r - 8)}" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>`;
}

function tourbillon(cx, cy) {
  const id = uid("tb");
  radial(id, [[0, "#e8e4d8"], [0.6, "#c8b98a"], [1, "#8a7c52"]]);
  let cage = "";
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    cage += `<line x1="${cx}" y1="${cy}" x2="${cx + Math.cos(a) * 34}" y2="${cy - Math.sin(a) * 34}" stroke="#b0903f" stroke-width="1.4"/>`;
  }
  return `<circle cx="${cx}" cy="${cy}" r="40" fill="url(#${id})" stroke="#9a8651" stroke-width="3"/>` +
    `<circle cx="${cx}" cy="${cy}" r="36" fill="none" stroke="#d8c795" stroke-width="1.4"/>` + cage +
    `<circle cx="${cx}" cy="${cy}" r="5" fill="#2a2320"/>`;
}

function skeletonBack(metal) {
  const [L, M, D] = metal;
  const idr = uid("skR");
  radial(idr, [[0, "#c9cfd9"], [1, "#7b8696"]]);
  let gears = "";
  const centers = [[372, 398], [538, 500], [456, 560], [360, 500], [545, 396]];
  centers.forEach(([cx, cy], k) => {
    const r = 26 + (k % 3) * 6;
    let teeth = "";
    for (let i = 0; i < 10; i++) {
      const a = i * Math.PI * 2 / 10;
      teeth += `<circle cx="${cx + Math.cos(a) * r}" cy="${cy - Math.sin(a) * r}" r="4.5" fill="${D}"/>`;
    }
    gears += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${M}" stroke-width="2.5"/>` + teeth +
      `<circle cx="${cx}" cy="${cy}" r="${Math.max(3, r * 0.24)}" fill="${D}"/>`;
  });
  let bridge = "";
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    bridge += `<line x1="450" y1="455" x2="${450 + Math.cos(a) * 150}" y2="${455 - Math.sin(a) * 150}" stroke="${D}" stroke-width="3" opacity="0.5"/>`;
  }
  return `<circle cx="450" cy="455" r="150" fill="url(#${idr})" opacity="0.5"/>` + bridge + gears;
}

function dialBase(fill) {
  const id = uid("dl");
  radial(id, [[0, fill[0]], [0.7, fill[1]], [1, fill[2]]]);
  return `<circle cx="450" cy="455" r="158" fill="url(#${id})" stroke="#0a0c10" stroke-width="6"/>` +
    `<circle cx="450" cy="455" r="158" fill="none" stroke="#fff" stroke-width="1" opacity="0.12"/>`;
}
/*__PART3__*/function drawWatch(cfg) {
  defs.length = 0; _n = 0;
  const metal = METAL[cfg.metal];
  const [LM, MM, DM] = metal;
  const cx = 450, cy = 455, R = 186;
  radial("bg" + 1, [[0, "#0d1117"], [0.6, "#080b10"], [1, "#04060a"]]);
  radial("bg" + 1 + "2", [[0, cfg.glow || "#1a2b3c"], [1, "#000000"]]);
  linear("sheen", 0, 0, 1, 0.6, [[0, "#00000000"], [0.5, "#ffffff"], [1, "#00000000"]]);
  let s = stage({ id: 1 });

  if (cfg.bracelet) s += bracelet(metal);
  else s += strap(cfg.leather || [["#3a2c20"], ["#1a1109"]]);

  const idGl = uid("gl");
  linear(idGl, 0, 0, 1, 1, [[0, "#ffffff"], [0.5, "#00000000"], [1, "#ffffff"]]);

  const idCase = uid("case");
  linear(idCase, 0, 0, 0, 1, [[0, LM], [0.5, MM], [1, DM]]);
  s += `<circle cx="${cx}" cy="${cy}" r="${R + 8}" fill="url(#${idCase})" stroke="${DM}" stroke-width="2"/>`;

  if (cfg.gemBezel === "sapphire") s += gemBezel(metal, R, 34, "#2456c8", 8);
  else if (cfg.gemBezel === "ruby") s += gemBezel(metal, R, 32, "#d81e3f", 8);
  else if (cfg.gemBezel === "emerald") s += gemBezel(metal, R, 32, "#1f8a4c", 8);
  else if (cfg.gemBezel === "diamond") s += diamondBezel(METAL.white, R, 40);
  else {
    const idBz = uid("bz");
    linear(idBz, 0, 0, 1, 0, [[0, DM], [0.4, LM], [1, DM]]);
    s += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#${idBz})" stroke="${DM}" stroke-width="2"/>`;
  }

  s += dialBase(cfg.dialFill);
  if (cfg.skeleton) s += skeletonBack(metal);
  if (cfg.tourbillon) s += tourbillon(506, 560);
  if (cfg.subdials) {
    s += subdial(506, 344, 34, MM, { fill: cfg.subFill, dark: cfg.subDark });
    s += subdial(450, 588, 34, MM, { fill: cfg.subFill, dark: cfg.subDark });
    s += subdial(394, 344, 34, MM, { fill: cfg.subFill, dark: cfg.subDark });
  }
  if (cfg.gmtRing) {
    s += `<circle cx="450" cy="455" r="${cfg.gmtRing}" fill="none" stroke="#e6e8ec" stroke-width="1.6"/>`;
  }
  if (cfg.moonphase) {
    s += `<circle cx="450" cy="592" r="30" fill="#0d0f14" stroke="#c9cfd9" stroke-width="2.5"/>` +
      `<circle cx="450" cy="592" r="13" fill="#ece7da"/>`;
  }

  if (cfg.markers !== "none") s += markers(118, cfg.markerColor || "#d8dde6", { style: cfg.markerStyle || "baton", len: cfg.markerLen });

  if (cfg.gmt) s += gmtHand(cfg.accent || "#e2572a");
  s += hands(cfg.sweepAngle || 220, { hour: cfg.hands || "#f4f5f7", minuted: cfg.hands || "#f4f5f7", center: "#d8dee9" });

  s += `<path d="M${cx - 92} ${cy - 128} q30 -16 60 0 l0 250 q-30 16 -60 ${cy + 122} z" fill="url(#${idGl})" opacity="${cfg.sheen || 0.16}"/>`;
  s += crown(cfg.crownMetal || metal, 636, 398);
  s += `<circle cx="${cx}" cy="${cy}" r="${R + 14}" fill="none" stroke="#ffffff" stroke-width="1" opacity="0.14"/>`;
  return svg(s);
}
/*__PART4__*//* ---------- Panels ---------- */
const DIALS = {
  silver: ["#f7f6f2", "#e7e4da", "#cfc9b6"],
  white: ["#fbfaf6", "#efecdf", "#d9d2bb"],
  ivory: ["#f4ecd9", "#e6d9ba", "#cdb98c"],
  blue: ["#0e2b5e", "#0a1f44", "#05132b"],
  navy: ["#102038", "#0a1526", "#040a16"],
  black: ["#101318", "#0a0d12", "#04060a"],
  grey: ["#232a35", "#161c25", "#0a0e14"],
  green: ["#123a2c", "#0c281f", "#051710"],
  burgundy: ["#3a1622", "#280e17", "#15070c"],
  gold:: ["#f7e6c4", "#ecca96", "#d6a95c"],
  rose:: ["#f3dcd0", "#e7c2ae", "#d29a7c"],
  copper:: ["#e8b98a", "#d4955c", "#ab6a35"],
  teal:["#0e3a3c", "#0a2829", "#051719"],
  wine:["#4a1520", "#33101a", "#1c080e"],
  slate:["#1c2633", "#121a25", "#080d15"]
};
const METALID = ["steel", "titanium", "dlc", "carbon", "rose", "platinum"];
const BEZELOPTS = [undefined, "sapphire", "ruby", "emerald", "diamond"];
const FONT = ["baton", "roman", "arabic", "dots", "baton", "roman"];

// colored metal tints for variety (apply as gem/accents）
const STATUS = ["gold", "silver", "blue", "green", "white", "black"];

let seq = 0;
function makeWatch(panel, k, base) {
  const variety = (panel === 0 ? 20 : 16);
  const metal = base.metal || METALID[k % METALID.length];
  const colorKey = base.colorKey || Object.keys(DIALS)[k % Object.keys(DIALS).length];
  const dial = DIALS[colorKey];
  const comp = base.complication;
  seq++;
  return {
    slug: base.slug || `panel-${panel + 1}-${k + 1}`,
    panel,
    metal,
    dial,
    colorKey,
    complication: comp,
    bracelet: base.bracelet,
    markers: comp === "chronograph" ? "baton" : (FONT[k % FONT.length]),
    gemBezel: base.gemBezel,
    sweep: base.sweep || ((k * 97) % 360) ,
    accent: base.accent,
    glow: base.glow,
    subdials: comp === "chronograph",
    tourbillon: comp === "tourbillon",
    skeleton: comp === "skeleton",
    moon: comp === "moon",
    gmt: comp === "gmt",
    handsColor: comp === "gmt" ? "#f0f3f6" : undefined
  };
}

// Panel 1: Affordable & Premium (20)- clean steel/titanium/carbon, sport + dress
const P1_BASE = [];
for (let k = 0; k < 20; k++) {
  const comps = ["chronograph", "dress", "sport", "dress", "chronograph"];
  const comp = comps[k % comps.length];
  const metal = ["steel", "steel", "titanium", "steel", "dlc", "carbon"][k % 6];
  const bracelet = comp === "sport";
  P1_BASE.push(makeWatch(0, k, {
    metal, bracelet, complication: comp,
    colorKey: ["white", "silver", "blue", "ivory", "black", "grey", "green", "navy"][k % 8],
    glow: "#2a3b4c"
  }));
}
// Panel 2: High-Luxury Executive (20)- gold/rose/platinum, skeleton, divers
const P2_BASE = [];
for (let k = 0; k < 20; k++) {
  const comps = ["skeleton", "rose", "skeleton", "gmt", "dress", "skeleton"];
  const comp = comps[k % comps.length];
  const metal = ["rose", "platinum", "rose", "titanium", "gold", "platinum"][k % 6];
  const bracelet = ![ "skeleton", "rose", "skeleton" ].includes(comp);
  P2_BASE.push(makeWatch(1, k, {
    metal, bracelet, complication: comp,
    colorKey: ["ivory", "burnt", "navy", "ruby", "silver", "blue"][k % 6],
    glow: "#3a2f1c"
  }));
}
const comps2 = { k: 0 };
// Panel 3: Billionaire & Gem-Set (20)- tourbillons, gem bezels, gold
const P3_BASE = [];
for (let k = 0; k < 20; k++) {
  const comp = ["tourbillon", "moon", "tourbillon", "moon"][k % 4];
  const gem = ["sapphire", "ruby", "emerald", "diamond", "sapphire"][k % 5];
  const metal = ["platinum", "platinum", "rose", "platinum", "platinum"][k % 5];
  P3_BASE.push(makeWatch(2, k, {
    metal, bracelet: true, complication: comp, gemBezel: gem,
    colorKey: ["navy", "black", "burgundy", "slate", "royal"][k % 5],
    glow: "#3a2f4c"
  }));
}

const ALL = [...P1_BASE, ...P2_BASE, ...P3_BASE];
const PANELS = [
  { name: "panel1", label: "Affordable & Premium", file: "panel1" },
  { name: "panel2", label: "High-Luxury Executive", file: "panel2" },
  { name: "panel3", label: "Billionaire & Gem-Set", file: "panel3" }
];

for (const w of ALL) {
  const file = path.join(OUT, `w-${w.slug}.svg`);
Â  const cfg = {
    metal: w.metal,
    bracelet: w.bracelet,
    leather: w.metal === "rose" ? [["#4a3322"], ["#26190c"]] : undefined,
    dialFill: w.dial,
    markers: w.markers,
    markerColor: ["silver", "white", "ivory", "gold"].includes(w.colorKey) ? "#6b6250" : "#d8dde6",
    hands: ["silver", "white", "ivory"].includes(w.colorKey) ? "#3a352b" : "#f0f3f6",
    subdials: w.subdials,
    subFill: w.colorKey === "blue" ? "#dce3eb" : "#efead8",
    subDark: w.colorKey === "blue" ? "#9aa6b6" : "#c7b077",
    tourbillon: w.tourbillon,
    skeleton: w.skeleton,
    moonphase: w.moon,
    gmt: w.gmt,
    gmtRing: w.gmt ? 138 : undefined,
    gemBezel: w.gemBezel,
    sweepAngle: w.sweep,
    sheen: 0.2,
    glow: w.glow,
    crownMetal: METAL[["steel", "titanium", "dlc", "carbon"].includes(w.metal) ? w.metal : "rose",
    accent: w.accent
  };
  if (w.gmt) cfg.accent = "#e2572a";
  fs.writeFileSync(path.join(OUT, `w-${w.slug}.svg`), drawWatch(cfg);
  console.log("wrote w-" + w.slug);
}
console.log("TOTAL=" + ALL.length);