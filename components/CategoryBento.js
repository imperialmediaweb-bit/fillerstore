import Link from "next/link";
import { img, srcSet } from "@/lib/img";

// Grila de categorii, în format „bento": prima categorie ocupă o celulă
// mare, restul se așază în jurul ei. Layout asimetric, dar generat automat
// din câte categorii există — nu trebuie configurat nimic.
export default function CategoryBento({ categories = [], promo }) {
  const list = categories.filter((c) => c?.slug).slice(0, 5);
  if (list.length < 2) return null;

  return (
    <div className="bento">
      {list.map((c, i) => (
        <Link
          key={c.slug}
          href={`/produse?categorie=${c.slug}`}
          className={`bento__cell${i === 0 ? " bento__cell--lead" : ""}`}
        >
          {c.image?.src ? (
            <img
              src={img(c.image.src, { w: i === 0 ? 900 : 500, h: i === 0 ? 700 : 400 })}
              srcSet={srcSet(c.image.src, [400, 700, 1000])}
              sizes={i === 0 ? "(max-width: 900px) 100vw, 500px" : "(max-width: 900px) 50vw, 260px"}
              alt=""
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="card__placeholder" />
          )}
          <div className="bento__body">
            <span className="bento__eyebrow">{c.count} {c.count === 1 ? "produs" : "produse"}</span>
            <h3>{c.name}</h3>
            <span className="bento__go" aria-hidden="true">→</span>
          </div>
        </Link>
      ))}

      {promo?.title && (
        <div className="bento__cell bento__cell--promo">
          <div className="bento__body">
            {promo.kicker && <span className="bento__eyebrow">{promo.kicker}</span>}
            <h3>{promo.title}</h3>
            {promo.text && <p>{promo.text}</p>}
            {promo.href && <Link href={promo.href} className="btn btn--sm">{promo.label || "Vezi oferta"}</Link>}
          </div>
        </div>
      )}
    </div>
  );
}
