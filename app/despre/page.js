import Link from "next/link";
import ThemeStyle from "@/components/ThemeStyle";
import PageHead from "@/components/PageHead";
import PhotoBand from "@/components/PhotoBand";
import Statement from "@/components/Statement";
import BrandStrip from "@/components/BrandStrip";
import Newsletter from "@/components/Newsletter";
import Reveal from "@/components/Reveal";
import { img, srcSet } from "@/lib/img";
import { heroSlides } from "@/lib/slides";
import { siteConfig } from "@/lib/site";
import { pageMeta, breadcrumbLd, JsonLd } from "@/lib/seo";
import PhotoGrid from "@/components/PhotoGrid";
import { aboutPage } from "@/lib/pagePhotos";
import about from "@/content/about.json";

export const revalidate = 300;

export const metadata = pageMeta({
  title: "Despre noi",
  description:
    "Filler Store este furnizor de produse estetice pentru saloane și clinici din România: fillere cu acid hialuronic, mezoterapie și dermato-cosmetice, de la distribuitori autorizați.",
  path: "/despre",
});

const CRUMBS = [{ href: "/", label: "Acasă" }, { label: "Despre noi" }];

const VALORI = [
  {
    titlu: "Lucrăm doar cu distribuitori autorizați",
    text: "Fiecare lot vine cu trasabilitate completă și termen de valabilitate generos. Nu cumpărăm de pe piața paralelă, oricât ar fi diferența de preț.",
  },
  {
    titlu: "Selecție, nu catalog",
    text: "Ținem în stoc gamele pe care le folosesc clinicile serioase — Revolax, Restylane, Profhilo — nu tot ce se găsește. Mai puține produse, dar pe care le cunoaștem.",
  },
  {
    titlu: "Consiliere de la oameni din domeniu",
    text: "Întrebările despre protocol, zone de injectare sau reticulare primesc răspuns de la cineva care lucrează cu produsele, nu de la un operator care citește o fișă.",
  },
  {
    titlu: "Livrare care nu strică produsul",
    text: "Expediem în 48–72 de ore, ambalat pentru transport. Un filler ajuns deteriorat costă mai mult decât livrarea rapidă.",
  },
];

export default async function DesprePage() {
  // Pagina „Despre" din WordPress are textul și fotografiile lor reale.
  // Le folosim pe ale lor și cădem pe content/about.json doar dacă lipsesc —
  // altfel pagina asta ar acoperi conținutul propriu al magazinului.
  const wp = await aboutPage("despre");
  const toate = wp?.paragraphs?.length ? wp.paragraphs : (about.paragraphs || []);
  // Langa fotografie stau doua paragrafe. Restul textului lor — care e lung —
  // curge mai jos ca articol, pe o latime de citit, cu titlurile lui cu tot.
  // Inainte intra tot in coloana din dreapta: fotografia se termina sus, iar
  // in stanga ramanea un gol de vreo mie de pixeli.
  const paragrafe = toate.slice(0, 2);
  const restText = wp?.rest || "";
  const poze = heroSlides();
  const galerie = wp?.photos || [];
  const portret = galerie[0]?.src || about.image || null;
  const banda = galerie[1]?.src || poze[2]?.raw || poze[0]?.raw || about.image || null;

  return (
    <>
      <ThemeStyle seed="despre" />
      <JsonLd data={breadcrumbLd(CRUMBS)} />

      <PageHead
        kicker={about.kicker || "Filler Store"}
        title="Furnizorul pe care îl recomandă cabinetul de alături"
        lead="Aducem în România produsele estetice pe care profesioniștii le folosesc zi de zi — și le aducem în condițiile în care merită folosite."
        crumbs={CRUMBS}
        facts={(about.highlights || []).map((h) => ({ value: h.value, label: h.label }))}
      />

      <section className="container section">
        <div className="about">
          <Reveal className="about__media frame">
            <span className="frame__inner">
              {portret && (
                <img
                  src={img(portret, { w: 900, h: 1100 })}
                  srcSet={srcSet(portret, [500, 800, 1100])}
                  sizes="(max-width: 900px) 100vw, 480px"
                  alt={about.imageAlt || "Tratament estetic profesional"}
                  loading="eager"
                  decoding="async"
                />
              )}
            </span>
          </Reveal>

          <Reveal className="about__copy">
            <span className="kicker">Cine suntem</span>
            <h2>{(wp?.title || "").trim().length > 12 ? wp.title : (about.title || "Cine suntem și ce facem")}</h2>
            {paragrafe.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
            <p>
              <Link href="/produse" className="btn">Vezi produsele</Link>
            </p>
          </Reveal>
        </div>
      </section>

      {galerie.length > 2 && (
        <section className="container section">
          <Reveal className="section__head">
            <div className="section__head-text">
              <span className="kicker">Din cabinet</span>
              <h2>Produsele noastre, la lucru</h2>
              <p className="lead">
                Fotografii din clinicile și saloanele care lucrează cu gamele
                pe care le ținem în stoc.
              </p>
            </div>
          </Reveal>
          <Reveal>
            <PhotoGrid photos={galerie.slice(1)} alt="Tratament estetic profesional" />
          </Reveal>
        </section>
      )}

      {restText && (
        <section className="container section">
          <Reveal className="article">
            <div className="wp-content" dangerouslySetInnerHTML={{ __html: restText }} />
          </Reveal>
        </section>
      )}

      <PhotoBand
        image={banda}
        kicker="Cum lucrăm"
        title="Un furnizor se vede la al doilea lot, nu la primul"
        text="Primul lot îl livrează oricine. Al doilea, al zecelea și cel de care ai nevoie vineri la ora patru — acolo se vede diferența."
        cta={{ label: "Scrie-ne", href: "/contact-us" }}
      />

      <section className="band--ink">
        <div className="container section">
          <Reveal className="section__head">
            <div className="section__head-text">
              <span className="kicker">Ce ne asumăm</span>
              <h2>Patru lucruri pe care nu le negociem</h2>
            </div>
          </Reveal>

          <div className="values">
            {VALORI.map((v, i) => (
              <Reveal key={v.titlu} className="value" delay={i * 80}>
                <span className="value__num">{String(i + 1).padStart(2, "0")}</span>
                <h3>{v.titlu}</h3>
                <p>{v.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Statement
        text="Un rezultat bun nu se vede. Se simte doar că omul din oglindă arată odihnit."
        by={siteConfig.name}
      />

      <section className="container section--tight">
        <div className="section__head">
          <div className="section__head-text">
            <span className="kicker">Branduri</span>
            <h2>Cu ce lucrăm</h2>
          </div>
        </div>
      </section>
      <BrandStrip />

      <Newsletter />
    </>
  );
}
