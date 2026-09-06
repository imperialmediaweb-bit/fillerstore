import Link from "next/link";
import ThemeStyle from "@/components/ThemeStyle";
import Slider from "@/components/Slider";
import ProductCard from "@/components/ProductCard";
import PostCard from "@/components/PostCard";
import SetupNotice from "@/components/SetupNotice";
import Marquee from "@/components/Marquee";
import Newsletter from "@/components/Newsletter";
import Reveal from "@/components/Reveal";
import { getProducts, getPosts, getCategories, hasContent, excerpt } from "@/lib/content";
import { img, srcSet } from "@/lib/img";
import { wpConfigured } from "@/lib/wp";
import { siteConfig } from "@/lib/site";
import { HUES } from "@/lib/theme";
import { pageMeta, itemListLd, JsonLd } from "@/lib/seo";

export const revalidate = 300;

export const metadata = pageMeta({
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
  path: "/",
});

const VALUES = [
  { title: "Produse originale", text: "Lucrăm direct cu distribuitori autorizați. Fiecare lot vine cu trasabilitate completă și termen de valabilitate generos." },
  { title: "Testate dermatologic", text: "Formule fără parabeni și sulfați, potrivite inclusiv pentru pielea sensibilă, cu rezultate documentate clinic." },
  { title: "Livrare în 48–72 h", text: "Expediem din stoc în toată România, ambalat corespunzător ca produsul să ajungă în stare perfectă." },
  { title: "Suport pentru profesioniști", text: "Consiliere pe produs și protocol de utilizare, pentru clinici și saloane, de la oameni care cunosc domeniul." },
];

export default async function HomePage() {
  const [products, posts, categories] = await Promise.all([
    getProducts({ limit: 8 }),
    getPosts({ limit: 3 }),
    getCategories(),
  ]);

  // sliderul mare: pozele produselor; dacă nu-s produse, ale articolelor
  const source = products.filter((p) => p.images?.[0]).slice(0, 6);
  const heroSlides = source.map((p) => ({
    src: img(p.images[0].src, { w: 1400, h: 900 }),
    srcSet: srcSet(p.images[0].src, [700, 1000, 1400, 1900]),
    alt: p.images[0].alt || p.name,
    title: p.name,
    kicker: p.categories?.[0]?.name || p.categories?.[0],
    href: `/produse/${p.slug}`,
  }));
  if (!heroSlides.length) {
    heroSlides.push(
      ...posts
        .filter((p) => p.image)
        .map((p) => ({
          src: img(p.image.src, { w: 1400, h: 900 }),
          srcSet: srcSet(p.image.src, [700, 1000, 1400]),
          alt: p.image.alt || p.title,
          title: p.title,
          href: `/blog/${p.slug}`,
        }))
    );
  }

  const empty = !products.length && !posts.length;

  return (
    <>
      <ThemeStyle seed={HUES.home} />
      <JsonLd data={itemListLd(products, "/")} />

      <section className="hero container">
        <div className="hero__grid">
          <div className="hero__copy">
            <span className="kicker">Pentru clinici și saloane</span>
            <h1 className="display">
              Fillere și produse <span className="hl">profesionale</span> de înfrumusețare
            </h1>
            <p className="lead">
              Acid hialuronic, mezoterapie și cosmetice de top, la prețuri corecte.
              Produse originale, testate dermatologic, livrate rapid în toată România.
            </p>
            <div className="hero__actions">
              <Link href="/produse" className="btn">Vezi produsele</Link>
              <Link href="/despre" className="btn btn--ghost">Despre noi</Link>
            </div>
            <dl className="hero__stats">
              <div className="hero__stat"><b>{products.length ? `${products.length}+` : "20+"}</b><span>produse în stoc</span></div>
              <div className="hero__stat"><b>48–72h</b><span>timp de livrare</span></div>
              <div className="hero__stat"><b>100%</b><span>produse originale</span></div>
            </dl>
          </div>

          {heroSlides.length > 0 && (
            <div className="hero__media">
              <Slider
                slides={heroSlides}
                variant="hero"
                autoPlayMs={5500}
                priority
                sizes="(max-width: 900px) 100vw, 620px"
              />
              <div className="hero__badge">
                <i aria-hidden="true">✓</i>
                <div>
                  <b>Produse originale</b>
                  <small>de la distribuitori autorizați</small>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Marquee />

      {empty && (
        <div className="container section">
          <SetupNotice configured={wpConfigured()} />
        </div>
      )}

      {categories.length > 0 && (
        <section className="container section--tight section">
          <Reveal className="section__head">
            <div className="section__head-text">
              <span className="kicker">Categorii</span>
              <h2>Alege după tipul de tratament</h2>
            </div>
          </Reveal>
          <div className="filters">
            {categories.map((c) => (
              <Link key={c.slug} href={`/produse?categorie=${c.slug}`} className="chip">
                {c.name} <span aria-hidden="true">({c.count})</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {products.length > 0 && (
        <section className="container section">
          <Reveal className="section__head">
            <div className="section__head-text">
              <span className="kicker">Magazin</span>
              <h2>Produse alese pentru rezultate vizibile</h2>
              <p className="lead">
                Gama noastră acoperă de la fillere dermice și volumizare, până la
                hidratare intensă și îngrijire post-tratament.
              </p>
            </div>
            <Link href="/produse" className="arrow-link">
              <span>Vezi toate produsele</span><span aria-hidden="true">→</span>
            </Link>
          </Reveal>
          <div className="grid">
            {products.map((p, i) => (
              <Reveal key={p.id} delay={i * 60}>
                <ProductCard product={p} priority={i < 4} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section className="band--deep">
        <div className="container section">
          <Reveal className="section__head">
            <div className="section__head-text">
              <span className="kicker">De ce noi</span>
              <h2>Calitate pe care o poți garanta clienților tăi</h2>
            </div>
          </Reveal>
          <div className="values">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} className="value" delay={i * 80}>
                <span className="value__num">{String(i + 1).padStart(2, "0")}</span>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {posts.length > 0 && (
        <section className="container section">
          <Reveal className="section__head">
            <div className="section__head-text">
              <span className="kicker">Blog</span>
              <h2>Articole și noutăți din estetică</h2>
            </div>
            <Link href="/blog" className="arrow-link">
              <span>Tot blogul</span><span aria-hidden="true">→</span>
            </Link>
          </Reveal>
          <div className="grid grid--3">
            {posts.map((p, i) => (
              <Reveal key={p.id} delay={i * 70}>
                <PostCard post={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <Newsletter />
    </>
  );
}
