"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site";

export default function Header() {
  const pathname = usePathname();
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);

  // antetul capătă fundal și umbră abia după ce se derulează
  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // meniul mobil se închide la schimbarea paginii și la Escape
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const initials = siteConfig.name.replace(/[^A-Za-zĂÂÎȘȚ ]/g, "").split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <>
      <div className="announce">
        <div className="container announce__inner">
          <span className="announce__dot" aria-hidden="true" />
          <span>{siteConfig.announcements.join(" · ")}</span>
        </div>
      </div>

      <header className={`site-header${stuck ? " is-stuck" : ""}`}>
        <div className="container site-header__inner">
          <Link href="/" className="brand" aria-label={`${siteConfig.name} — prima pagină`}>
            <span className="brand__mark" aria-hidden="true">{initials}</span>
            {siteConfig.name}
          </Link>

          <nav className="nav" aria-label="Navigație principală">
            {siteConfig.nav.map((item) => (
              <Link key={item.href} href={item.href} className={isActive(item.href) ? "is-active" : undefined}>
                {item.label}
              </Link>
            ))}
          </nav>

          <Link href="/produse" className="btn btn--sm header__cta">Vezi produsele</Link>

          <button
            className="burger"
            aria-label="Deschide meniul"
            aria-expanded={open}
            aria-controls="meniu-mobil"
            onClick={() => setOpen((v) => !v)}
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      <div
        id="meniu-mobil"
        className={`drawer${open ? " is-open" : ""}`}
        onClick={(e) => e.target === e.currentTarget && setOpen(false)}
      >
        <nav className="drawer__panel" aria-label="Navigație mobilă" {...(open ? {} : { inert: "" })}>
          {siteConfig.nav.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
              <span aria-hidden="true">→</span>
            </Link>
          ))}
          <Link href="/produse" className="btn">Vezi produsele</Link>
        </nav>
      </div>
    </>
  );
}
