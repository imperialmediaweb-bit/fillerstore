import Link from "next/link";
import { notFound } from "next/navigation";
import ThemeStyle from "@/components/ThemeStyle";
import Slider from "@/components/Slider";
import ProductCard from "@/components/ProductCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import Reveal from "@/components/Reveal";
import BrandStrip from "@/components/BrandStrip";
import DeliveryEstimate from "@/components/DeliveryEstimate";
import Tilt3D from "@/components/effects/Tilt3D";
import {
  getProduct,
  getProducts,
  getRelatedProducts,
  formatPrice,
  discountPercent,
  excerpt,
} from "@/lib/content";
import { specsFor, brandOf } from "@/lib/specs";
import { img, srcSet } from "@/lib/img";
import { pageMeta, productLd, breadcrumbLd, faqLd, JsonLd } from "@/lib/seo";

export const revalidate = 300;

// Scoate un titlu de la inceputul descrierii daca repeta numele produsului
// (ignorand spatiile si diferentele de tip "0.5ml" / "0.5 ml").
function faraTitluDublat(html = "", name = "") {
  const m = html.match(/^\s*<h[2-4][^>]*>([\s\S]*?)<\/h[2-4]>/i);
  if (!m) return html;
  const norm = (s) => s.replace(/<[^>]+>/g, "").replace(/\s+/g, "").toLowerCase();
  return norm(m[1]) === norm(name) ? html.slice(m[0].length) : html;
}

// Prerandăm toate produsele — paginile devin fișiere statice.
export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return pageMeta({ title: "Produs negăsit", path: `/produse/${slug}`, noIndex: true });

  const price = formatPrice(product);
  return pageMeta({
    title: product.seoTitle || product.name,
    description:
      excerpt(product.shortDescription || product.description, 140) ||
      `${product.name}${price ? ` — ${price}` : ""}. Produs original, livrat rapid în toată România. Uz profesional.`,
    path: `/produse/${product.slug}`,
    image: product.images?.[0]?.src,
  });
}

