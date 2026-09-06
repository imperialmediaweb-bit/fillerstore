// Servirea pozelor prin CDN.
//
// Regula: servim de pe CDN DOAR pozele despre care știm sigur că au fost
// urcate acolo (adică apar în content/media-map.json). Restul se servesc de
// pe adresa lor originală din WordPress.
//
// Am încercat întâi varianta „calculăm adresa CDN determinist pentru orice
// poză". Sună bine, dar dacă urcarea nu a rulat încă, trimitem browserul
// către fișiere care nu există și pagina rămâne cu casete goale — exact ce
// s-a întâmplat la primul deploy. O poză servită mai încet e infinit mai
// bună decât o poză lipsă.

import mediaMap from "@/content/media-map.json";

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "kaz6teok";
const FOLDER = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER || "filler";


// Adresa din WordPress → id stabil pe CDN.
// Atenție: fillerstore.ro nu folosește /wp-content/uploads/, ci un folder
// redenumit (/athugrom/). De aceea nu căutăm un nume fix, ci tiparul
// an/lună al WordPress-ului, care rămâne același indiferent de redenumire:
//   .../athugrom/2024/09/deep409x532.png      → 2024/09/deep409x532
//   .../wp-content/uploads/2024/09/x-800x800.jpg → 2024/09/x
function relativeUploadPath(pathname) {
  const byDate = pathname.match(/\/(\d{4}\/\d{2}\/[^/]+)$/);
  if (byDate) return byDate[1];
  // fără tipar de dată (ex. miniaturile Elementor): sărim primul segment
  return pathname.replace(/^\/[^/]+\//, "").replace(/^\/+/, "");
}

function publicIdFor(url) {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(url).pathname);
  } catch {
    return null;
  }
  const p = relativeUploadPath(pathname)
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/-\d{2,4}x\d{2,4}$/i, "")
    .replace(/[^a-zA-Z0-9/_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return p ? `${FOLDER}/${p}` : null;
}

/**
 * @param {string} src   adresa originală a pozei (din WordPress)
 * @param {object} opts  w = lățime, h = înălțime, fit = "cover" | "contain"
 */
export function img(src, { w = 900, h, fit = "cover", dpr = 2 } = {}) {
  if (!src) return "";
  if (!CLOUD) return src;

  const entry = mediaMap[src];
  if (!entry?.publicId) return src; // nu e (încă) pe CDN → servim originalul
  const publicId = entry.publicId;

  const t = ["f_auto", "q_auto", `dpr_${dpr}`, `w_${Math.round(w)}`];
  if (h) t.push(`h_${Math.round(h)}`);
  t.push(h ? (fit === "contain" ? "c_pad,b_auto" : "c_fill,g_auto") : "c_limit");

  return `https://res.cloudinary.com/${CLOUD}/image/upload/${t.join(",")}/${publicId}`;
}

// `srcset` pentru poze responsive — browserul alege singur mărimea potrivită.
export function srcSet(src, widths = [400, 600, 900, 1200, 1600]) {
  if (!src || !CLOUD || !mediaMap[src]) return undefined;
  return widths.map((w) => `${img(src, { w, dpr: 1 })} ${w}w`).join(", ");
}

// Dimensiunile reale, dacă le știm din import — evită saltul paginii în
// timpul încărcării (contează la Core Web Vitals).
export function dimensions(src) {
  const e = mediaMap[src];
  return e?.width && e?.height ? { width: e.width, height: e.height } : {};
}

export const onCdn = (src) => Boolean(mediaMap[src]);
export const cdnCount = () => Object.keys(mediaMap).length;
