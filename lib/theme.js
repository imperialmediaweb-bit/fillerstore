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

// Nuanța de brand a magazinului. Prima pagină o primește mereu pe aceasta,
// iar restul benzii se împarte în jurul ei.
const BRAND_HUE = 345;

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
  const d = dim(h);
  const d2 = dim(h2);

  return {
    "--h": String(h),
    "--h2": String(h2),

    "--accent": hsl(h, 56, 47 - d),
    "--accent-strong": hsl(h, 60, 34 - d),
    "--accent-2": hsl(h2, 62, 52 - d2),
    "--accent-tint": hsl(h, 52, 87),
    "--accent-soft": hsl(h, 58, 96),
    "--accent-wash": hsl(h, 46, 98),
    "--accent-deep": hsl(h, 30, 10),
    "--accent-deep-2": hsl(h2, 28, 15),

    "--glow": hsl(h, 60, 50, 0.28),
    "--glow-soft": hsl(h, 60, 50, 0.13),
    "--ring": hsl(h, 60, 50, 0.32),

    "--grad": `linear-gradient(115deg, ${hsl(h, 62, 50 - d)}, ${hsl(h2, 68, 55 - d2)})`,
    "--grad-soft": `linear-gradient(140deg, ${hsl(h, 66, 97)}, ${hsl(h2, 66, 96)})`,
    "--grad-deep": `linear-gradient(150deg, ${hsl(h, 30, 9)}, ${hsl(h2, 28, 14)})`,
    "--aura-1": hsl(h, 74, 64, 0.3),
    "--aura-2": hsl(h2, 78, 62, 0.24),
    "--aura-3": hsl(h3, 70, 66, 0.18),
  };
}

// Variabilele ca text CSS, pentru <style> randat pe server (fără „licărire"
// la încărcare, spre deosebire de setarea lor din JavaScript).
export function themeCss(seed, selector = ":root") {
  return `${selector}{${Object.entries(theme(seed))
    .map(([k, v]) => `${k}:${v}`)
    .join(";")}}`;
}
