import Breadcrumbs from "@/components/Breadcrumbs";

// Antetul comun al paginilor interioare.
//
// Prima pagină are hero, benzi colorate și ritm; celelalte începeau direct cu
// firimituri și un titlu pe fond gol, ca și cum ar fi din alt site. Aici
// primesc toate același deschis: o bandă bordo cu titlul mare, supratitlul de
// aramă și, unde are sens, câteva cifre sau scurtături.
export default function PageHead({ kicker, title, lead, crumbs = [], facts = [], children }) {
  return (
    <header className="pagehead">
      <div className="container">
        {crumbs.length > 0 && <Breadcrumbs items={crumbs} />}

        <div className="pagehead__text">
          {kicker && <span className="kicker">{kicker}</span>}
          <h1>{title}</h1>
          {lead && <p className="lead">{lead}</p>}
        </div>

        {facts.length > 0 && (
          <dl className="pagehead__facts">
            {facts.map((f) => (
              <div key={f.label}>
                <dt>{f.value}</dt>
                <dd>{f.label}</dd>
              </div>
            ))}
          </dl>
        )}

        {children}
      </div>
    </header>
  );
}
