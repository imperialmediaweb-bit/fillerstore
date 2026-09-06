import Link from "next/link";
import ThemeStyle from "@/components/ThemeStyle";
import PageHead from "@/components/PageHead";
import Newsletter from "@/components/Newsletter";
import Reveal from "@/components/Reveal";
import CategoryIcon from "@/components/CategoryIcon";
import { siteConfig } from "@/lib/site";
import { pageMeta, breadcrumbLd, JsonLd } from "@/lib/seo";

export const revalidate = 300;

export const metadata = pageMeta({
  title: "Contact",
  description:
    "Scrie-ne pentru comenzi, disponibilitate în stoc sau întrebări despre produse și protocoale de utilizare. Răspundem în aceeași zi lucrătoare.",
  path: "/contact-us",
});

const CRUMBS = [{ href: "/", label: "Acasă" }, { label: "Contact" }];

// Motivele reale pentru care scrie cineva unui furnizor de produse estetice.
const MOTIVE = [
  {
    slug: "acid-hialuronic",
    titlu: "Întrebări despre produs",
    text: "Ce filler e potrivit pentru o zonă anume, ce reticulare are, cu ce se poate combina.",
  },
  {
    slug: "mezoterapie",
    titlu: "Stoc și comenzi",
    text: "Disponibilitate, cantități mai mari, produse care nu apar pe site.",
  },
  {
    slug: "creme-anestezice",
    titlu: "Livrare și retur",
    text: "Termene, transport pentru comenzi peste 600 lei, produse ajunse deteriorate.",
  },
  {
    slug: "lipolitice",
    titlu: "Colaborări",
    text: "Clinici și saloane care lucrează constant, cu condiții pe volum.",
  },
];

export default function ContactPage() {
  const { contact, company, external } = siteConfig;
  // Fără e-mail sau telefon configurat nu punem un canal fals: arătăm adresa
  // poștală, care e reală, și trimitem omul în magazin.
  const areCanal = Boolean(contact.email || contact.phone);

  return (
    <>
      <ThemeStyle seed="contact" />
      <JsonLd data={breadcrumbLd(CRUMBS)} />

      <PageHead
        kicker="Contact"
        title="Îți răspunde cineva care cunoaște produsele"
        lead="Pentru comenzi, disponibilitate în stoc sau întrebări de protocol. Scriem înapoi în aceeași zi lucrătoare."
        crumbs={CRUMBS}
      >
        {areCanal && (
          <div className="pagehead__links">
            {contact.email && <a href={`mailto:${contact.email}`}>{contact.email}</a>}
            {contact.phone && <a href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}>{contact.phone}</a>}
          </div>
        )}
      </PageHead>

      <section className="container section">
        <div className="contact">
          <Reveal className="contact__main">
            <span className="kicker">Cu ce te putem ajuta</span>
            <h2>Scrie-ne despre</h2>

            <ul className="contact__reasons">
              {MOTIVE.map((m) => (
                <li key={m.titlu}>
                  <span className="contact__icon" aria-hidden="true">
                    <CategoryIcon slug={m.slug} />
                  </span>
                  <div>
                    <b>{m.titlu}</b>
                    <span>{m.text}</span>
                  </div>
                </li>
              ))}
            </ul>

            <p className="contact__cta">
              <Link href="/produse" className="btn">Vezi produsele</Link>
            </p>
          </Reveal>

          <Reveal className="contact__aside">
            <div className="contact__card">
              <h3>Datele firmei</h3>
              <dl className="contact__dl">
                <dt>Societate</dt>
                <dd>{company.legalName}</dd>
                <dt>CUI</dt>
                <dd>{company.cui}</dd>
                <dt>Sediu</dt>
                <dd>
                  {company.address.street}
                  <br />
                  {company.address.region}
                </dd>
                {contact.schedule && (
                  <>
                    <dt>Program</dt>
                    <dd>{contact.schedule}</dd>
                  </>
                )}
              </dl>

              {areCanal ? (
                <div className="contact__channels">
                  {contact.email && (
                    <a href={`mailto:${contact.email}`} className="btn btn--sm">
                      Trimite un e-mail
                    </a>
                  )}
                  {contact.phone && (
                    <a href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`} className="btn btn--sm btn--ghost">
                      {contact.phone}
                    </a>
                  )}
                </div>
              ) : (
                <p className="contact__note">
                  Ne poți scrie prin adresa de mai sus sau ne găsești oricând
                  în magazin, la fiecare produs.
                </p>
              )}
            </div>

            <div className="contact__card contact__card--soft">
              <h3>Protecția consumatorului</h3>
              <p className="muted">
                Poți sesiza autoritățile competente prin platformele oficiale.
              </p>
              <div className="contact__channels">
                {external.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="btn btn--sm btn--ghost">
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
