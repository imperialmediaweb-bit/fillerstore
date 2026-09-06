import Link from "next/link";
import { siteConfig } from "@/lib/site";

export default function Footer() {
  const { company } = siteConfig;
  const initials = siteConfig.name.replace(/[^A-Za-zĂÂÎȘȚ ]/g, "").split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <footer className="site-footer">
      <div className="container site-footer__top">
        <div className="site-footer__about">
          <span className="brand">
            <span className="brand__mark" aria-hidden="true">{initials}</span>
            {siteConfig.name}
          </span>
          <p>{siteConfig.description}</p>
        </div>

        {siteConfig.footer.map((col) => (
          <div key={col.title}>
            <h2 className="site-footer__coltitle">{col.title}</h2>
            <nav aria-label={col.title}>
              {col.links.map((l) => (
                <Link key={l.href} href={l.href}>{l.label}</Link>
              ))}
            </nav>
          </div>
        ))}
      </div>

      <div className="container">
        <div className="site-footer__bottom">
          <p>
            {company.legalName} · CUI {company.cui} · {company.address.street}, {company.address.region}
          </p>
          <p>
            © {new Date().getFullYear()} {siteConfig.name}
            {siteConfig.external.map((l) => (
              <span key={l.href}>
                {" · "}
                <a href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>
              </span>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}
