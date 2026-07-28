import { notFound } from "next/navigation";
import Slider from "@/components/Slider";
import { getProductBySlug, formatPrice } from "@/lib/wp";

export const revalidate = 300;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return { title: product ? product.name : "Produs" };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="container section product">
      <div className="product__layout">
        <div className="product__gallery">
          {product.images.length ? (
            <Slider slides={product.images} variant="gallery" />
          ) : (
            <div className="card__placeholder" />
          )}
        </div>

        <div className="product__info">
          <h1>{product.name}</h1>
          <p className="product__price">
            {formatPrice(product)}
            {product.onSale && product.regularPrice > product.price && (
              <s className="product__old-price">
                {product.regularPrice.toLocaleString("ro-RO", { minimumFractionDigits: 2 })}{" "}
                {product.currency}
              </s>
            )}
          </p>
          <p className={`product__stock ${product.inStock ? "in" : "out"}`}>
            {product.inStock ? "În stoc" : "Stoc epuizat"}
          </p>

          {product.shortDescription && (
            <div
              className="product__short wp-content"
              dangerouslySetInnerHTML={{ __html: product.shortDescription }}
            />
          )}

          {/* comanda se finalizează deocamdată pe WordPress (coșul existent) */}
          {product.permalink && (
            <a className="btn" href={product.permalink} target="_blank" rel="noopener">
              Comandă acum
            </a>
          )}
        </div>
      </div>

      {product.description && (
        <div className="product__description wp-content"
          dangerouslySetInnerHTML={{ __html: product.description }} />
      )}
    </div>
  );
}
