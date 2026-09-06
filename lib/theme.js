// Motorul de culoare al site-ului.
//
// Regula: structura, tipografia și ritmul sunt identice peste tot, dar
// FIECARE pagină primește propria paletă. Nuanța se calculează determinist
// din adresa paginii (slug), așa că nu se repetă niciodată între produse,
// articole sau pagini — dar rămâne mereu în familia de brand a magazinului
// (magenta → roz-auriu → coral → chihlimbar). Așa avem varietate fără ca
// site-ul să arate ca un curcubeu.

// Banda cromatică a brandului: de la magenta (318°) la chihlimbar (36°).
const BAND_START = 318;
const BAND_SPAN = 78;
const GOLDEN = 0.6180339887; // împrăștie uniform valorile în interiorul benzii

// Nuanțe fixe pentru rutele principale.
export const HUES = {
  home: 345,      // roz-auriu — culoarea de brand
  products: 330,  // magenta cald
  blog: 6,        // coral
  page: 352,      // roz profund
  notFound: 24,   // chihlimbar
};

// Hash stabil dintr-un text (același slug → aceeași culoare, mereu).
function hash(seed = "") {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// Slug → nuanță din banda de brand, împrăștiată cu proporția de aur.
export function hueFromSeed(seed = "") {
  const frac = ((hash(seed) % 10007) * GOLDEN) % 1;
  return Math.round((BAND_START + frac * BAND_SPAN) % 360);
}

// Galbenurile și coralurile deschise par mult mai luminoase decât magenta la
// aceeași luminozitate — le coborâm ca textul să rămână lizibil pe alb.
function dim(h) {
  const d = h > 180 ? h - 360 : h; // -42 … 36 în interiorul benzii
  return d > -10 ? Math.round(Math.min(1, (d + 10) / 46) * 9) : 0;
}

const hsl = (h, s, l, a) =>
  a == null ? `hsl(${h} ${s}% ${l}%)` : `hsl(${h} ${s}% ${l}% / ${a})`;

/**
 * Setul complet de variabile CSS pentru o pagină.
 * @param {number|string} seed nuanță (0-360) sau slug din care se calculează
 */
export function theme(seed) {
  const h = typeof seed === "number" ? ((seed % 360) + 360) % 360 : hueFromSeed(seed);
  const h2 = (h + 26) % 360; // nuanța secundară, pentru degradeuri
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
