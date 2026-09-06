// Sursa unică de conținut pentru tot site-ul.
//
// Ordinea: mai întâi fișierele importate local (content/*.json) — rapide,
// statice, fără dependență de WordPress. Dacă nu s-a rulat încă importul,
// se cade elegant pe API-ul WordPress în direct, ca site-ul să funcționeze
// oricum. Așa migrarea se poate face în pași, fără să se rupă nimic.

import productsLocal from "@/content/products.json";
import categoriesLocal from "@/content/categories.json";
import postsLocal from "@/content/posts.json";
import pagesLocal from "@/content/pages.json";
import meta from "@/content/meta.json";

import {
  getProducts as wpProducts,
  getProductBySlug as wpProduct,
  getPosts as wpPosts,
  getPostBySlug as wpPost,
  getPages as wpPages,
  getPageBySlug as wpPage,
  wpConfigured,
} from "@/lib/wp";

export const imported = () => productsLocal.length > 0 || postsLocal.length > 0 || pagesLocal.length > 0;
export const importMeta = () => meta;
export const hasContent = () => imported() || wpConfigured();

const byDate = (a, b) => new Date(b.date) - new Date(a.date);

// ---------- produse ----------

export async function getProducts({ limit, category, search, sort } = {}) {
  let list = productsLocal.length ? [...productsLocal] : await wpProducts({ perPage: 100 });

  if (category) list = list.filter((p) => p.categories?.some((c) => (c.slug || c) === category));
  if (search) {
    const q = search.toLowerCase();
    list = list.filter((p) => p.name.toLowerCase().includes(q));
  }
  if (sort === "price-asc") list.sort((a, b) => (a.price ?? 1e9) - (b.price ?? 1e9));
  else if (sort === "price-desc") list.sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
  else if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name, "ro"));

  return limit ? list.slice(0, limit) : list;
}

export async function getProduct(slug) {
  const local = productsLocal.find((p) => p.slug === slug);
  return local || (await wpProduct(slug));
}

export async function getCategories() {
  return categoriesLocal.filter((c) => c.count > 0);
}

// Produse înrudite: aceeași categorie, altul decât cel curent.
export async function getRelatedProducts(product, limit = 4) {
  if (!product) return [];
  const all = await getProducts();
  const slugs = new Set((product.categories || []).map((c) => c.slug || c));
  const same = all.filter((p) => p.slug !== product.slug && p.categories?.some((c) => slugs.has(c.slug || c)));
  const rest = all.filter((p) => p.slug !== product.slug && !same.includes(p));
  return [...same, ...rest].slice(0, limit);
}

// ---------- articole ----------

export async function getPosts({ limit } = {}) {
  const list = postsLocal.length ? [...postsLocal].sort(byDate) : await wpPosts({ perPage: 100 });
  return limit ? list.slice(0, limit) : list;
}

export async function getPost(slug) {
  const local = postsLocal.find((p) => p.slug === slug);
  return local || (await wpPost(slug));
}

export async function getRelatedPosts(post, limit = 3) {
  const all = await getPosts();
  return all.filter((p) => p.slug !== post?.slug).slice(0, limit);
}

// ---------- pagini ----------

export async function getPages() {
  return pagesLocal.length ? pagesLocal : await wpPages({ perPage: 100 });
}

export async function getPage(slug) {
  const local = pagesLocal.find((p) => p.slug === slug);
  return local || (await wpPage(slug));
}

// ---------- ajutoare ----------

export const stripHtml = (html = "") =>
  html.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&[a-z]+;/gi, " ").replace(/\s+/g, " ").trim();

export function excerpt(html, max = 160) {
  const text = stripHtml(html);
  if (text.length <= max) return text;
  return text.slice(0, text.lastIndexOf(" ", max)).trimEnd() + "…";
}

// ~200 de cuvinte pe minut, cifra obișnuită pentru română.
export function readingTime(html) {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function formatPrice(product) {
  if (product?.price == null) return "";
  const n = product.price.toLocaleString("ro-RO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${n} ${product.currencySymbol || product.currency || "lei"}`;
}

export function discountPercent(product) {
  if (!product?.onSale || !product.regularPrice || !product.price) return 0;
  return Math.round((1 - product.price / product.regularPrice) * 100);
}

// Toate pozele dintr-un conținut HTML de WordPress (galerii din corpul textului).
export function imagesFromHtml(html) {
  if (!html) return [];
  const out = [];
  const re = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  let m;
  while ((m = re.exec(html))) if (!out.some((i) => i.src === m[1])) out.push({ src: m[1], alt: "" });
  return out;
}
