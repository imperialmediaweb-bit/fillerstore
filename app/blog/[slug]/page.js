import Link from "next/link";
import { notFound } from "next/navigation";
import ThemeStyle from "@/components/ThemeStyle";
import Slider from "@/components/Slider";
import PostCard from "@/components/PostCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import ReadProgress from "@/components/ReadProgress";
import Reveal from "@/components/Reveal";
import Newsletter from "@/components/Newsletter";
import { getPost, getPosts, getRelatedPosts, imagesFromHtml, excerpt, readingTime } from "@/lib/content";
import { img, srcSet } from "@/lib/img";
import { pageMeta, articleLd, breadcrumbLd, JsonLd } from "@/lib/seo";

export const revalidate = 300;

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return pageMeta({ title: "Articol negăsit", path: `/blog/${slug}`, noIndex: true });

  return pageMeta({
    title: post.title,
    description: excerpt(post.excerpt || post.content, 155),
    path: `/blog/${post.slug}`,
    image: post.image?.src,
    type: "article",
    publishedTime: post.date,
    modifiedTime: post.modified || post.date,
  });
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post, 3);

  // galeria articolului: poza principală + pozele din corpul textului
  const gallery = imagesFromHtml(post.content);
  if (post.image && !gallery.some((g) => g.src === post.image.src)) gallery.unshift(post.image);
  const slides = gallery.map((g) => ({
    src: img(g.src, { w: 1000 }),
    srcSet: srcSet(g.src, [500, 800, 1200]),
    thumb: img(g.src, { w: 160, h: 160, fit: "contain" }),
    alt: g.alt || post.title,
  }));

  const crumbs = [{ href: "/", label: "Acasă" }, { href: "/blog", label: "Blog" }, { label: post.title }];

  return (
    <>
      <ThemeStyle seed={post.slug} />
      <ReadProgress />
      <JsonLd data={articleLd(post)} />
      <JsonLd data={breadcrumbLd(crumbs)} />

      <div className="container section">
        <article className="article article--post">
          <Breadcrumbs items={crumbs} />

          <header className="article__head">
            <span className="kicker">Blog</span>
            <h1>{post.title}</h1>
            <div className="article__meta">
              <span>
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("ro-RO", { day: "numeric", month: "long", year: "numeric" })}
                </time>
              </span>
              <span>{readingTime(post.content)} min de citit</span>
            </div>
          </header>

          {slides.length > 1 ? (
            <Slider slides={slides} variant="gallery" thumbs sizes="(max-width: 780px) 100vw, 780px" priority />
          ) : slides.length === 1 ? (
            <img
              className="article__cover"
              src={slides[0].src}
              srcSet={slides[0].srcSet}
              sizes="(max-width: 780px) 100vw, 780px"
              alt={slides[0].alt}
              loading="eager"
              decoding="async"
            />
          ) : null}

          <div className="wp-content" dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
      </div>

      {related.length > 0 && (
        <section className="container section">
          <Reveal className="section__head">
            <div className="section__head-text">
              <span className="kicker">Mai departe</span>
              <h2>Alte articole</h2>
            </div>
            <Link href="/blog" className="arrow-link">
              <span>Tot blogul</span><span aria-hidden="true">→</span>
            </Link>
          </Reveal>
          <div className="grid grid--3">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={i * 70}>
                <PostCard post={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <Newsletter />
    </>
  );
}
