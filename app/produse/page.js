import ProductCard from "@/components/ProductCard";
import SetupNotice from "@/components/SetupNotice";
import { getProducts, wpConfigured } from "@/lib/wp";

export const revalidate = 300;

export const metadata = { title: "Produse" };

export default async function ProductsPage() {
  const products = await getProducts({ perPage: 48 });

  return (
    <div className="container section">
      <h1>Produse</h1>
      {products.length ? (
        <div className="grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <SetupNotice configured={wpConfigured()} />
      )}
    </div>
  );
}
