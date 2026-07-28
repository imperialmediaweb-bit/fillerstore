import Link from "next/link";

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Filler Store";

export default function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link href="/" className="site-header__brand">{SITE_NAME}</Link>
        <nav className="site-header__nav">
          <Link href="/">Acasă</Link>
          <Link href="/produse">Produse</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </div>
    </header>
  );
}
