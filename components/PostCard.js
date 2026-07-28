import Link from "next/link";

export default function PostCard({ post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="card">
      <div className="card__media">
        {post.image ? (
          <img src={post.image.src} alt={post.image.alt} loading="lazy" />
        ) : (
          <div className="card__placeholder" />
        )}
      </div>
      <div className="card__body">
        <h3 className="card__title" dangerouslySetInnerHTML={{ __html: post.title }} />
        <div className="card__excerpt" dangerouslySetInnerHTML={{ __html: post.excerpt }} />
      </div>
    </Link>
  );
}
