// Harta site-ului, generată din conținutul real. Google o găsește prin
// robots.txt și o folosește ca să descopere toate produsele și articolele.
import { getProducts, getPosts, getPages } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap() {
  const [products, posts, pages] = await Promise.all([getProducts(), getPosts(), getPages()]);
  const now = new Date();

  const fixed = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/produse"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/blog"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
  ];

  return [
    ...fixed,
    ...products.map((p) => ({
      url: absoluteUrl(`/produse/${p.slug}`),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    })),
    ...posts.map((p) => ({
      url: absoluteUrl(`/blog/${p.slug}`),
      lastModified: new Date(p.modified || p.date),
      changeFrequency: "monthly",
      priority: 0.6,
    })),
    ...pages.map((p) => ({
      url: absoluteUrl(`/${p.slug}`),
      lastModified: new Date(p.modified || p.date),
      changeFrequency: "monthly",
      priority: 0.5,
    })),
  ];
}
