import Link from "next/link";

// Banda de abonare. Dacă nu e configurat un serviciu de newsletter
// (NEXT_PUBLIC_NEWSLETTER_ACTION), nu punem un formular care nu duce
// nicăieri — trimitem la pagina de contact.
const ACTION = process.env.NEXT_PUBLIC_NEWSLETTER_ACTION || "";

export default function Newsletter() {
  return (
    <section className="container section">
      <div className="newsletter">
        <span className="kicker">Rămâi la curent</span>
        <h2>Noutăți, stocuri noi și oferte pentru profesioniști</h2>
        <p>
          Îți scriem doar când apare ceva care contează: produse noi în stoc,
          reduceri reale și noutăți din domeniul esteticii.
        </p>

        {ACTION ? (
          <form className="newsletter__form" action={ACTION} method="post">
            <label className="sr-only" htmlFor="newsletter-email">Adresa ta de e-mail</label>
            <input
              id="newsletter-email"
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="adresa@exemplu.ro"
            />
            <button type="submit" className="btn">Abonează-mă</button>
          </form>
        ) : (
          <Link href="/contact" className="btn">Scrie-ne</Link>
        )}

        <small>Fără spam. Te poți dezabona oricând.</small>
      </div>
    </section>
  );
}
