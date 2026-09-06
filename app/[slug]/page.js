// Orice pagină din WordPress (Despre, Contact, Termeni...) se servește
// automat la aceeași adresă: /despre, /contact, /termeni-si-conditii.
import { notFound } from "next/navigation";
import ThemeStyle from "@/components/ThemeStyle";
import Slider from "@/components/Slider";
import Breadcrumbs from "@/components/Breadcrumbs";
import Link from "next/link";
import { getPage, getPages, imagesFromHtml, excerpt } from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { img, srcSet } from "@/lib/img";
import { pageMeta, breadcrumbLd, JsonLd } from "@/lib/seo";

export const revalidate = 300;

// Adresele la care trimit meniul si subsolul. Daca importul din WordPress
// nu reuseste (asa cum s-a intamplat deja o data), toate astea ar da 404 si
// jumatate din navigatie ar fi moarta. Pentru ele afisam o pagina de
// asteptare, neindexata, in loc de eroare.
const LEGATURI_CUNOSCUTE = new Map(
  [...siteConfig.nav, ...siteConfig.footer.flatMap((c) => c.links)]
    .filter((l) => l.href.startsWith("/") && !l.href.includes("?") && l.href !== "/")
    .map((l) => [l.href.replace(/^\//, ""), l.label])
);

export async function generateStaticParams() {
  const pages = await getPages();
  return pages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) {
    const label = LEGATURI_CUNOSCUTE.get(slug);
    return pageMeta({ title: label || "Pagină negăsită", path: `/${slug}`, noIndex: true });
  }

  return pageMeta({
    title: page.title,
    description: excerpt(page.excerpt || page.content, 155),
    path: `/${page.slug}`,
    image: page.image?.src,
  });
}

export default async function WpPage({ params }) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) {
    const label = LEGATURI_CUNOSCUTE.get(slug);
    if (!label) notFound();
    return <PaginaInPregatire slug={slug} titlu={label} />;
  }

  const gallery = imagesFromHtml(page.content);
  const slides = gallery.map((g) => ({
    src: img(g.src, { w: 1000 }),
    srcSet: srcSet(g.src, [500, 800, 1200]),
    thumb: img(g.src, { w: 160, h: 160, fit: "contain" }),
    alt: g.alt || page.title,
  }));

  const crumbs = [{ href: "/", label: "Acasă" }, { label: page.title }];

  return (
    <>
      <ThemeStyle seed={page.slug} />
      <JsonLd data={breadcrumbLd(crumbs)} />

      <div className="container section">
        <article className="article">
          <Breadcrumbs items={crumbs} />

          <header className="article__head">
            <h1>{page.title}</h1>
          </header>

          {slides.length > 1 && (
            <Slider slides={slides} variant="gallery" thumbs sizes="(max-width: 780px) 100vw, 780px" />
          )}

          <div className="wp-content" dangerouslySetInnerHTML={{ __html: page.content }} />
        </article>
      </div>
    </>
  );
}

// Pagina de rezerva pentru o adresa din meniu sau subsol al carei continut nu
// a venit din WordPress. Nu inventam text: spunem ce se intampla si trimitem
// omul unde poate ajunge. Neindexata, ca sa nu intre asa in Google.
function PaginaInPregatire({ slug, titlu }) {
  return (
    <>
      <ThemeStyle seed={slug} />
      <div className="container section">
        <article className="article">
          <Breadcrumbs items={[{ href: "/", label: "Acasă" }, { label: titlu }]} />
          <header className="article__head">
            <h1>{titlu}</h1>
          </header>
          <p className="lead">
            Pagina aceasta se pregătește. Până atunci, îți stăm la dispoziție
            pentru orice întrebare despre produse, comenzi sau livrare.
          </p>
          <p className="muted">
            {siteConfig.company.legalName} · CUI {siteConfig.company.cui} ·{" "}
            {siteConfig.company.address.street}, {siteConfig.company.address.region}
          </p>
          <p>
            <Link href="/produse" className="btn">Vezi produsele</Link>
          </p>
        </article>
      </div>
    </>
  );
}
