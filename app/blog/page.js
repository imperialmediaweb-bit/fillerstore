import Link from "next/link";
import ThemeStyle from "@/components/ThemeStyle";
import PostCard from "@/components/PostCard";
import SetupNotice from "@/components/SetupNotice";
import PageHead from "@/components/PageHead";
import Newsletter from "@/components/Newsletter";
import Reveal from "@/components/Reveal";
import { getPosts, excerpt, readingTime } from "@/lib/content";
import { img, srcSet } from "@/lib/img";
import { wpConfigured } from "@/lib/wp";
import { HUES } from "@/lib/theme";
import { pageMeta, breadcrumbLd, JsonLd } from "@/lib/seo";

export const revalidate = 300;

export const metadata = pageMeta({
  title: "Blog",
  description:
    "Articole despre fillere, acid hialuronic, mezoterapie și îngrijirea pielii — informații utile pentru profesioniștii din estetică.",
  path: "/blog",
});

const CRUMBS = [{ href: "/", label: "Acasă" }, { label: "Blog" }];

export default async function BlogPage() {
  const posts = await getPosts();
  const [lead, ...rest] = posts;

  return (
    <>
      <ThemeStyle seed={HUES.blog} />
      <JsonLd data={breadcrumbLd(CRUMBS)} />

      <PageHead
        kicker="Blog"
        title="Articole și noutăți din estetică"
        lead="Ce trebuie să știi despre fillere, acid hialuronic și tratamentele estetice — explicat pe înțeles, fără marketing gol."
        crumbs={CRUMBS}
        facts={posts.length ? [
          { value: `${posts.length}`, label: posts.length === 1 ? "articol" : "articole" },
          { value: "2–6 min", label: "timp de citire" },
        ] : []}
      />

      <div className="container section">
        {posts.length ? (
          <>
            {lead && (
              <Reveal>
                <Link href={`/blog/${lead.slug}`} className="feature">
                  <div className="feature__media">
                    {lead.image ? (
                      <img
                        src={img(lead.image.src, { w: 900, h: 700 })}
                        srcSet={srcSet(lead.image.src, [600, 900, 1300])}
                        sizes="(max-width: 860px) 100vw, 640px"
                        alt={lead.image.alt || lead.title}
                        loading="eager"
                        decoding="async"
                      />
                    ) : (
                      <div className="card__placeholder" />
                    )}
                  </div>
                  <div className="feature__body">
                    <span className="kicker">Cel mai recent</span>
                    <h2>{lead.title}</h2>
                    <p className="lead">{excerpt(lead.excerpt || lead.content, 210)}</p>
                    <p className="muted" style={{ fontSize: "0.88rem" }}>
                      <time dateTime={lead.date}>
                        {new Date(lead.date).toLocaleDateString("ro-RO", { day: "numeric", month: "long", year: "numeric" })}
                      </time>
                      {" · "}{readingTime(lead.content)} min de citit
                    </p>
                    <span className="arrow-link">
                      <span>Citește articolul</span><span aria-hidden="true">→</span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            )}

            {rest.length > 0 && (
              <div className="grid grid--3" style={{ marginTop: "clamp(26px, 4vw, 48px)" }}>
                {rest.map((p, i) => (
                  <Reveal key={p.id} delay={i * 60}>
                    <PostCard post={p} />
                  </Reveal>
                ))}
              </div>
            )}
          </>
        ) : (
          <SetupNotice configured={wpConfigured()} />
        )}
      </div>

      <Newsletter />
    </>
  );
}
