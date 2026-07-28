import { notFound } from "next/navigation";
import Slider from "@/components/Slider";
import { getPostBySlug, imagesFromHtml } from "@/lib/wp";

export const revalidate = 300;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  return { title: post ? post.title.replace(/<[^>]+>/g, "") : "Articol" };
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  // slider din pozele articolului (galeria din corpul textului + poza principală)
  const gallery = imagesFromHtml(post.content);
  if (post.image && !gallery.some((g) => g.src === post.image.src)) {
    gallery.unshift(post.image);
  }

  return (
    <article className="container section article">
      <h1 dangerouslySetInnerHTML={{ __html: post.title }} />
      <p className="article__date">
        {new Date(post.date).toLocaleDateString("ro-RO", {
          day: "numeric", month: "long", year: "numeric",
        })}
      </p>

      {gallery.length > 1 && <Slider slides={gallery} variant="gallery" />}
      {gallery.length === 1 && <img className="article__cover" src={gallery[0].src} alt="" />}

      <div className="wp-content" dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
