// Sliderele preluate din prima pagină WordPress (content/slides.json,
// completat de scripts/import-slides.mjs).
//
// Logica de plasare, ca să nu fie nevoie de configurare manuală:
//   • primul slider  → hero-ul de pe prima pagină (pozele mari, cu text)
//   • celelalte      → galerii pe toată lățimea, sub produse
// Dacă nu există niciun slider importat, hero-ul cade pe pozele produselor.

import slidersRaw from "@/content/slides.json";
import { img, srcSet } from "@/lib/img";

const sliders = (Array.isArray(slidersRaw) ? slidersRaw : []).filter(
  (s) => Array.isArray(s?.slides) && s.slides.length >= 2
);

export const hasSliders = () => sliders.length > 0;

// Pregătește pozele pentru componenta Slider: adrese de pe CDN + srcSet.
function prepare(slides, { w, h }) {
  return slides
    .filter((s) => s?.src)
    .map((s) => ({
      raw: s.src,
      src: img(s.src, { w, h }),
      srcSet: srcSet(s.src, [700, 1000, 1400, 1900]),
      thumb: img(s.src, { w: 160, h: 160, fit: "contain" }),
      alt: s.alt || s.title || "",
      kicker: s.kicker || undefined,
      title: s.title || undefined,
      subtitle: s.subtitle || undefined,
      href: s.href || undefined,
    }));
}

/** Pozele pentru hero — primul slider importat. */
export function heroSlides() {
  const first = sliders[0];
  return first ? prepare(first.slides, { w: 1400, h: 900 }) : [];
}

// Banda de branduri se recunoaște singură: siglele sunt aproape mereu PNG
// (sau SVG) cu fundal transparent, iar sliderul are multe poze mici.
const looksLikeLogos = (s) => {
  const png = s.slides.filter((x) => /\.(png|svg)(\?|$)/i.test(x.src || "")).length;
  return s.slides.length >= 3 && png / s.slides.length >= 0.6;
};

/** Sliderul cu siglele producătorilor, dacă există. */
export function brandStrip() {
  const s = sliders.slice(1).find(looksLikeLogos);
  return s ? s.slides.filter((x) => x.src).map((x) => ({ src: img(x.src, { w: 320 }), alt: x.alt || "" })) : [];
}

/** Sliderele rămase, randate ca galerii pe toată lățimea. */
export function extraSliders() {
  return sliders
    .slice(1)
    .filter((s) => !looksLikeLogos(s))
    .map((s) => ({
      id: s.id,
      title: s.title || "",
      slides: prepare(s.slides, { w: 1200, h: 700 }),
    }));
}
