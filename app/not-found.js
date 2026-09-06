import Link from "next/link";
import ThemeStyle from "@/components/ThemeStyle";
import { HUES } from "@/lib/theme";

export const metadata = {
  title: "Pagina nu a fost găsită",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <ThemeStyle seed={HUES.notFound} />
      <div className="container notfound">
        <span className="notfound__code">404</span>
        <h1>Pagina nu a fost găsită</h1>
        <p className="lead" style={{ maxWidth: "44ch" }}>
          Adresa căutată nu există sau conținutul a fost mutat între timp.
          Poți porni de la produse sau de la prima pagină.
        </p>
        <div className="hero__actions" style={{ justifyContent: "center" }}>
          <Link className="btn" href="/produse">Vezi produsele</Link>
          <Link className="btn btn--ghost" href="/">Prima pagină</Link>
        </div>
      </div>
    </>
  );
}
