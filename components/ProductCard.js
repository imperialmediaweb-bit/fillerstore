import Link from "next/link";
import { formatPrice, discountPercent } from "@/lib/content";
import { img, srcSet, dimensions } from "@/lib/img";

export default function ProductCard({ product, priority = false }) {
  const photo = product.images?.[0];
  const discount = discountPercent(product);
  const { width, height } = photo ? dimensions(photo.src) : {};

  return (
    <Link href={`/produse/${product.slug}`} className="card">
      <div className="card__media">
        {photo ? (
          <img
            src={img(photo.src, { w: 500, h: 500 })}
            srcSet={srcSet(photo.src, [300, 500, 700])}
            sizes="(max-width: 640px) 50vw, 260px"
            alt={photo.alt || product.name}
            width={width}
            height={height}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
          />
        ) : (
          <div className="card__placeholder" />
        )}
        {discount > 0 && <span className="card__badge">−{discount}%</span>}
        {!product.inStock && <span className="card__badge card__badge--out">Stoc epuizat</span>}
        <div className="card__hover"><span>Vezi produsul</span></div>
      </div>

      <div className="card__body">
        {product.categories?.[0] && (
          <span className="card__eyebrow">{product.categories[0].name || product.categories[0]}</span>
        )}
        <h2 className="card__title">{product.name}</h2>
        <div className="card__foot">
          <span className="card__price">
            {formatPrice(product)}
            {discount > 0 && (
              <s>
                {product.regularPrice.toLocaleString("ro-RO", { minimumFractionDigits: 2 })}{" "}
                {product.currencySymbol || "lei"}
              </s>
            )}
          </span>
        </div>
      </div>
    </Link>
  );
}
