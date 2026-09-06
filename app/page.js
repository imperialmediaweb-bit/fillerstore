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
import { heroSlides as importedHero, extraSliders } from "@/lib/slides";
import BrandStrip from "@/components/BrandStrip";
import CategoryBento from "@/components/CategoryBento";
import About from "@/components/About";
import Divider from "@/components/Divider";
import FeaturedProduct from "@/components/FeaturedProduct";
import CategoryTabs from "@/components/CategoryTabs";
import ProductRow from "@/components/ProductRow";
import Tilt3D from "@/components/effects/Tilt3D";
import NumberTicker from "@/components/effects/NumberTicker";
import PromoBand from "@/components/PromoBand";
import PhotoBand from "@/components/PhotoBand";
import Testimonials from "@/components/Testimonials";
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

  // Hero-ul: întâi sliderul preluat din WordPress (pozele frumoase, cu
  // modele). Dacă nu s-a importat încă, cădem pe pozele produselor.
  const galleries = extraSliders();
  let heroSlides = importedHero();

  const source = products.filter((p) => p.images?.[0]).slice(0, 6);
  if (!heroSlides.length) heroSlides = source.map((p) => ({
    src: img(p.images[0].src, { w: 1400, h: 900 }),
    srcSet: srcSet(p.images[0].src, [700, 1000, 1400, 1900]),
    alt: p.images[0].alt || p.name,
    title: p.name,
    kicker: p.categories?.[0]?.name || p.categories?.[0],
    href: `/produse/${p.slug}`,
  }));

  if (!heroSlides.length) {
    heroSlides = (
      posts
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

  // produsul pus în lumină: primul cu reducere, altfel cel mai scump
  const featured =
    products.find((p) => p.onSale) ||
    [...products].sort((a, b) => (b.price ?? 0) - (a.price ?? 0))[0] ||
    null;

  // rândurile pentru lista cu file, randate aici, pe server
  const tabItems = products.map((p) => ({
    id: p.id,
    categories: (p.categories || []).map((c) => c.slug || c),
    node: <ProductRow product={p} />,
  }));

  // Vitrinele de categorie: fiecare primește produsul real din categoria ei
  // (pozele de categorie din WordPress lipsesc de multe ori) și un ton de
  // culoare propriu, ca să nu semene două vitrine între ele.
  const productIn = (slug) =>
    products.find((p) => (p.categories || []).some((c) => (c.slug || c) === slug));
  const catCards = categories.map((c, i) => ({
    ...c,
    photo: productIn(c.slug)?.images?.[0]?.src || null,
    tone: [334, 320, 348, 308][i % 4],
  }));

  // poza panoului de ofertă: produsul de mezoterapie, nu poza de categorie
  const mezoProduct = productIn("mezoterapie") || featured;
  const mezoImage = mezoProduct?.images?.[0]?.src || null;

  // banda foto dintre secțiuni: a doua poză din slider, ca să nu se repete
  // cu hero-ul; dacă sliderul nu e importat, cădem pe poza din „Despre”.
  const bandImage = heroSlides[1]?.raw || heroSlides[1]?.src || null;

  const empty = !products.length && !posts.length;

  return (
    <>
      <ThemeStyle seed={HUES.home} />
      <JsonLd data={itemListLd(products, "/")} />

      {/* Hero pe toată lățimea, cu textul peste fotografie — ca pe site-ul
          actual. Într-o casetă îngustă, fotografiile cu modele se tăiau
          exact peste față. */}
      <h1 className="sr-only">
        {siteConfig.name} — fillere și produse profesionale de înfrumusețare
      </h1>

      {heroSlides.length > 0 && (
        <section className="hero-full">
          <Slider
            slides={heroSlides}
            variant="cover"
            autoPlayMs={6500}
            priority
            sizes="100vw"
          />
        </section>
      )}

      <div className="zone--cream"><Marquee /></div>

      <section className="container section--tight section">
        <div className="trust-strip">
          {siteConfig.trust.map((t, i) => (
            <Reveal className="trust-strip__item" key={t.title} delay={i * 70}>
              <i aria-hidden="true">{t.icon}</i>
              <div>
                <b>{t.title}</b>
                <span>{t.text}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container section--tight">
        <div className="values values--rail">
          {siteConfig.features.map((f, i) => (
            <Reveal className="value" key={f.title} delay={i * 70}>
              <span className="value__num">{String(i + 1).padStart(2, "0")}</span>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <PromoBand />

      {empty && (
        <div className="container section">
          <SetupNotice configured={wpConfigured()} />
        </div>
      )}

      <Divider />

      {categories.length > 0 && (
        <section className="container section">
          <Reveal className="section__head">
            <div className="section__head-text">
              <span className="kicker">Top picks</span>
              <h2>Categorii &amp; oferte</h2>
              <p className="lead">
                Alege după tipul de tratament — de la fillere dermice și
                mezoterapie, până la creme anestezice și lipolitice.
              </p>
            </div>
            <Link href="/produse" className="arrow-link">
              <span>Vezi tot magazinul</span><span aria-hidden="true">→</span>
            </Link>
          </Reveal>

          <Reveal>
            <CategoryBento
              categories={catCards}
              promo={{
                kicker: "Oferte de până la 50%",
                title: "Super reduceri",
                text: "Descoperă ofertele noastre speciale la produse premium de înfrumusețare.",
                href: "/produse",
                label: "Vezi ofertele",
              }}
            />
          </Reveal>
        </section>
      )}

      <PhotoBand
        image={bandImage}
        kicker="Rezultate naturale"
        title="Produsele pe care le folosesc clinicile serioase"
        text="Lucrăm doar cu distribuitori autorizați. Fiecare lot are trasabilitate completă, termen de valabilitate generos și documentație pentru cabinetul tău."
        cta={{ label: "Vezi tot magazinul", href: "/produse" }}
      />

      {galleries.map((g) => (
        <section className="container section--tight section" key={g.id}>
          <Reveal className="gallery-band">
            <Slider
              slides={g.slides}
              variant="hero"
              autoPlayMs={6000}
              sizes="(max-width: 1240px) 100vw, 1200px"
            />
          </Reveal>
        </section>
      ))}

      <Divider />

      <About />

      {products.length > 0 && (
        <section className="container section">
          <Reveal className="section__head">
            <div className="section__head-text">
              <span className="kicker">Ofertă</span>
              <h2>Produse pentru mezoterapie</h2>
              <p className="lead">
                Branduri de top pentru hidratare profundă și rejuvenare —
                Profhilo, Revolax, Restylane.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <CategoryTabs
              items={tabItems}
              categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
              panel={
                <div className="showcase frame frame--arch"><span className="frame__inner">
                  <span className="showcase__aura" aria-hidden="true" />
                  {mezoImage && (
                    <img
                      className="showcase__art"
                      src={img(mezoImage, { w: 640, fit: "contain" })}
                      srcSet={srcSet(mezoImage, [320, 480, 640])}
                      sizes="(max-width: 900px) 60vw, 300px"
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                  <span className="showcase__plate">
                    <span className="chip">Ofertă limitată</span>
                    <span className="showcase__title">Produse mezoterapie</span>
                    <span className="showcase__text">
                      Super ofertă la produsele pentru mezoterapie. Branduri de
                      top: Profhilo, Revolax și altele.
                    </span>
                    <Link href="/produse?categorie=mezoterapie" className="btn btn--sm">
                      Vezi oferta
                    </Link>
                  </span>
                  </span>
                </div>
              }
            />
          </Reveal>
        </section>
      )}

      <FeaturedProduct product={featured} />

      <section className="band--ink">
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

          <Reveal className="stats">
            <div className="stats__item">
              <b><NumberTicker value={products.length || 20} suffix="+" /></b>
              <span>produse în stoc</span>
            </div>
            <div className="stats__item">
              <b><NumberTicker value={600} suffix="+" /></b>
              <span>comenzi livrate</span>
            </div>
            <div className="stats__item">
              <b><NumberTicker value={500} suffix="+" /></b>
              <span>clienți mulțumiți</span>
            </div>
            <div className="stats__item">
              <b>48–72<span className="stats__unit">h</span></b>
              <span>timp de livrare</span>
            </div>
          </Reveal>
        </div>
      </section>

      <Divider label="Branduri" />

      <BrandStrip />

      <Divider />

      <Testimonials />

      {posts.length > 0 && (
        <section className="container section">
          <Reveal className="section__head">
            <div className="section__head-text">
              <span className="kicker">Articole & noutăți</span>
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
