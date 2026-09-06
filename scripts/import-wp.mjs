#!/usr/bin/env node
// Importă TOT conținutul din WordPress/WooCommerce în fișiere JSON locale
// (folderul `content/`): produse, categorii, articole, pagini, media.
//
// După import, site-ul nu mai depinde de WordPress la fiecare cerere — se
// construiește static, e instantaneu și rezistă chiar dacă WP-ul cade.
// Se rulează oricând vrei să reîmprospătezi conținutul:
//
//     WORDPRESS_URL=https://fillerstore.ro npm run import
//
// Atenție: se rulează local sau pe serverul de deploy, nu din sandbox —
// are nevoie de acces la internet către site-ul WordPress.

import { writeFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const BASE = (process.env.WORDPRESS_URL || "").replace(/\/+$/, "");
const OUT = resolve(process.cwd(), "content");

if (!BASE) {
  console.error("Lipsește WORDPRESS_URL. Exemplu:\n  WORDPRESS_URL=https://fillerstore.ro npm run import");
  process.exit(1);
}

const log = (...a) => console.log(" ", ...a);

async function get(path, { retries = 3 } = {}) {
  const url = `${BASE}${path}`;
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, {
        headers: { Accept: "application/json", "User-Agent": "fillerstore-import/1.0" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return { data: await res.json(), headers: res.headers };
    } catch (err) {
      if (i === retries) {
        console.warn(`  ! nu am putut citi ${path}: ${err.message}`);
        return { data: null, headers: new Headers() };
      }
      await new Promise((r) => setTimeout(r, 2 ** i * 1000));
    }
  }
}

// Parcurge toate paginile unui endpoint paginat.
async function getAll(path, { perPage = 100, max = 50 } = {}) {
  const out = [];
  for (let page = 1; page <= max; page++) {
    const sep = path.includes("?") ? "&" : "?";
    const { data, headers } = await get(`${path}${sep}per_page=${perPage}&page=${page}`);
    if (!Array.isArray(data) || !data.length) break;
    out.push(...data);
    const total = Number(headers.get("x-wp-totalpages") || 0);
    if (total && page >= total) break;
    if (data.length < perPage) break;
  }
  return out;
}

// ---------- normalizare ----------

const clean = (html = "") => html.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

function normalizeProduct(p) {
  const minor = p.prices?.currency_minor_unit ?? 2;
  const toNum = (v) => (v ? Number(v) / 10 ** minor : null);
  return {
    id: p.id,
    slug: p.slug,
    name: clean(p.name),
    permalink: p.permalink,
    sku: p.sku || "",
    onSale: Boolean(p.on_sale),
    inStock: p.is_in_stock !== false,
    price: toNum(p.prices?.price),
    regularPrice: toNum(p.prices?.regular_price),
    currency: p.prices?.currency_code || "RON",
    currencySymbol: p.prices?.currency_symbol || "lei",
    shortDescription: p.short_description || "",
    description: p.description || "",
    images: (p.images || []).map((img) => ({ src: img.src, alt: img.alt || clean(p.name) })),
    categories: (p.categories || []).map((c) => ({ name: c.name, slug: c.slug })),
    rating: p.average_rating ? Number(p.average_rating) : null,
    reviewCount: p.review_count || 0,
  };
}

function normalizePost(p) {
  const media = p?._embedded?.["wp:featuredmedia"]?.[0];
  return {
    id: p.id,
    slug: p.slug,
    title: clean(p.title?.rendered || ""),
    excerpt: clean(p.excerpt?.rendered || ""),
    content: p.content?.rendered || "",
    date: p.date,
    modified: p.modified,
    image: media?.source_url ? { src: media.source_url, alt: media.alt_text || clean(p.title?.rendered) } : null,
    categories: (p?._embedded?.["wp:term"]?.[0] || []).map((t) => ({ name: t.name, slug: t.slug })),
  };
}

// Toate pozele dintr-un HTML (galerii puse în corpul textului).
function imagesFromHtml(html = "") {
  const out = [];
  const re = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  let m;
  while ((m = re.exec(html))) if (!out.includes(m[1])) out.push(m[1]);
  return out;
}

// ---------- import ----------

async function main() {
  console.log(`\nImport din ${BASE}\n`);
  await mkdir(OUT, { recursive: true });

  log("produse…");
  const rawProducts = await getAll("/wp-json/wc/store/v1/products");
  const products = rawProducts.map(normalizeProduct);
  log(`  ${products.length} produse`);

  log("categorii de produse…");
  const rawCats = await getAll("/wp-json/wc/store/v1/products/categories");
  const categories = (rawCats || []).map((c) => ({
    id: c.id, slug: c.slug, name: clean(c.name),
    description: clean(c.description || ""),
    count: c.count || 0,
    image: c.image?.src ? { src: c.image.src, alt: c.image.alt || clean(c.name) } : null,
  }));
  log(`  ${categories.length} categorii`);

  log("articole…");
  const posts = (await getAll("/wp-json/wp/v2/posts?_embed=wp:featuredmedia,wp:term")).map(normalizePost);
  log(`  ${posts.length} articole`);

  log("pagini…");
  const pages = (await getAll("/wp-json/wp/v2/pages?_embed=wp:featuredmedia")).map(normalizePost);
  log(`  ${pages.length} pagini`);

  log("bibliotecă media…");
  const rawMedia = await getAll("/wp-json/wp/v2/media?media_type=image", { perPage: 100 });
  const media = (rawMedia || []).map((m) => ({
    id: m.id,
    src: m.source_url,
    alt: m.alt_text || "",
    title: clean(m.title?.rendered || ""),
    width: m.media_details?.width || null,
    height: m.media_details?.height || null,
  }));
  log(`  ${media.length} poze în bibliotecă`);

  const { data: siteInfo } = await get("/wp-json");
  const meta = {
    importedAt: new Date().toISOString(),
    source: BASE,
    name: siteInfo?.name || "",
    description: siteInfo?.description || "",
    counts: { products: products.length, categories: categories.length, posts: posts.length, pages: pages.length, media: media.length },
  };

  // lista completă de poze de urcat pe CDN (produse + articole + pagini + media)
  const urls = new Set();
  for (const p of products) p.images.forEach((i) => urls.add(i.src));
  for (const c of categories) if (c.image) urls.add(c.image.src);
  for (const p of [...posts, ...pages]) {
    if (p.image) urls.add(p.image.src);
    imagesFromHtml(p.content).forEach((u) => urls.add(u));
  }
  for (const m of media) urls.add(m.src);
  const images = [...urls].filter((u) => /^https?:\/\//.test(u)).sort();

  const files = {
    "products.json": products,
    "categories.json": categories,
    "posts.json": posts,
    "pages.json": pages,
    "media.json": media,
    "images.json": images,
    "meta.json": meta,
  };
  for (const [name, data] of Object.entries(files)) {
    await writeFile(resolve(OUT, name), JSON.stringify(data, null, 2) + "\n", "utf8");
  }

  console.log(`\nGata. ${images.length} poze de urcat pe CDN.`);
  console.log("Următorul pas:  npm run upload-media\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
