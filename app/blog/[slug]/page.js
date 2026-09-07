import Link from "next/link";
import { notFound } from "next/navigation";
import ThemeStyle from "@/components/ThemeStyle";
import PostCard from "@/components/PostCard";
import PageHead from "@/components/PageHead";
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

  // Coperta: poza principală a articolului sau, dacă lipsește, prima din
  // text. Restul pozelor rămân în text, la locul lor — un articol se
  // citește cu pozele lângă paragrafele lor, nu cu toate într-un slider sus.
  // Înainte, aceeași poză apărea de două ori: în slider și în corp.
  const inText = imagesFromHtml(post.content);
  const cover = post.image || inText[0] || null;
  let body = post.content;
  if (cover && !post.image) {
    // scoatem din text doar eticheta <img> a copertei, cautand-o dupa adresa
    body = body.replace(/<img[^>]*>/gi, (tag) => (tag.includes(cover.src) ? "" : tag));
  }
  const categorie = post.categories?.[0]?.name || "Blog";
  const data = new Date(post.date).toLocaleDateString("ro-RO", { day: "numeric", month: "long", year: "numeric" });

  const crumbs = [{ href: "/", label: "Acasă" }, { href: "/blog", label: "Blog" }, { label: post.title }];

  return (
    <>
      <ThemeStyle seed={post.slug} />
      <ReadProgress />
      <JsonLd data={articleLd(post)} />
      <JsonLd data={breadcrumbLd(crumbs)} />

      <PageHead
        kicker={`Blog · ${categorie}`}
        title={post.title}
        crumbs={crumbs}
        facts={[
          { value: data, label: "publicat" },
          { value: `${readingTime(post.content)} min`, label: "timp de citire" },
        ]}
      />

      <div className="container section">
        <article className="article article--post">
          {cover && (
            <img
              className="article__cover"
              src={img(cover.src, { w: 1400, h: 800 })}
              srcSet={srcSet(cover.src, [700, 1000, 1400])}
              sizes="(max-width: 820px) 100vw, 780px"
              alt={cover.alt || post.title}
              loading="eager"
              decoding="async"
            />
          )}
          <div className="wp-content" dangerouslySetInnerHTML={{ __html: body }} />
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
