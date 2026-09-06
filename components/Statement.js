// O singură frază pe toată lățimea, ca pauză între secțiuni.
// Nu vinde nimic — dă paginii un moment de respirație și un ton.
export default function Statement({ text, by }) {
  if (!text) return null;
  return (
    <section className="statement">
      <div className="container statement__inner">
        <span className="statement__mark" aria-hidden="true">&ldquo;</span>
        <p className="statement__text">{text}</p>
        <span className="statement__rule" aria-hidden="true" />
        {by && <span className="statement__by">{by}</span>}
      </div>
    </section>
  );
}
