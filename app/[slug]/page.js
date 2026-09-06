// Orice pagină din WordPress (Despre, Contact, Termeni...) se servește
// automat la aceeași adresă: /despre, /contact, /termeni-si-conditii.
import { notFound } from "next/navigation";
import ThemeStyle from "@/components/ThemeStyle";
import Slider from "@/components/Slider";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getPage, getPages, imagesFromHtml, excerpt } from "@/lib/content";
import { img, srcSet } from "@/lib/img";
import { pageMeta, breadcrumbLd, JsonLd } from "@/lib/seo";

export const revalidate = 300;

export async function generateStaticParams() {
  const pages = await getPages();
  return pages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) return pageMeta({ title: "Pagină negăsită", path: `/${slug}`, noIndex: true });

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
  if (!page) notFound();

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
