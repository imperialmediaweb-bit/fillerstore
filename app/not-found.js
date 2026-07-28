import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container section" style={{ textAlign: "center" }}>
      <h1>Pagina nu a fost găsită</h1>
      <p>Adresa căutată nu există sau conținutul a fost mutat.</p>
      <p><Link className="btn" href="/">Înapoi la prima pagină</Link></p>
    </div>
  );
}