const TRUST = [
  { icon: "✓", text: "Produs original, de la distribuitor autorizat" },
  { icon: "◆", text: "Livrare gratuită la comenzi peste 600 lei" },
  { icon: "✦", text: "Retur în 14 zile, conform legii" },
  { icon: "✓", text: "Plată online securizată sau ramburs" },
];

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product, 4);
  const discount = discountPercent(product);
  const specs = specsFor(product);
  const brand = brandOf(product);

  const slides = (product.images || []).map((image) => ({
    src: img(image.src, { w: 1000 }),
    srcSet: srcSet(image.src, [500, 800, 1100]),
    thumb: img(image.src, { w: 160, h: 160, fit: "contain" }),
    alt: image.alt || product.name,
  }));

  const crumbs = [
    { href: "/", label: "Acasă" },
    { href: "/produse", label: "Produse" },
    ...(product.categories?.[0]
      ? [{
          href: `/produse?categorie=${product.categories[0].slug || ""}`,
          label: product.categories[0].name || product.categories[0],
        }]
      : []),
    { label: product.name },
  ];

  return (
    <>
      <ThemeStyle seed={product.slug} />
      <JsonLd data={productLd(product)} />
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd data={faqLd(product.faq || [])} />

      <div className="container section">
        <Breadcrumbs items={crumbs} />

        <div className="product__layout">
          <div className="product__gallery">
            {slides.length ? (
              <Tilt3D max={4} scale={1}>
                <Slider
                  slides={slides}
                  variant="gallery"
                  thumbs
                  sizes="(max-width: 900px) 100vw, 620px"
                  priority
                />
              </Tilt3D>
            ) : (
              <div className="card__placeholder" style={{ aspectRatio: "1 / 1", borderRadius: "var(--r-lg)" }} />
            )}
          </div>

          <div className="product__info">
            <div className="product__cats">
              {brand && <span className="chip">{brand}</span>}
              {product.categories?.map((c) => (
                <Link key={c.slug || c} href={`/produse?categorie=${c.slug || ""}`} className="chip">
                  {c.name || c}
                </Link>
              ))}
            </div>

            <h1 className="product__title">{product.name}</h1>

            {product.rating > 0 && (
              <p className="product__rating">
                <span className="quote__stars" aria-hidden="true">{"★".repeat(Math.round(product.rating))}</span>
                <span className="muted">
                  {product.rating.toFixed(1).replace(".", ",")} din 5
                  {product.reviewCount ? ` · ${product.reviewCount} ${product.reviewCount === 1 ? "recenzie" : "recenzii"}` : ""}
                </span>
              </p>
            )}

            <div className="product__price-row">
              <span className="product__price">{formatPrice(product)}</span>
              {discount > 0 && (
                <>
                  <s className="product__old-price">
                    {product.regularPrice.toLocaleString("ro-RO", { minimumFractionDigits: 2 })}{" "}
                    {product.currencySymbol || "lei"}
                  </s>
                  <span className="product__save">−{discount}%</span>
                </>
              )}
            </div>

            <p className={`product__stock ${product.inStock ? "in" : "out"}`}>
              {product.inStock ? "În stoc, expediere în 48–72 h" : "Stoc epuizat"}
            </p>

            {product.shortDescription && (
              <div className="product__short wp-content" dangerouslySetInnerHTML={{ __html: product.shortDescription }} />
            )}

            <div className="product__actions">
              {product.permalink ? (
                <a className="btn btn--block" href={product.permalink} target="_blank" rel="noopener noreferrer">
                  Comandă acum
                </a>
              ) : (
                <Link className="btn btn--block" href="/contact-us">Cere ofertă</Link>
              )}
              <Link className="btn btn--ghost btn--block" href="/contact-us">Întreabă un specialist</Link>
            </div>

            <div className="trust">
              <DeliveryEstimate />
              {TRUST.map((t) => (
                <p className="trust__row" key={t.text}>
                  <i aria-hidden="true">{t.icon}</i>
                  {t.text}
                </p>
              ))}
            </div>

            {specs.length > 0 && (
              <table className="specs">
                <caption className="sr-only">Specificațiile produsului</caption>
                <tbody>
                  {specs.map((s) => (
                    <tr key={s.label}>
                      <th scope="row">{s.label}</th>
                      <td>{s.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {product.description && (
          <div className="product__description">
            <div className="article">
              <h2>Descriere</h2>
              {/* descrierile noastre incep cu numele produsului ca subtitlu —
                  sub "Descriere" era o dublare; il scoatem daca e primul */}
              <div className="wp-content" dangerouslySetInnerHTML={{ __html: faraTitluDublat(product.description, product.name) }} />
            </div>
          </div>
        )}
      </div>

      {product.faq?.length > 0 && (
        <section className="container section--tight section">
          <div className="faq">
            <Reveal className="section__head">
              <div className="section__head-text">
                <span className="kicker">Întrebări frecvente</span>
                <h2>Ce ne întreabă cel mai des</h2>
              </div>
            </Reveal>
            <div className="faq__list">
              {product.faq.map((item, i) => (
                <Reveal key={item.q} delay={i * 60}>
                  <details className="faq__item" open={i === 0}>
                    <summary>{item.q}</summary>
                    <p>{item.a}</p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <BrandStrip />

      {related.length > 0 && (
        <section className="container section">
          <Reveal className="section__head">
            <div className="section__head-text">
              <span className="kicker">S-ar putea să-ți placă</span>
              <h2>Produse înrudite</h2>
            </div>
            <Link href="/produse" className="arrow-link">
              <span>Vezi toate</span><span aria-hidden="true">→</span>
            </Link>
          </Reveal>
          <div className="grid">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={i * 60}>
                <Tilt3D>
                  <ProductCard product={p} />
                </Tilt3D>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* bara lipită jos, pe telefon — prețul și butonul rămân mereu la îndemână */}
      <div className="buybar">
        <div className="buybar__info">
          <b>{formatPrice(product)}</b>
          <span>{product.inStock ? "În stoc" : "Stoc epuizat"}</span>
        </div>
        {product.permalink ? (
          <a className="btn btn--sm" href={product.permalink} target="_blank" rel="noopener noreferrer">Comandă</a>
        ) : (
          <Link className="btn btn--sm" href="/contact-us">Cere ofertă</Link>
        )}
      </div>
    </>
  );
}
