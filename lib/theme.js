// Motorul de culoare al site-ului.
//
// Regula: structura, tipografia și ritmul sunt identice peste tot, dar
// FIECARE pagină primește propria nuanță — nicio culoare nu se repetă între
// produse, articole și pagini. În același timp, toate nuanțele stau în
// familia de brand a magazinului (orhidee → magenta → roz-auriu → crimson),
// ca site-ul să aibă varietate fără să arate ca un curcubeu.

import products from "@/content/products.json";
import posts from "@/content/posts.json";
import pages from "@/content/pages.json";

// Banda cromatică a brandului: 300° → 360°. Ținută intenționat departe de
// portocaliu, unde nuanțele ies maronii.
const BAND_START = 300;
const BAND_SPAN = 60;
const GOLDEN = 0.6180339887;

// Nuanța de brand a magazinului, luată din CSS-ul site-ului actual:
// butoanele și accentele folosesc #810541 (burgundy), iar suprafețele moi
// #F8D6D4 (blush). Cele două NU sunt pe aceeași nuanță: accentul e magenta
// închis (331°), iar suprafața moale e piersică (3°). De asta suprafețele
// se calculează pe o nuanță mai caldă decât accentul — altfel tot fondul
// ieșea magenta spălăcit. Prima pagină primește mereu nuanța de brand.
const BRAND_HUE = 331;

// Cheile rutelor „mari", care nu au slug propriu.
const ROUTES = ["home", "products", "blog", "page", "notFound"];

/**
 * Alocatorul de nuanțe.
 *
 * Banda se taie în exact atâtea sloturi câte pagini avem, deci fiecare
 * pagină iese cu o nuanță diferită prin construcție — fără hash, fără
 * coliziuni. Sloturile se împart printr-o permutare dată de șirul auriu,
 * ca două produse alăturate în listă să nu primească nuanțe alăturate.
 * La final, tot setul se rotește astfel încât prima pagină să cadă fix pe
 * culoarea de brand.
 *
 * Nuanțele depind de setul de pagini: dacă apar produse noi, banda se
 * reîmparte și culorile se deplasează ușor. E în regulă — rămân în aceeași
 * familie, iar prima pagină stă pe loc.
 */
const registry = (() => {
  const contentSlugs = [...new Set(
    [...products, ...posts, ...pages].map((x) => x?.slug).filter(Boolean)
  )].sort();

  const keys = [...ROUTES.map((r) => `route:${r}`), ...contentSlugs];
  const n = keys.length;

  // permutare stabilă: sortăm indicii după partea fracționară a șirului auriu
  const order = keys.map((_, i) => i).sort((a, b) => ((a * GOLDEN) % 1) - ((b * GOLDEN) % 1));

  const slotHue = (slot) => BAND_START + (slot / n) * BAND_SPAN;

  const slotOf = new Map();
  order.forEach((keyIndex, slot) => slotOf.set(keys[keyIndex], slot));

  // rotim tot setul ca „route:home" să nimerească exact culoarea de brand
  const shift = BRAND_HUE - slotHue(slotOf.get("route:home"));

  const map = new Map();
  for (const [key, slot] of slotOf) {
    const h = BAND_START + (((slotHue(slot) - BAND_START + shift) % BAND_SPAN) + BAND_SPAN) % BAND_SPAN;
    map.set(key, Math.round(h) % 360);
  }
  return map;
})();

// Nuanțele rutelor principale, calculate de același alocator.
export const HUES = Object.fromEntries(
  ROUTES.map((r) => [r, registry.get(`route:${r}`) ?? BRAND_HUE])
);

// Hash stabil, pentru conținut care nu a trecut prin import (preluat în
// direct din WordPress) și deci nu are slot alocat.
function hash(seed = "") {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function hueFromSeed(seed = "") {
  const known = registry.get(seed);
  if (known != null) return known;
  return Math.round((BAND_START + (((hash(seed) % 10007) * GOLDEN) % 1) * BAND_SPAN) % 360);
}

// Capătul dinspre crimson pare mai luminos decât orhideea la aceeași
// luminozitate — îl coborâm ușor, ca textul să aibă contrast egal pe alb.
function dim(h) {
  const d = h > 180 ? h - 360 : h; // -60 … 0 în interiorul benzii
  return Math.round(Math.min(1, Math.max(0, (d + 60) / 60)) * 4);
}

const hsl = (h, s, l, a) =>
  a == null ? `hsl(${h} ${s}% ${l}%)` : `hsl(${h} ${s}% ${l}% / ${a})`;

/**
 * Setul complet de variabile CSS pentru o pagină.
 * @param {number|string} seed nuanță (0-360) sau slug din care se calculează
 */
export function theme(seed) {
  const h = typeof seed === "number" ? ((seed % 360) + 360) % 360 : hueFromSeed(seed);
  const h2 = (h + 26) % 360;  // nuanța secundară, pentru degradeuri
  const h3 = (h + 334) % 360; // a treia, doar pentru aurele din fundal
  const hw = (h + 32) % 360;  // nuanța caldă a suprafețelor (piersică)
  const d = dim(h);
  const d2 = dim(h2);

  return {
    "--h": String(h),
    "--h2": String(h2),

    // Rampa de accent, calibrată pe brand:
    //   accent-strong ≈ #810541 (burgundy închis, pentru butoane și titluri)
    //   accent        = varianta vie, pentru legături și iconițe
    //   tint / soft / wash ≈ #F8D6D4 și mai deschise, pentru suprafețe
    "--accent": hsl(h, 66, 42 - d),
    "--accent-strong": hsl(h, 92, 26 - Math.round(d / 2)),
    "--accent-2": hsl(h2, 62, 54 - d2),
    // suprafețele moi merg pe nuanța caldă (piersică), nu pe magenta
    "--accent-tint": hsl(hw, 72, 90),
    "--accent-soft": hsl(hw, 74, 95),
    "--accent-wash": hsl(hw, 70, 98),
    "--accent-deep": hsl(h, 40, 12),
    "--accent-deep-2": hsl(h2, 34, 17),

    "--glow": hsl(h, 70, 42, 0.26),
    "--glow-soft": hsl(h, 70, 42, 0.12),
    "--ring": hsl(h, 70, 45, 0.28),

    // degradeul merge dinspre burgundy spre roz cald — nu două roz-uri
    "--grad": `linear-gradient(118deg, ${hsl(h, 82, 32 - Math.round(d / 2))}, ${hsl(h2, 64, 52 - d2)})`,
    "--grad-soft": `linear-gradient(140deg, ${hsl(h, 60, 97)}, ${hsl(h2, 58, 95)})`,
    "--grad-deep": `linear-gradient(150deg, ${hsl(h, 40, 11)}, ${hsl(h2, 34, 16)})`,
    "--aura-1": hsl(hw, 74, 74, 0.24),
    "--aura-2": hsl(h2, 70, 70, 0.16),
    "--aura-3": hsl(h3, 66, 72, 0.14),
  };
}

// Variabilele ca text CSS, pentru <style> randat pe server (fără „licărire"
// la încărcare, spre deosebire de setarea lor din JavaScript).
export function themeCss(seed, selector = ":root") {
  return `${selector}{${Object.entries(theme(seed))
    .map(([k, v]) => `${k}:${v}`)
    .join(";")}}`;
}
