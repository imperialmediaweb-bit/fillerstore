import Link from "next/link";
import { excerpt, readingTime } from "@/lib/content";
import { img, srcSet, dimensions } from "@/lib/img";

export default function PostCard({ post, priority = false }) {
  const { width, height } = post.image ? dimensions(post.image.src) : {};
  const date = new Date(post.date);

  return (
    <Link href={`/blog/${post.slug}`} className="card">
      <div className="card__media">
        {post.image ? (
          <img
            src={img(post.image.src, { w: 640, h: 400 })}
            srcSet={srcSet(post.image.src, [400, 640, 900])}
            sizes="(max-width: 720px) 100vw, 340px"
            alt={post.image.alt || post.title}
            width={width}
            height={height}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
          />
        ) : (
          <div className="card__placeholder" />
        )}
      </div>

      <div className="card__body">
        <span className="card__eyebrow">
          <time dateTime={post.date}>
            {date.toLocaleDateString("ro-RO", { day: "numeric", month: "long", year: "numeric" })}
          </time>
          {" · "}
          {readingTime(post.content)} min
        </span>
        <h2 className="card__title">{post.title}</h2>
        <p className="card__excerpt">{excerpt(post.excerpt || post.content, 150)}</p>
      </div>
    </Link>
  );
}
