import { Suspense } from "react";
import ThemeStyle from "@/components/ThemeStyle";
import ProductCard from "@/components/ProductCard";
import ProductBrowser from "@/components/ProductBrowser";
import SetupNotice from "@/components/SetupNotice";
import Breadcrumbs from "@/components/Breadcrumbs";
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

      <div className="container section">
        <Breadcrumbs items={CRUMBS} />

        <div className="section__head">
          <div className="section__head-text">
            <span className="kicker">Magazin</span>
            <h1>Produse</h1>
            <p className="lead">
              Fillere, produse de mezoterapie și cosmetice profesionale — toate
              originale, de la distribuitori autorizați.
            </p>
          </div>
        </div>

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
