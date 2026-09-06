// Servirea pozelor.
//
// După `npm run import` + `npm run upload-media`, fiecare poză din WordPress
// are un corespondent pe Cloudinary. Aici traducem adresa veche în adresa de
// pe CDN, cerând automat formatul cel mai bun pentru browserul vizitatorului
// (AVIF/WebP) și exact lățimea de care e nevoie — de aici vine cea mai mare
// parte din viteza site-ului.
//
// Dacă o poză nu e (încă) pe CDN, se servește adresa originală, neschimbată.

import mediaMap from "@/content/media-map.json";

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "kaz6teok";

/**
 * @param {string} src   adresa originală a pozei (din WordPress)
 * @param {object} opts  w = lățime, h = înălțime, fit = "cover" | "contain"
 */
export function img(src, { w = 900, h, fit = "cover", dpr = 2 } = {}) {
  if (!src) return "";
  const entry = mediaMap[src];
  if (!entry || !CLOUD) return src;

  const t = ["f_auto", "q_auto", `dpr_${dpr}`, `w_${Math.round(w)}`];
  if (h) t.push(`h_${Math.round(h)}`);
  t.push(h ? (fit === "contain" ? "c_pad,b_auto" : "c_fill,g_auto") : "c_limit");

  const version = entry.version ? `v${entry.version}/` : "";
  return `https://res.cloudinary.com/${CLOUD}/image/upload/${t.join(",")}/${version}${entry.publicId}`;
}

// `srcset` pentru poze responsive — browserul alege singur mărimea potrivită.
export function srcSet(src, widths = [400, 600, 900, 1200, 1600]) {
  if (!src || !mediaMap[src] || !CLOUD) return undefined;
  return widths.map((w) => `${img(src, { w, dpr: 1 })} ${w}w`).join(", ");
}

// Dimensiunile reale ale pozei, dacă le știm din import (evită saltul
// paginii în timpul încărcării — contează la scorul Core Web Vitals).
export function dimensions(src) {
  const e = mediaMap[src];
  return e?.width && e?.height ? { width: e.width, height: e.height } : {};
}

export const onCdn = (src) => Boolean(mediaMap[src]);
export const cdnCount = () => Object.keys(mediaMap).length;
