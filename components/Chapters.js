import Link from "next/link";
import { img, srcSet } from "@/lib/img";
import { Fragment } from "react";
import ChaptersNav from "@/components/ChaptersNav";
import Reveal from "@/components/Reveal";

// Textul lung al unei pagini, așezat pe capitole: cuprins lipicios în
// stânga, capitole numerotate în dreapta, listele ca bife pe două coloane.
//
// Coloana de citit are o lățime fixă, de carte. Fără nimic în stânga ei,
// jumătate din ecran rămânea alb — exact „spațiul mort" de care ne plângem
// peste tot. Așa că bara din stânga se arată de la două capitole în sus și
// duce, sub cuprins, și o cutie cu ce poate face omul mai departe.

function Bloc({ b }) {
  if (b.type === "h") {
    const Tag = b.level >= 4 ? "h4" : "h3";
    return <Tag className="chapter__sub" dangerouslySetInnerHTML={{ __html: b.html }} />;
  }
  if (b.type === "p") return <p dangerouslySetInnerHTML={{ __html: b.html }} />;
  if (b.type === "quote") return <blockquote className="chapter__quote" dangerouslySetInnerHTML={{ __html: b.html }} />;
  if (b.type === "list") {
    const Tag = b.ordered ? "ol" : "ul";
    return (
      <Tag className={`checks${b.ordered ? " checks--ordered" : ""}`}>
        {b.items.map((it, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: it.html }} />
        ))}
      </Tag>
    );
  }
  return null;
}

export default function Chapters({ intro = [], chapters = [], kicker = "Cuprins", aside, photos = [] }) {
  if (!intro.length && !chapters.length) return null;
  const cuBara = chapters.length >= 2;

  return (
    <div className={`chapters${cuBara ? " chapters--nav" : ""}`}>
      {cuBara && (
        <div className="chapters__rail">
          <ChaptersNav kicker={kicker} items={chapters.map((c) => ({ id: c.id, title: c.title }))} />
          {aside?.text && (
            <aside className="chapters__aside">
              {aside.title && <strong>{aside.title}</strong>}
              <p>{aside.text}</p>
              {aside.actions?.map((a) => (
                <Link key={a.href} href={a.href} className={a.primary ? "btn btn--sm" : "arrow-link"}>
                  {a.primary ? a.label : (<><span>{a.label}</span><span aria-hidden="true">→</span></>)}
                </Link>
              ))}
            </aside>
          )}
        </div>
      )}

      <div className="chapters__body">
        {intro.length > 0 && (
          <Reveal className="chapter chapter--intro">
            {intro.map((b, i) => <Bloc key={i} b={b} />)}
          </Reveal>
        )}

        {chapters.map((c, i) => {
          // Fotografia dintre capitole: mai lată decât coloana de citit, ca
          // pagina să respire între blocurile de text. Nu punem una după
          // ultimul capitol — ar rămâne agățată deasupra subsolului.
          const poza = i < chapters.length - 1 ? photos[i] : null;
          return (
            <Fragment key={c.id}>
              <Reveal as="article" className="chapter" id={c.id}>
                <header className="chapter__head">
                  <span className="chapter__num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <h2 dangerouslySetInnerHTML={{ __html: c.html }} />
                </header>
                <div className="chapter__body">
                  {c.blocks.map((b, j) => <Bloc key={j} b={b} />)}
                </div>
              </Reveal>

              {poza?.src && (
                <Reveal as="figure" className={`chapter__figure${i % 2 ? " chapter__figure--tall" : ""}`}>
                  <img
                    src={img(poza.src, { w: 1200, h: i % 2 ? 900 : 620 })}
                    srcSet={srcSet(poza.src, [600, 900, 1200])}
                    sizes="(max-width: 980px) 100vw, 860px"
                    alt={poza.alt || ""}
                    loading="lazy"
                    decoding="async"
                  />
                </Reveal>
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
