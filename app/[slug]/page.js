// Orice pagină WordPress (Despre noi, Contact, Termeni etc.) se servește
// automat la aceeași adresă: /despre-noi, /contact, ...
import { notFound } from "next/navigation";
import Slider from "@/components/Slider";
import { getPageBySlug, imagesFromHtml } from "@/lib/wp";

export const revalidate = 300;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  return { title: page ? page.title.replace(/<[^>]+>/g, "") : "Pagină" };
}

export default async function WpPage({ params }) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) notFound();

  const gallery = imagesFromHtml(page.content);

  return (
    <article className="container section article">
      <h1 dangerouslySetInnerHTML={{ __html: page.title }} />
      {gallery.length > 1 && <Slider slides={gallery} variant="gallery" />}
      <div className="wp-content" dangerouslySetInnerHTML={{ __html: page.content }} />
    </article>
  );
}
