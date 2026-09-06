import Link from "next/link";
import promo from "@/content/promo.json";
import { img, srcSet } from "@/lib/img";
import { findAnyMedia } from "@/lib/media";
import Spotlight from "@/components/effects/Spotlight";

// Banda de promovare a unui brand sau a unei game (echivalentul benzii
// Revolax de pe site-ul actual). Se configurează în content/promo.json;
// dacă `enabled` e false, nu se afișează.
export default function PromoBand() {
  if (!promo?.enabled || !promo.title) return null;

  // dacă poza nu e pusă în promo.json, o căutăm în biblioteca media după
  // cuvintele din titlu (pozele din WordPress poartă numele secțiunii)
  const keywords = promo.title.split(/\s+/).filter((w) => w.length > 4).slice(0, 3);
  const auto = promo.image ? null : findAnyMedia(keywords.map((k) => [k]), { exclude: ["logo", "icon"] });
  const image = promo.image || auto?.src || "";

  return (
    <Spotlight>
      <section className="band--deep">
        <div className="container section">
          <div className="promo">
          <div className="promo__copy">
            {promo.kicker && <span className="kicker">{promo.kicker}</span>}
            <h2>{promo.title}</h2>
            {promo.text && <p className="lead">{promo.text}</p>}

            {promo.bullets?.length > 0 && (
              <ul className="promo__bullets">
                {promo.bullets.map((b) => (
                  <li key={b}><i aria-hidden="true">✓</i>{b}</li>
                ))}
              </ul>
            )}

            {promo.cta?.href && (
              <Link href={promo.cta.href} className="btn">{promo.cta.label || "Vezi produsele"}</Link>
            )}
          </div>

          {image && (
            <div className="promo__media beam">
              <img
                src={img(image, { w: 800, h: 900 })}
                srcSet={srcSet(image, [500, 800, 1100])}
                sizes="(max-width: 900px) 100vw, 440px"
                alt={auto?.alt || ""}
                loading="lazy"
                decoding="async"
              />
            </div>
          )}
          </div>
        </div>
      </section>
    </Spotlight>
  );
}
