"use client";

import { useEffect, useState } from "react";

// Cuprinsul: urmărește capitolul aflat în ecran și îl marchează. Fără
// JavaScript rămâne o listă de legături — funcționează oricum.
export default function ChaptersNav({ items = [], kicker = "Cuprins" }) {
  const [activ, setActiv] = useState(items[0]?.id);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean);
    if (!els.length) return;
    const vizibile = new Map();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) vizibile.set(e.target.id, e.isIntersecting ? e.boundingClientRect.top : Infinity);
        let best = null;
        for (const [id, top] of vizibile) if (top !== Infinity && (best === null || top < best.top)) best = { id, top };
        if (best) setActiv(best.id);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.2] }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  return (
    <nav className="chapters__nav" aria-label={kicker}>
      <span className="kicker">{kicker}</span>
      <ol className="chapters__list">
        {items.map((it, i) => (
          <li key={it.id}>
            <a href={`#${it.id}`} aria-current={activ === it.id ? "true" : undefined}>
              <span className="chapters__idx">{String(i + 1).padStart(2, "0")}</span>
              <span>{it.title}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
