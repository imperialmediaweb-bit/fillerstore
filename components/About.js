import Link from "next/link";
import about from "@/content/about.json";
import { img, srcSet } from "@/lib/img";

// Secțiunea „cine suntem": text pe o parte, fotografie pe cealaltă.
// Se configurează în content/about.json; dacă `enabled` e false, dispare.
export default function About() {
  if (!about?.enabled || !about.title) return null;

  return (
    <section className="container section">
      <div className="about">
        {about.image && (
          <figure className="about__media">
            <img
              src={img(about.image, { w: 900, h: 1000 })}
              srcSet={srcSet(about.image, [500, 800, 1100])}
              sizes="(max-width: 900px) 100vw, 460px"
              alt={about.imageAlt || ""}
              loading="lazy"
              decoding="async"
            />
          </figure>
        )}

        <div className="about__copy">
          {about.kicker && <span className="kicker">{about.kicker}</span>}
          <h2>{about.title}</h2>
          {about.paragraphs?.map((text, i) => (
            <p key={i} className={i === 0 ? "lead" : undefined}>{text}</p>
          ))}

          {about.highlights?.length > 0 && (
            <dl className="about__highlights">
              {about.highlights.map((h) => (
                <div key={h.label}>
                  <dt>{h.value}</dt>
                  <dd>{h.label}</dd>
                </div>
              ))}
            </dl>
          )}

          {about.cta?.href && (
            <Link href={about.cta.href} className="arrow-link">
              <span>{about.cta.label}</span><span aria-hidden="true">→</span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
