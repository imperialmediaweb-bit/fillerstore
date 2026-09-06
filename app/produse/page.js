import { Suspense } from "react";
import Link from "next/link";
import ThemeStyle from "@/components/ThemeStyle";
import ProductCard from "@/components/ProductCard";
import ProductBrowser from "@/components/ProductBrowser";
import SetupNotice from "@/components/SetupNotice";
import PageHead from "@/components/PageHead";
import Newsletter from "@/components/Newsletter";
import { getProducts, getCategories } from "@/lib/content";
import { wpConfigured } from "@/lib/wp";
import { HUES } from "@/lib/theme";
import { pageMeta, breadcrumbLd, itemListLd, JsonLd } from "@/lib/seo";

export const revalidate = 300;

export const metadata = pageMeta({
  title: "Produse",
  description:
    "Toate produsele Filler Store: fillere cu acid hialuronic, produse de mezoterapie, creme anestezice și cosmetice profesionale pentru clinici și saloane.",
  path: "/produse",
});

const CRUMBS = [{ href: "/", label: "Acasă" }, { label: "Produse" }];

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  // Cardurile se randează aici, pe server, și se trimit gata făcute către
  // componenta de filtrare — așa descrierile și harta pozelor nu ajung în browser.
  const items = products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    categories: (p.categories || []).map((c) => c.slug || c),
    node: <ProductCard product={p} />,
  }));

  return (
    <>
      <ThemeStyle seed={HUES.products} />
      <JsonLd data={breadcrumbLd(CRUMBS)} />
      <JsonLd data={itemListLd(products)} />

      <PageHead
        kicker="Magazin"
        title="Produse pentru clinici și saloane"
        lead="Fillere, produse de mezoterapie și cosmetice profesionale — toate originale, de la distribuitori autorizați, cu trasabilitate completă."
        crumbs={CRUMBS}
        facts={[
          { value: `${products.length}`, label: products.length === 1 ? "produs în stoc" : "produse în stoc" },
          { value: "48–72 h", label: "livrare în toată țara" },
          { value: "100%", label: "produse originale" },
        ]}
      >
        {categories.length > 0 && (
          <div className="pagehead__links">
            {categories.map((c) => (
              <Link key={c.slug} href={`/produse?categorie=${c.slug}`}>
                {c.name} <b>{c.count}</b>
              </Link>
            ))}
          </div>
        )}
      </PageHead>

      <div className="container section">
        {products.length ? (
          <Suspense fallback={<div className="grid">{items.map((it) => <div key={it.id}>{it.node}</div>)}</div>}>
            <ProductBrowser items={items} categories={categories} />
          </Suspense>
        ) : (
          <SetupNotice configured={wpConfigured()} />
        )}
      </div>

      <Newsletter />
    </>
  );
}
