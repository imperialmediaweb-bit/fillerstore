import ChaptersNav from "@/components/ChaptersNav";
import Reveal from "@/components/Reveal";

// Textul lung al unei pagini, așezat pe capitole: cuprins lipicios în
// stânga, capitole numerotate în dreapta, listele ca bife pe două coloane.
// Înainte, textul din WordPress era vărsat într-o singură coloană — 40 de
// ecrane de paragrafe fără niciun reper.

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

export default function Chapters({ intro = [], chapters = [], kicker = "Cuprins" }) {
  if (!intro.length && !chapters.length) return null;
  const cuCuprins = chapters.length >= 3;

  return (
    <div className={`chapters${cuCuprins ? " chapters--nav" : ""}`}>
      {cuCuprins && (
        <ChaptersNav kicker={kicker} items={chapters.map((c) => ({ id: c.id, title: c.title }))} />
      )}

      <div className="chapters__body">
        {intro.length > 0 && (
          <Reveal className="chapter chapter--intro">
            {intro.map((b, i) => <Bloc key={i} b={b} />)}
          </Reveal>
        )}

        {chapters.map((c, i) => (
          <Reveal key={c.id} as="article" className="chapter" id={c.id}>
            <header className="chapter__head">
              <span className="chapter__num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <h2 dangerouslySetInnerHTML={{ __html: c.html }} />
            </header>
            <div className="chapter__body">
              {c.blocks.map((b, j) => <Bloc key={j} b={b} />)}
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
