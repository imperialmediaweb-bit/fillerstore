import Link from "next/link";
import CategoryIcon from "@/components/CategoryIcon";

// Plăcile de categorie.
//
// Fără fotografie, intenționat. Pozele de categorie din WordPress lipsesc de
// la adresele salvate, iar decupajele de produs sunt pe fundal alb: peste un
// panou colorat ori ies ca un dreptunghi alb, ori, amestecate, se spală de
// tot. Aici contează navigarea, nu vânzarea — deci fiecare categorie e o
// placă tipografică, cu inițiala ei gravată în aramă și tonul ei de culoare.
// Fotografiile mari rămân unde își fac treaba: hero, banda foto, „Despre",
// grila de produse.
export default function CategoryBento({ categories = [], promo }) {
  const list = categories.filter((c) => c?.slug).slice(0, 5);
  if (!list.length) return null;

  // Grila cu placa mare pe doua coloane si doua randuri are nevoie de cel
  // putin patru placi ca sa se inchida. Pe magazinul live sunt doar doua
  // categorii cu produse, deci ramanea o gaura mare in coltul de jos.
  // Sub patru placi trecem pe coloane egale, unde nu are ce sa ramana gol.
  const total = list.length + (promo?.title ? 1 : 0);
  const few = total < 4;

  return (
    <div className={`vitrines${few ? " vitrines--few" : ""}`}>
      {list.map((c, i) => {
        const lead = i === 0;
        return (
          <Link
            key={c.slug}
            href={`/produse?categorie=${c.slug}`}
className={`vitrine${lead && !few ? " vitrine--lead" : ""}`}
            style={{ "--tone": c.tone ?? 340, "--lift": c.lift ?? 0 }}
          >
            <span className="vitrine__aura" aria-hidden="true" />
            <span className="vitrine__shelf" aria-hidden="true" />
            <span className="vitrine__badge" aria-hidden="true">
              <CategoryIcon slug={c.slug} />
            </span>
            <span className="vitrine__mono" aria-hidden="true">{c.name?.[0] || "F"}</span>
            <span className="vitrine__plate">
              <span className="vitrine__eyebrow">
                {c.count} {c.count === 1 ? "produs" : "produse"}
              </span>
              <span className="vitrine__title">{c.name}</span>
              {(lead || few) && c.description && <span className="vitrine__text">{c.description}</span>}
            </span>
            <span className="vitrine__go" aria-hidden="true">→</span>
          </Link>
        );
      })}

      {promo?.title && (
        <div className="vitrine vitrine--promo">
          <span className="vitrine__aura" aria-hidden="true" />
          <span className="vitrine__badge" aria-hidden="true">
            <CategoryIcon slug="promo" />
          </span>
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
