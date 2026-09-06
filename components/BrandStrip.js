import { brandStrip } from "@/lib/slides";

// Banda cu siglele producătorilor, derulată continuu. Grupul se repetă de
// două ori ca bucla să fie fără salt; la hover se oprește.
export default function BrandStrip() {
  const logos = brandStrip();
  if (logos.length < 3) return null;

  const group = (
    <div className="brands__group" aria-hidden="true">
      {logos.map((l, i) => (
        <img key={i} src={l.src} alt={l.alt} loading="lazy" decoding="async" />
      ))}
    </div>
  );

  return (
    <section className="container section--tight">
      <p className="sr-only">Branduri disponibile în magazin</p>
      <div className="brands">
        <div className="brands__track">
          {group}
          {group}
        </div>
      </div>
    </section>
  );
}
