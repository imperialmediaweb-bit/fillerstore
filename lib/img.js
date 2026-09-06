// Servirea pozelor prin CDN.
//
// Adresa pe Cloudinary se calculează DETERMINIST din adresa originală din
// WordPress (aceeași regulă ca în scripts/upload-media.mjs). Asta înseamnă
// că pozele merg chiar dacă harta media lipsește — e de ajuns ca urcarea să
// fi rulat o dată, oricând, oriunde.
//
// Harta (content/media-map.json) rămâne utilă pentru un singur lucru:
// dimensiunile reale ale pozelor, care opresc saltul paginii la încărcare.

import mediaMap from "@/content/media-map.json";

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
const FOLDER = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER || "filler";

// Aceeași transformare ca la urcare:
// .../wp-content/uploads/2024/05/profhilo-800x800.jpg → filler/2024/05/profhilo
function publicIdFor(url) {
  let path;
  try {
    path = decodeURIComponent(new URL(url).pathname);
  } catch {
    return null;
  }
  if (!/\/wp-content\/uploads\//.test(path)) return null;
  path = path
    .replace(/^.*\/wp-content\/uploads\//, "")
    .replace(/^\/+/, "")
    .replace(/\.[a-z0-9]+$/i, "")      // fără extensie
    .replace(/-\d{2,4}x\d{2,4}$/i, "") // fără sufixul de mărime pus de WordPress
    .replace(/[^a-zA-Z0-9/_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return path ? `${FOLDER}/${path}` : null;
}

/**
 * @param {string} src   adresa originală a pozei (din WordPress)
 * @param {object} opts  w = lățime, h = înălțime, fit = "cover" | "contain"
 */
export function img(src, { w = 900, h, fit = "cover", dpr = 2 } = {}) {
  if (!src) return "";
  if (!CLOUD) return src;

  const entry = mediaMap[src];
  const publicId = entry?.publicId || publicIdFor(src);
  if (!publicId) return src;

  const t = ["f_auto", "q_auto", `dpr_${dpr}`, `w_${Math.round(w)}`];
  if (h) t.push(`h_${Math.round(h)}`);
  t.push(h ? (fit === "contain" ? "c_pad,b_auto" : "c_fill,g_auto") : "c_limit");

  return `https://res.cloudinary.com/${CLOUD}/image/upload/${t.join(",")}/${publicId}`;
}

// `srcset` pentru poze responsive — browserul alege singur mărimea potrivită.
export function srcSet(src, widths = [400, 600, 900, 1200, 1600]) {
  if (!src || !CLOUD) return undefined;
  if (!mediaMap[src] && !publicIdFor(src)) return undefined;
  return widths.map((w) => `${img(src, { w, dpr: 1 })} ${w}w`).join(", ");
}

// Dimensiunile reale, dacă le știm din import — evită saltul paginii în
// timpul încărcării (contează la Core Web Vitals).
export function dimensions(src) {
  const e = mediaMap[src];
  return e?.width && e?.height ? { width: e.width, height: e.height } : {};
}

export const onCdn = (src) => Boolean(mediaMap[src] || publicIdFor(src));
export const cdnCount = () => Object.keys(mediaMap).length;
