/* Point each legacy WATCH_PRODUCTS image[0] to a distinct generated SVG (no repeats). */
const fs = require("fs");
const path = require("path");
const file = path.join(__dirname, "..", "lib", "data", "seedProducts.ts");
let s = fs.readFileSync(file, "utf8");

const MAP = [
  ["aur-skel-sapphire-01", "/assets/watches/w-pan3-01.svg"],
  ["aur-imp-chrono-02", "/assets/watches/w-pan2-06.svg"],
  ["aur-celestial-grand-03", "/assets/watches/w-pan3-08.svg"],
  ["aur-sov-carbon-04", "/assets/watches/w-pan1-18.svg"],
  ["aur-her-classic-05", "/assets/watches/w-pan1-01.svg"],
  ["aur-chrono-sport-06", "/assets/watches/w-pan1-11.svg"],
  ["aur-imp-gmt-07", "/assets/watches/w-pan2-12.svg"],
  ["aur-roy-tourbillon-08", "/assets/watches/w-pan2-04.svg"],
  ["aur-ecl-perp-09", "/assets/watches/w-pan2-16.svg"],
  ["aur-solstice-baguette-10", "/assets/watches/w-pan3-11.svg"],
  ["aur-furtif-black-11", "/assets/watches/w-pan2-09.svg"],
  ["aur-atel-skel-12", "/assets/watches/w-pan2-01.svg"]
];

let changed = 0;
for (const [id, img] of MAP) {
  // find the product block by its id line, then its images: ["OLD"] within that segment
  const idIdx = s.indexOf(`id: \"${id}\"`);
  if (idIdx < 0) continue;  const nextId = s.indexOf(`id: \"aur-`, idIdx + 10);
  const segEnd = nextId > idIdx ? nextId : s.indexOf("export const MAISON_COLLECTIONS");
  const seg = s.slice(idIdx, segEnd);
  const imgMatch = seg.match(/(images: \[)([^\]]*)(\])/);
  if (imgMatch) {
    s = s.slice(0, idIdx + imgMatch.index) + imgMatch[1] + `\"${img}\"` + imgMatch[3] + s.slice(idIdx + imgMatch.index + imgMatch[0].length);
    changed++;
  }
}
fs.writeFileSync(file, s, "utf8");
console.log("Patched images for", changed, "products");