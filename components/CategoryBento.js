import Link from "next/link";
import { img, srcSet } from "@/lib/img";

// Vitrinele de categorie.
//
// Nu ne mai bazăm pe o fotografie de categorie din WordPress (multe lipsesc
// și lăsau în loc un dreptunghi gri). Fiecare vitrină e un panou colorat
// propriu, cu produsul real din categoria aia așezat deasupra, ca într-un
// display de magazin. Arată la fel de bine și dacă poza lipsește de tot.
export default function CategoryBento({ categories = [], promo }) {
  const list = categories.filter((c) => c?.slug).slice(0, 5);
  if (!list.length) return null;

  return (
    <div className="vitrines">
      {list.map((c, i) => {
        const photo = c.photo || c.image?.src || null;
        const lead = i === 0;
        return (
          <Link
            key={c.slug}
            href={`/produse?categorie=${c.slug}`}
            className={`vitrine${lead ? " vitrine--lead" : ""}`}
            style={{ "--tone": c.tone ?? 331 }}
          >
            <span className="vitrine__aura" aria-hidden="true" />
            <span className="vitrine__shelf" aria-hidden="true" />
            <span className="vitrine__mono" aria-hidden="true">{c.name?.[0] || "F"}</span>
            <span className="vitrine__art">
              {photo && (
                <img
                  src={img(photo, { w: lead ? 620 : 420, fit: "contain" })}
                  srcSet={srcSet(photo, [280, 420, 620])}
                  sizes={lead ? "(max-width: 900px) 60vw, 340px" : "(max-width: 900px) 40vw, 200px"}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              )}
            </span>
            <span className="vitrine__plate">
              <span className="vitrine__eyebrow">
                {c.count} {c.count === 1 ? "produs" : "produse"}
              </span>
              <span className="vitrine__title">{c.name}</span>
              {lead && c.description && <span className="vitrine__text">{c.description}</span>}
              <span className="vitrine__go" aria-hidden="true">→</span>
            </span>
          </Link>
        );
      })}

      {promo?.title && (
        <div className="vitrine vitrine--promo">
          <span className="vitrine__aura" aria-hidden="true" />
          <span className="vitrine__plate">
            {promo.kicker && <span className="vitrine__eyebrow">{promo.kicker}</span>}
            <span className="vitrine__title">{promo.title}</span>
            {promo.text && <span className="vitrine__text">{promo.text}</span>}
            {promo.href && (
              <Link href={promo.href} className="btn btn--sm btn--light">
                {promo.label || "Vezi oferta"}
              </Link>
            )}
          </span>
        </div>
      )}
    </div>
  );
}
