import testimonials from "@/content/testimonials.json";

// Părerile clienților. Secțiunea nu se afișează deloc dacă nu există
// testimoniale — mai bine lipsă decât cu text inventat.
// Se completează în content/testimonials.json:
//   [{ "text": "...", "author": "Dr. ...", "role": "clinică, oraș", "rating": 5 }]
export default function Testimonials() {
  const list = Array.isArray(testimonials) ? testimonials.filter((t) => t?.text) : [];
  if (!list.length) return null;

  return (
    <section className="container section">
      <div className="section__head">
        <div className="section__head-text">
          <span className="kicker">Recenzii</span>
          <h2>Ce spun clienții noștri</h2>
        </div>
      </div>

      <div className="quotes">
        {list.map((t, i) => (
          <figure className="quote" key={i}>
            {t.rating > 0 && (
              <div className="quote__stars" aria-label={`${t.rating} din 5 stele`}>
                {"★".repeat(Math.round(t.rating))}
              </div>
            )}
            <blockquote>{t.text}</blockquote>
            <figcaption>
              <b>{t.author}</b>
              {t.role && <span>{t.role}</span>}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
