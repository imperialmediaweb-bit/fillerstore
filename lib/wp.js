// Client pentru API-urile publice ale WordPress:
//  - conținut:  /wp-json/wp/v2/...   (articole, pagini, media)
//  - magazin:   /wp-json/wc/store/v1/... (produse WooCommerce, fără autentificare)
//
// Toate funcțiile întorc date goale (nu aruncă) dacă WordPress nu răspunde,
// ca site-ul să se construiască și să pornească chiar și fără conexiune.

const BASE = (process.env.WORDPRESS_URL || "").replace(/\/+$/, "");
const REVALIDATE = 300; // conținutul se reîmprospătează la 5 minute

export const wpConfigured = () => Boolean(BASE);

async function wpFetch(path, { collection = false } = {}) {
  if (!BASE) return collection ? [] : null;
  try {
    const res = await fetch(`${BASE}${path}`, {
      next: { revalidate: REVALIDATE },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return collection ? [] : null;
    return await res.json();
  } catch {
    return collection ? [] : null;
  }
}

// ---------- WooCommerce (Store API, publică) ----------

function normalizeProduct(p) {
  const minor = p.prices?.currency_minor_unit ?? 2;
  const toNum = (v) => (v ? Number(v) / 10 ** minor : null);
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    permalink: p.permalink,
    onSale: Boolean(p.on_sale),
    inStock: p.is_in_stock !== false,
    price: toNum(p.prices?.price),
    regularPrice: toNum(p.prices?.regular_price),
    currency: p.prices?.currency_symbol || p.prices?.currency_code || "lei",
    shortDescription: p.short_description || "",
    description: p.description || "",
    images: (p.images || []).map((img) => ({
      src: img.src,
      alt: img.alt || p.name,
    })),
    categories: (p.categories || []).map((c) => c.name),
  };
}

export async function getProducts({ perPage = 24, page = 1, search = "" } = {}) {
  const q = new URLSearchParams({ per_page: String(perPage), page: String(page) });
  if (search) q.set("search", search);
  const data = await wpFetch(`/wp-json/wc/store/v1/products?${q}`, { collection: true });
  return (Array.isArray(data) ? data : []).map(normalizeProduct);
}

export async function getProductBySlug(slug) {
  const data = await wpFetch(
    `/wp-json/wc/store/v1/products?slug=${encodeURIComponent(slug)}`,
    { collection: true }
  );
  return Array.isArray(data) && data[0] ? normalizeProduct(data[0]) : null;
}

// ---------- Articole și pagini WordPress ----------

function featuredImage(item) {
  const media = item?._embedded?.["wp:featuredmedia"]?.[0];
  return media?.source_url
    ? { src: media.source_url, alt: media.alt_text || item.title?.rendered || "" }
    : null;
}

function normalizePost(p) {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title?.rendered || "",
    excerpt: p.excerpt?.rendered || "",
    content: p.content?.rendered || "",
    date: p.date,
    image: featuredImage(p),
  };
}

export async function getPosts({ perPage = 12, page = 1 } = {}) {
  const data = await wpFetch(
    `/wp-json/wp/v2/posts?_embed=wp:featuredmedia&per_page=${perPage}&page=${page}`,
    { collection: true }
  );
  return (Array.isArray(data) ? data : []).map(normalizePost);
}

export async function getPostBySlug(slug) {
  const data = await wpFetch(
    `/wp-json/wp/v2/posts?_embed=wp:featuredmedia&slug=${encodeURIComponent(slug)}`,
    { collection: true }
  );
  return Array.isArray(data) && data[0] ? normalizePost(data[0]) : null;
}

export async function getPages({ perPage = 50 } = {}) {
  const data = await wpFetch(`/wp-json/wp/v2/pages?per_page=${perPage}`, {
    collection: true,
  });
  return (Array.isArray(data) ? data : []).map(normalizePost);
}

export async function getPageBySlug(slug) {
  const data = await wpFetch(
    `/wp-json/wp/v2/pages?_embed=wp:featuredmedia&slug=${encodeURIComponent(slug)}`,
    { collection: true }
  );
  return Array.isArray(data) && data[0] ? normalizePost(data[0]) : null;
}

// Extrage toate pozele dintr-un conținut HTML WordPress (pentru slidere
// pe articole/pagini care au galerii în corpul textului).
export function imagesFromHtml(html) {
  if (!html) return [];
  const out = [];
  const re = /<img[^>]+src="([^"]+)"[^>]*>/gi;
  let m;
  while ((m = re.exec(html))) {
    const src = m[1];
    if (!out.some((i) => i.src === src)) out.push({ src, alt: "" });
  }
  return out;
}

export function formatPrice(product) {
  if (product?.price == null) return "";
  const n = product.price.toLocaleString("ro-RO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${n} ${product.currency}`;
}
