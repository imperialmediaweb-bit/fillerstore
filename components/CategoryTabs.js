"use client";

import { useState } from "react";

// Listă de produse cu file pe categorii, lângă un panou de promoție —
// secțiunea „Produse Mezoterapie" de pe site-ul actual.
//
// Rândurile vin gata randate de pe server (`item.node`), ca harta pozelor și
// prețurile formatate să nu ajungă în pachetul trimis către browser.
export default function CategoryTabs({ items = [], categories = [], panel = null }) {
  const tabs = [{ slug: "", name: "Toate" }, ...categories];
  const [active, setActive] = useState("");

  const visible = active ? items.filter((it) => it.categories.includes(active)) : items;

  return (
    <div className="tabs-section">
      {panel && <div className="tabs-section__panel">{panel}</div>}

      <div className="tabs-section__list">
        <div className="filters" role="tablist" aria-label="Categorii">
          {tabs.map((t) => (
            <button
              key={t.slug || "all"}
              role="tab"
              aria-selected={active === t.slug}
              className={active === t.slug ? "is-active" : undefined}
              onClick={() => setActive(t.slug)}
            >
              {t.name}
            </button>
          ))}
        </div>

        {visible.length ? (
          <div className="prow-list">
            {visible.slice(0, 8).map((it) => <div key={it.id}>{it.node}</div>)}
          </div>
        ) : (
          <p className="muted" style={{ padding: "18px 2px" }}>
            Momentan nu avem produse în această categorie.
          </p>
        )}
      </div>
    </div>
  );
}
