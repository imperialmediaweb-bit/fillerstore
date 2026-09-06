import Link from "next/link";
import { formatPrice, discountPercent } from "@/lib/content";
import { img, srcSet } from "@/lib/img";

// Rând compact de produs, pentru listele înguste de lângă o promoție.
export default function ProductRow({ product }) {
  const photo = product.images?.[0];
  const discount = discountPercent(product);

  return (
    <Link href={`/produse/${product.slug}`} className="prow">
      <span className="prow__media">
        {photo ? (
          <img
            src={img(photo.src, { w: 160, h: 160, fit: "contain" })}
            srcSet={srcSet(photo.src, [120, 180, 240])}
            sizes="72px"
            alt={photo.alt || product.name}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className="card__placeholder" />
        )}
      </span>
      <span className="prow__body">
        <span className="prow__title">{product.name}</span>
        <span className="prow__price">
          {formatPrice(product)}
          {discount > 0 && <s>{product.regularPrice.toLocaleString("ro-RO", { minimumFractionDigits: 2 })} lei</s>}
        </span>
      </span>
      <span className="prow__go" aria-hidden="true">→</span>
    </Link>
  );
}
