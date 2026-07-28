import Link from "next/link";
import { formatPrice } from "@/lib/wp";

export default function ProductCard({ product }) {
  const img = product.images[0];
  return (
    <Link href={`/produse/${product.slug}`} className="card">
      <div className="card__media">
        {img ? <img src={img.src} alt={img.alt} loading="lazy" /> : <div className="card__placeholder" />}
        {product.onSale && <span className="card__badge">Reducere</span>}
      </div>
      <div className="card__body">
        <h3 className="card__title">{product.name}</h3>
        <p className="card__price">{formatPrice(product)}</p>
      </div>
    </Link>
  );
}
