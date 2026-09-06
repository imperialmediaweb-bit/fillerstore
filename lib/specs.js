// Specificațiile produsului, deduse din numele lui.
//
// Numele din WooCommerce conțin deja tot ce contează („Revolax Deep
// Lidocaină (1x 1.1ml)"), așa că nu inventăm nimic: extragem doar ce scrie
// acolo. Dacă un lucru nu apare în nume, nu îl afișăm — mai bine lipsă decât
// greșit, mai ales la dispozitive medicale.

const BRANDS = ["Revolax", "Restylane", "Profhilo", "Stylage", "Fillmed", "Juvederm", "Teosyal"];

// Gama din interiorul brandului (Deep, Fine, Sub-Q, Lyft...).
const LINES = [
  { re: /\bsub[-\s]?q\b/i, label: "Sub-Q" },
  { re: /\bdeep\b/i, label: "Deep" },
  { re: /\bfine\b/i, label: "Fine" },
  { re: /\bdefyne\b/i, label: "Defyne" },
  { re: /\bvolyme\b/i, label: "Volyme" },
  { re: /\blyft\b/i, label: "Lyft" },
  { re: /\beyelight\b/i, label: "Eyelight" },
  { re: /\bh\s*\+\s*l\b/i, label: "H+L" },
];

// Zona de aplicare uzuală, după gama identificată.
const AREAS = {
  "Sub-Q": "Pomeți, bărbie, linie mandibulară",
  Deep: "Pliuri nazolabiale, linii de marionetă, buze",
  Fine: "Riduri fine, linii periorale, contur buze",
  Defyne: "Pliuri profunde, bărbie",
  Volyme: "Etajul mijlociu al feței",
  Lyft: "Pomeți, contur, dosul mâinilor",
  Eyelight: "Zona infraorbitală",
  "H+L": "Față, gât, dosul mâinilor",
};

export function specsFor(product) {
  if (!product?.name) return [];
  const name = product.name;
  const specs = [];

  const brand = BRANDS.find((b) => new RegExp(`\\b${b}\\b`, "i").test(name));
  if (brand) specs.push({ label: "Brand", value: brand });

  const line = LINES.find((l) => l.re.test(name));
  if (line) specs.push({ label: "Gamă", value: line.label });

  // volumul: „1.1ml", „0.5 ml", „2ML"
  const volume = name.match(/(\d+(?:[.,]\d+)?)\s*ml\b/i);
  if (volume) specs.push({ label: "Volum", value: `${volume[1].replace(",", ".")} ml` });

  // numărul de seringi: „(1x 1.1ml)", „(1 x 1ml)"
  const count = name.match(/\(\s*(\d+)\s*x/i);
  if (count) specs.push({ label: "Conținut", value: `${count[1]} seringă preumplută` });

  if (/lidoca/i.test(name)) specs.push({ label: "Anestezic", value: "Cu lidocaină" });

  if (line && AREAS[line.label]) specs.push({ label: "Zone tratate", value: AREAS[line.label] });

  if (product.categories?.[0]) {
    specs.push({ label: "Categorie", value: product.categories[0].name || product.categories[0] });
  }
  if (product.sku) specs.push({ label: "Cod produs", value: product.sku });

  specs.push({ label: "Destinat", value: "Uz profesional (medici și personal medical)" });

  return specs;
}

/** Brandul, folosit și în datele structurate. */
export function brandOf(product) {
  if (!product?.name) return null;
  return BRANDS.find((b) => new RegExp(`\\b${b}\\b`, "i").test(product.name)) || null;
}
