import Link from "next/link";
import Slider from "@/components/Slider";
import Tilt3D from "@/components/effects/Tilt3D";
import { formatPrice, discountPercent, excerpt } from "@/lib/content";
import { specsFor } from "@/lib/specs";
import { img, srcSet } from "@/lib/img";

// Produsul pus în lumină pe prima pagină: galerie mare, preț, argumente
// și buton de comandă — echivalentul secțiunii cu Revolax Sub-Q de pe
// site-ul actual.
export default function FeaturedProduct({ product }) {
  if (!product) return null;

  const discount = discountPercent(product);
  const specs = specsFor(product).slice(0, 4);
  const slides = (product.images || []).map((image) => ({
    src: img(image.src, { w: 900 }),
    srcSet: srcSet(image.src, [450, 700, 1000]),
    thumb: img(image.src, { w: 140, h: 140, fit: "contain" }),
    alt: image.alt || product.name,
  }));

  return (
    <section className="band--deep">
      <div className="container section">
        <div className="featured">
          <div className="featured__media">
            {slides.length ? (
              <Tilt3D max={5} scale={1}>
                <Slider slides={slides} variant="gallery" thumbs={slides.length > 1} sizes="(max-width: 900px) 100vw, 520px" />
              </Tilt3D>
            ) : (
              <div className="card__placeholder" style={{ aspectRatio: "1 / 1", borderRadius: "var(--r-lg)" }} />
            )}
          </div>

          <div className="featured__copy">
            <span className="kicker">Produsul lunii</span>
            <h2>{product.name}</h2>

            <div className="product__price-row">
              <span className="product__price">{formatPrice(product)}</span>
              {discount > 0 && (
                <>
                  <s className="product__old-price">
                    {product.regularPrice.toLocaleString("ro-RO", { minimumFractionDigits: 2 })} lei
                  </s>
                  <span className="product__save">−{discount}%</span>
                </>
              )}
            </div>

            <p className="lead">
              {excerpt(product.shortDescription || product.description, 220) ||
                "Produs original, livrat rapid în toată România. Destinat utilizării de către medici și personal medical calificat."}
            </p>

            {specs.length > 0 && (
              <ul className="promo__bullets">
                {specs.map((s) => (
                  <li key={s.label}><i aria-hidden="true">✓</i>{s.value}</li>
                ))}
              </ul>
            )}

            <div className="hero__actions">
              <Link href={`/produse/${product.slug}`} className="btn">Vezi produsul</Link>
              {product.permalink && (
                <a className="btn btn--ghost" href={product.permalink} target="_blank" rel="noopener noreferrer">
                  Comandă acum
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
