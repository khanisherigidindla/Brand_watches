export interface RealWatch {
  id: string;
  brand: string;
  name: string;
  reference: string;
  priceINR: number;
  image: string;
  movement: string;
  caseSize: string;
  caseMaterial?: string;
  caseThickness?: string;
  dialColor?: string;
  strapMaterial?: string;
  waterResistance?: string;
  powerReserve?: string;
  frequency?: string;
  jewels?: number;
  description?: string;
  features?: string[];
  craftsmanshipNotes?: string[];
  limitedEdition?: boolean;
  stockQuantity?: number;
}

export const formatINR = (n: number) => "₹" + n.toLocaleString("en-IN");

export const WATCH_FRAME_FILES: string[] = Array.from(
  { length: 50 },
  (_, i) => `/watch-frames/ezgif-frame-${String(i + 1).padStart(3, "0")}.jpg`,
);

export const REAL_WATCHES: RealWatch[] = [
  { id: "rolex-submariner-date", brand: "Rolex", name: "Submariner Date", reference: "126610LN · 41mm Oystersteel", priceINR: 1450000, image: "/limited-editions/rolex1.webp", movement: "Cal. 3235 Automatic · 70h", caseSize: "41mm" },
  { id: "rolex-daytona-steel", brand: "Rolex", name: "Cosmograph Daytona", reference: "116500LN · Oystersteel", priceINR: 3450000, image: "/limited-editions/images1.jpeg", movement: "Cal. 4131 Chronograph", caseSize: "40mm" },
  { id: "omega-speedmaster-moon", brand: "Omega", name: "Speedmaster Moonwatch", reference: "310.30.42.50.01.001", priceINR: 735000, image: "/limited-editions/images2.jpeg", movement: "Cal. 3861 Manual", caseSize: "42mm" },
  { id: "omega-seamaster-diver", brand: "Omega", name: "Seamaster Diver 300M", reference: "210.30.42.20.03.001", priceINR: 625000, image: "/limited-editions/images3.jpeg", movement: "Cal. 8800 Co-Axial", caseSize: "42mm" },
  { id: "patek-nautilus", brand: "Patek Philippe", name: "Nautilus", reference: "5711/1A · Blue Graded", priceINR: 28500000, image: "/limited-editions/images4.jpeg", movement: "Cal. 26-330 S C", caseSize: "40mm" },
  { id: "ap-royal-oak-jumbo", brand: "Audemars Piguet", name: "Royal Oak Jumbo", reference: "16202ST · Bleu Nuit", priceINR: 2980000, image: "/limited-editions/images5.jpeg", movement: "Cal. 7121 · 55h", caseSize: "39mm" },
  { id: "cartier-santos-large", brand: "Cartier", name: "Santos Large", reference: "WSSA0029 · Steel ADLC", priceINR: 815000, image: "/limited-editions/images6.avif", movement: "Cal. 1847 MC", caseSize: "39.8mm" },
  { id: "jlc-reverso-classic", brand: "Jaeger-LeCoultre", name: "Reverso Classic", reference: "Q3858520 · Small Seconds", priceINR: 1120000, image: "/limited-editions/images7.webp", movement: "Cal. 822 Manual", caseSize: "45.6mm" },
  { id: "iwc-portugieser-chrono", brand: "IWC", name: "Portugieser Chrono", reference: "IW3716 · Silver Dial", priceINR: 895000, image: "/limited-editions/images8.webp", movement: "Cal. 69355", caseSize: "41mm" },
  { id: "tudor-black-bay-58", brand: "Tudor", name: "Black Bay 58", reference: "M79030N · Navy Blue", priceINR: 385000, image: "/limited-editions/images9.webp", movement: "Cal. MT5402 · 70h", caseSize: "39mm" },
  { id: "grand-seiko-snowflake", brand: "Grand Seiko", name: "Heritage Snowflake", reference: "SBGA211 · Titanium", priceINR: 665000, image: "/limited-editions/images10.webp", movement: "9R65 Spring Drive", caseSize: "41mm" },
  { id: "tag-carrera-chrono", brand: "TAG Heuer", name: "Carrera Chronograph", reference: "CBN2A1A · Blue Sunray", priceINR: 485000, image: "/limited-editions/images11.webp", movement: "Heuer 02 · 80h", caseSize: "42mm" },
  { id: "breitling-navitimer", brand: "Breitling", name: "Navitimer B01", reference: "AB0138 · 43mm Steel", priceINR: 925000, image: "/limited-editions/images12.webp", movement: "Cal. B01 · 70h", caseSize: "43mm" },
  { id: "panerai-luminor-marina", brand: "Panerai", name: "Luminor Marina", reference: "PAM01312 · 44mm", priceINR: 895000, image: "/limited-editions/images13.webp", movement: "Cal. P.9010 · 72h", caseSize: "44mm" },
  { id: "vacheron-overseas", brand: "Vacheron Constantin", name: "Overseas Automatic", reference: "4500V · Blue Lacquer", priceINR: 2650000, image: "/limited-editions/pic1.webp", movement: "Cal. 5100 · 60h", caseSize: "41mm" },
  { id: "lange-1-moonphase", brand: "A. Lange and Sohne", name: "Lange 1 Moon Phase", reference: "192.032 · Pink Gold", priceINR: 4200000, image: "/limited-editions/pic2.webp", movement: "Cal. L121.3 Manual", caseSize: "38.5mm" },
  { id: "pp-aquanaut", brand: "Patek Philippe", name: "Aquanaut", reference: "5167A · Black Embossed", priceINR: 2350000, image: "/limited-editions/pic3.webp", movement: "Cal. 26-330 S C", caseSize: "40mm" },
  { id: "rolex-gmt-pepsi", brand: "Rolex", name: "GMT-Master II Pepsi", reference: "126710BLRO · Steel", priceINR: 1980000, image: "/limited-editions/pic4.webp", movement: "Cal. 3285 GMT", caseSize: "40mm" },
  { id: "omega-planet-ocean", brand: "Omega", name: "Planet Ocean 600M", reference: "215.30.44.21.03.001", priceINR: 685000, image: "/limited-editions/pic5.jpeg", movement: "Cal. 8900 Master", caseSize: "43.5mm" },
  { id: "cartier-tank-louis", brand: "Cartier", name: "Tank Louis Cartier", reference: "WGTA0011 · Pink Gold", priceINR: 1350000, image: "/limited-editions/pic6.webp", movement: "Cal. 8971 MC", caseSize: "33.7mm" },
  { id: "jlc-master-moon", brand: "Jaeger-LeCoultre", name: "Master Ultra Thin Moon", reference: "Q1368470 · Steel", priceINR: 1250000, image: "/limited-editions/pic7.webp", movement: "Cal. 925 Moonphase", caseSize: "39mm" },
  { id: "zenith-chronomaster", brand: "Zenith", name: "Chronomaster Original", reference: "03.3200.3600 Tri-Colour", priceINR: 945000, image: "/limited-editions/pic8.jpeg", movement: "El Primero 3600", caseSize: "38mm" },
  { id: "vc-traditionnelle", brand: "Vacheron Constantin", name: "Traditionnelle", reference: "82172 · Pink Gold", priceINR: 3100000, image: "/limited-editions/pic9.jpeg", movement: "Cal. 4400 AS Manual", caseSize: "38mm" },
  { id: "rolex-datejust-41", brand: "Rolex", name: "Datejust 41", reference: "126334 Fluted Jubilee", priceINR: 1150000, image: "/limited-editions/pic10.jpeg", movement: "Cal. 3235 · 70h", caseSize: "41mm" },
  { id: "omega-aqua-terra", brand: "Omega", name: "Seamaster Aqua Terra", reference: "220.10.41.21.03.004", priceINR: 635000, image: "/limited-editions/pic11.jpeg", movement: "Cal. 8900 Master", caseSize: "41mm" },
  { id: "tudor-pelagos-39", brand: "Tudor", name: "Pelagos 39", reference: "M25407N · Titanium", priceINR: 445000, image: "/limited-editions/pic12.jpeg", movement: "Cal. MT5400 · 70h", caseSize: "39mm" },
  { id: "longines-master-moon", brand: "Longines", name: "Master Moonphase", reference: "L2.919.4 · Steel", priceINR: 235000, image: "/limited-editions/pic13.jpeg", movement: "Cal. L899 Moonphase", caseSize: "42mm" },
  { id: "tissot-prx-80", brand: "Tissot", name: "PRX Powermatic 80", reference: "T137.407 · Ice Blue", priceINR: 82500, image: "/limited-editions/pic14.jpeg", movement: "Powermatic 80 · 80h", caseSize: "40mm" },
  { id: "rado-captain-cook", brand: "Rado", name: "Captain Cook Automatic", reference: "R32138152 · Bronze", priceINR: 198000, image: "/limited-editions/pic15.jpeg", movement: "Cal. C07 · 80h", caseSize: "42mm" },
  { id: "seiko-alpinist", brand: "Seiko", name: "Prospex Alpinist", reference: "SPB121J1 · Green", priceINR: 72000, image: "/limited-editions/pic16.jpeg", movement: "Cal. 6R35 · 70h", caseSize: "39.5mm" },
  { id: "hamilton-murph-38", brand: "Hamilton", name: "Khaki Field Murph", reference: "H70405730 · 38mm", priceINR: 92000, image: "/limited-editions/pic17.jpeg", movement: "Cal. H-10 · 80h", caseSize: "38mm" },
  { id: "fc-slimline-moon", brand: "Frederique Constant", name: "Slimline Moonphase", reference: "FC-705V4S4 · Steel", priceINR: 185000, image: "/limited-editions/pic18.jpeg", movement: "Cal. FC-705 Moonphase", caseSize: "42mm" },
  { id: "oris-big-crown", brand: "Oris", name: "Big Crown Pointer Date", reference: "01 754 7741 · Bronze", priceINR: 215000, image: "/limited-editions/pic19.jpeg", movement: "Cal. 754 Pointer Date", caseSize: "40mm" },
  { id: "cartier-ballon-bleu", brand: "Cartier", name: "Ballon Bleu de Cartier", reference: "WSBB0021 · 42mm Steel", priceINR: 625000, image: "/limited-editions/pic20.jpeg", movement: "Cal. 1847 MC Automatic", caseSize: "42mm" },
  { id: "omega-constellation", brand: "Omega", name: "Constellation Co-Axial", reference: "131.33.41.21.03.001 · 41mm", priceINR: 695000, image: "/limited-editions/pic21.jpeg", movement: "Cal. 8901 Master Chronometer", caseSize: "41mm" },
  { id: "rolex-explorer-36", brand: "Rolex", name: "Explorer 36", reference: "124270 · Oystersteel", priceINR: 785000, image: "/limited-editions/pic22.jpeg", movement: "Cal. 3230 · 70h", caseSize: "36mm" },
  { id: "tudor-royal-41", brand: "Tudor", name: "Royal Day-Date", reference: "M28600 · 41mm Steel", priceINR: 265000, image: "/limited-editions/pic23.jpeg", movement: "Cal. T603 Automatic", caseSize: "41mm" },
];
