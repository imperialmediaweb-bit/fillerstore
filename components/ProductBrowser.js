"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

// Căutare, filtrare pe categorii și sortare, direct în pagină — fără nicio
// cerere către server, deci instantaneu.
//
// Cardurile vin gata randate de pe server (`item.node`), ca să nu ajungă în
// browser nici harta pozelor, nici descrierile produselor.
export default function ProductBrowser({ items = [], categories = [] }) {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const [category, setCategory] = useState(params.get("categorie") || "");
  const [sort, setSort] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = items.filter((it) => {
      if (category && !it.categories.includes(category)) return false;
      if (q && !it.name.toLowerCase().includes(q)) return false;
      return true;
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => (a.price ?? 1e9) - (b.price ?? 1e9));
    else if (sort === "price-desc") list = [...list].sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
    else if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name, "ro"));
    return list;
  }, [items, query, category, sort]);

  return (
    <>
      <div className="toolbar">
        <div className="field">
          <i aria-hidden="true">⌕</i>
          <label className="sr-only" htmlFor="cauta-produs">Caută produse</label>
          <input
            id="cauta-produs"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Caută produse…"
          />
        </div>

        <div className="field field--plain" style={{ flex: "0 0 auto" }}>
          <label className="sr-only" htmlFor="sortare">Sortare</label>
          <select id="sortare" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">Sortare implicită</option>
            <option value="price-asc">Preț crescător</option>
            <option value="price-desc">Preț descrescător</option>
            <option value="name">Alfabetic</option>
          </select>
        </div>

        <p className="count" aria-live="polite">
          {visible.length} {visible.length === 1 ? "produs" : "produse"}
        </p>
      </div>

      {categories.length > 1 && (
        <div className="filters">
          <button className={category === "" ? "is-active" : undefined} onClick={() => setCategory("")}>
            Toate
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              className={category === c.slug ? "is-active" : undefined}
              onClick={() => setCategory(c.slug)}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {visible.length ? (
        <div className="grid">{visible.map((it) => <div key={it.id}>{it.node}</div>)}</div>
      ) : (
        <div className="empty">
          <span className="empty__icon" aria-hidden="true">⌕</span>
          <h3>Niciun produs găsit</h3>
          <p className="muted">Încearcă alt termen de căutare sau altă categorie.</p>
          <button className="btn btn--ghost" onClick={() => { setQuery(""); setCategory(""); }}>
            Șterge filtrele
          </button>
        </div>
      )}
    </>
  );
}
