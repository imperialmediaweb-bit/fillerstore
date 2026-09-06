import Link from "next/link";
import { notFound } from "next/navigation";
import ThemeStyle from "@/components/ThemeStyle";
import Slider from "@/components/Slider";
import ProductCard from "@/components/ProductCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import Reveal from "@/components/Reveal";
import { getProduct, getProducts, getRelatedProducts, formatPrice, discountPercent, excerpt } from "@/lib/content";
import { img, srcSet } from "@/lib/img";
import { pageMeta, productLd, breadcrumbLd, JsonLd } from "@/lib/seo";

export const revalidate = 300;

// Prerandăm toate produsele importate — paginile devin fișiere statice.
export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return pageMeta({ title: "Produs negăsit", path: `/produse/${slug}`, noIndex: true });

  return pageMeta({
    title: product.name,
    description:
      excerpt(product.shortDescription || product.description, 155) ||
      `${product.name} — disponibil la Filler Store, produs original livrat rapid în toată România.`,
    path: `/produse/${product.slug}`,
    image: product.images?.[0]?.src,
    type: "website",
  });
}

const TRUST = [
  { icon: "✓", text: "Produs original, de la distribuitor autorizat" },
  { icon: "✦", text: "Expediere în 48–72 de ore" },
  { icon: "◆", text: "Livrare gratuită la comenzi peste 600 lei" },
  { icon: "✓", text: "Plata online securizată sau ramburs" },
];

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product, 4);
  const discount = discountPercent(product);

  const slides = (product.images || []).map((image) => ({
    src: img(image.src, { w: 1000 }),
    srcSet: srcSet(image.src, [500, 800, 1100]),
    thumb: img(image.src, { w: 160, h: 160, fit: "contain" }),
    alt: image.alt || product.name,
  }));

  const crumbs = [
    { href: "/", label: "Acasă" },
    { href: "/produse", label: "Produse" },
    { label: product.name },
  ];

  return (
    <>
      <ThemeStyle seed={product.slug} />
      <JsonLd data={productLd(product)} />
      <JsonLd data={breadcrumbLd(crumbs)} />

      <div className="container section">
        <Breadcrumbs items={crumbs} />

        <div className="product__layout">
          <div className="product__gallery">
            {slides.length ? (
              <Slider slides={slides} variant="gallery" thumbs sizes="(max-width: 900px) 100vw, 600px" priority />
            ) : (
              <div className="card__placeholder" style={{ aspectRatio: "1 / 1", borderRadius: "var(--r-lg)" }} />
            )}
          </div>

          <div className="product__info">
            {product.categories?.length > 0 && (
              <div className="product__cats">
                {product.categories.map((c) => (
                  <Link key={c.slug || c} href={`/produse?categorie=${c.slug || ""}`} className="chip">
                    {c.name || c}
                  </Link>
                ))}
              </div>
            )}

            <h1 className="product__title">{product.name}</h1>

            <div className="product__price-row">
              <span className="product__price">{formatPrice(product)}</span>
              {discount > 0 && (
                <>
                  <s className="product__old-price">
                    {product.regularPrice.toLocaleString("ro-RO", { minimumFractionDigits: 2 })}{" "}
                    {product.currencySymbol || "lei"}
                  </s>
                  <span className="product__save">Economisești {discount}%</span>
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
              {/* comanda se finalizează deocamdată pe WordPress (coșul existent) */}
              {product.permalink ? (
                <a className="btn" href={product.permalink} target="_blank" rel="noopener noreferrer">
                  Comandă acum
                </a>
              ) : (
                <Link className="btn" href="/contact">Cere ofertă</Link>
              )}
              <Link className="btn btn--ghost" href="/contact">Întreabă-ne</Link>
            </div>

            <div className="trust">
              {TRUST.map((t) => (
                <p className="trust__row" key={t.text}>
                  <i aria-hidden="true">{t.icon}</i>
                  {t.text}
                </p>
              ))}
            </div>
          </div>
        </div>

        {product.description && (
          <div className="product__description">
            <h2>Descriere</h2>
            <div className="wp-content" dangerouslySetInnerHTML={{ __html: product.description }} />
          </div>
        )}
      </div>

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
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
