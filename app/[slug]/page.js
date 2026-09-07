// Orice pagină din WordPress (Termeni, Livrare, Întrebări frecvente…) se
// servește automat la aceeași adresă: /termeni-si-conditii, /livrare-si-plata.
//
// Toate primesc același tratament ca paginile scrise de noi: antet bordo cu
// titlul mare, fotografiile scoase din text și așezate în mozaic, iar textul
// pe o lățime de citit. Înainte erau firimituri, un titlu pe fond gol și
// conținutul brut — arătau ca dintr-un alt site.
import { notFound } from "next/navigation";
import Link from "next/link";
import ThemeStyle from "@/components/ThemeStyle";
import PageHead from "@/components/PageHead";
import PhotoGrid from "@/components/PhotoGrid";
import Newsletter from "@/components/Newsletter";
import Reveal from "@/components/Reveal";
import { getPage, getPages, excerpt, stripHtml } from "@/lib/content";
import { photosFromPage, contentAfterIntro } from "@/lib/pagePhotos";
import { chaptersFromHtml } from "@/lib/wpBlocks";
import Chapters from "@/components/Chapters";
import { siteConfig } from "@/lib/site";
import { pageMeta, breadcrumbLd, JsonLd } from "@/lib/seo";

export const revalidate = 300;

// Adresele care au deja pagina lor scrisă de noi. Dacă le-am genera și de
// aici, s-ar produce două pagini pentru aceeași adresă, iar cea din
// WordPress ar câștiga — exact ce s-a întâmplat cu /despre.
const RUTE_PROPRII = new Set(["despre", "contact-us"]);

// Adresele la care trimit meniul și subsolul. Dacă importul din WordPress nu
// reușește (s-a întâmplat deja o dată), toate ar da 404 și jumătate din
// navigație ar fi moartă. Pentru ele afișăm o pagină de așteptare.
const LEGATURI_CUNOSCUTE = new Map(
  [...siteConfig.nav, ...siteConfig.footer.flatMap((c) => c.links)]
    .filter((l) => l.href.startsWith("/") && !l.href.includes("?") && l.href !== "/")
    .map((l) => [l.href.replace(/^\//, ""), l.label])
);

// Supratitlul: coloana din subsol în care stă pagina. „Livrare și plată" e
// sub „Informații", „Termeni și condiții" sub „Legal" — omul vede din prima
// unde a ajuns.
const SECTIUNE = new Map(
  siteConfig.footer.flatMap((col) =>
    col.links.map((l) => [l.href.replace(/^\//, ""), col.title])
  )
);

export async function generateStaticParams() {
  const pages = await getPages();
  return pages.filter((p) => !RUTE_PROPRII.has(p.slug)).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) {
    const label = LEGATURI_CUNOSCUTE.get(slug);
    return pageMeta({ title: label || "Pagină negăsită", path: `/${slug}`, noIndex: true });
  }

  return pageMeta({
    title: page.title,
    description: excerpt(page.excerpt || page.content, 155),
    path: `/${page.slug}`,
    image: page.image?.src,
  });
}

export default async function WpPage({ params }) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) {
    const label = LEGATURI_CUNOSCUTE.get(slug);
    if (!label) notFound();
    return <PaginaInPregatire slug={slug} titlu={label} />;
  }

  const poze = await photosFromPage(slug);

  // Când pagina nu are rezumat propriu în WordPress, rezumatul din antet e
  // chiar începutul textului. Fără asta, primul paragraf apărea de două ori:
  // o dată sub titlu și o dată în articol.
  const areRezumat = stripHtml(page.excerpt || "").length > 20;
  // Rezumatul se ia din primul paragraf, nu din tot textul: altfel taia in
  // mijlocul frazei urmatoare ("...Vanzator: DENTAL PLUS...").
  const primul = (page.content || "").match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  const rezumat = areRezumat
    ? excerpt(page.excerpt, 165)
    : excerpt(primul ? primul[1] : page.content, 165);
  // Textul pe capitole, cu cuprins când sunt destule. Paragraful care a
  // devenit rezumat nu se repetă; pozele apar o dată, în mozaic.
  const capitole = chaptersFromHtml(page.content, {
    skip: areRezumat || !primul ? [] : [stripHtml(primul[1])],
  });
  const areCapitole = capitole.intro.length + capitole.chapters.length > 0;
  // Dacă textul lor nu are nici paragrafe, nici titluri (un tabel, de pildă),
  // îl arătăm așa cum e, fără poze.
  const text = areCapitole ? "" : contentAfterIntro(page.content, areRezumat ? 0 : 1);
  const crumbs = [{ href: "/", label: "Acasă" }, { label: page.title }];

  return (
    <>
      <ThemeStyle seed={page.slug} />
      <JsonLd data={breadcrumbLd(crumbs)} />

      <PageHead
        kicker={SECTIUNE.get(slug) || siteConfig.name}
        title={page.title}
        lead={rezumat}
        crumbs={crumbs}
      />

      {poze.length > 0 && (
        <section className="container section">
          <Reveal>
            <PhotoGrid photos={poze} alt={page.title} />
          </Reveal>
        </section>
      )}

      <section className="container section">
        {areCapitole ? (
          <Chapters intro={capitole.intro} chapters={capitole.chapters} />
        ) : (
          <Reveal className="article">
            <div className="wp-content" dangerouslySetInnerHTML={{ __html: text }} />
          </Reveal>
        )}
      </section>

      <Newsletter />
    </>
  );
}

// Pagina de rezervă pentru o adresă din meniu sau subsol al cărei conținut nu
// a venit din WordPress. Nu inventăm text: spunem ce se întâmplă și trimitem
// omul unde poate ajunge. Neindexată, ca să nu intre așa în Google.
function PaginaInPregatire({ slug, titlu }) {
  return (
    <>
      <ThemeStyle seed={slug} />
      <PageHead
        kicker={SECTIUNE.get(slug) || siteConfig.name}
        title={titlu}
        lead="Pagina aceasta se pregătește. Până atunci, îți stăm la dispoziție pentru orice întrebare despre produse, comenzi sau livrare."
        crumbs={[{ href: "/", label: "Acasă" }, { label: titlu }]}
      />

      <section className="container section">
        <div className="article">
          <p className="muted">
            {siteConfig.company.legalName} · CUI {siteConfig.company.cui} ·{" "}
            {siteConfig.company.address.street}, {siteConfig.company.address.region}
          </p>
          <p>
            <Link href="/produse" className="btn">Vezi produsele</Link>
          </p>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
