import Link from "next/link";
import { img, srcSet } from "@/lib/img";

// O singură fotografie pe toată lățimea, cu un text scurt peste ea.
// Rolul ei e de pauză între secțiuni — pagina respiră și nu mai pare
// un șir lung de carduri.
export default function PhotoBand({ image, kicker, title, text, cta, priority = false }) {
  if (!image) return null;

  return (
    <section className="photoband">
      <img
        src={img(image, { w: 2000, h: 900 })}
        srcSet={srcSet(image, [900, 1400, 2000])}
        sizes="100vw"
        alt=""
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
      <div className="photoband__body">
        {kicker && <span className="kicker">{kicker}</span>}
        {title && <h2 className="photoband__title">{title}</h2>}
        {text && <p className="photoband__text">{text}</p>}
        {cta?.href && (
          <Link href={cta.href} className="btn btn--light">
            {cta.label}
          </Link>
        )}
      </div>
    </section>
  );
}
