"use client";

import { useRef } from "react";

// Halou de lumină care urmărește cursorul peste o secțiune întunecată
// (efectul „spotlight" din Aceternity UI). Poziția se scrie în variabile CSS,
// fără re-randare.
export default function Spotlight({ children, className = "" }) {
  const ref = useRef(null);
  const frame = useRef(0);

  const move = (e) => {
    const el = ref.current;
    if (!el || frame.current) return;
    const { clientX, clientY } = e;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--sx", `${clientX - r.left}px`);
      el.style.setProperty("--sy", `${clientY - r.top}px`);
      el.style.setProperty("--s-on", "1");
    });
  };
  const off = () => ref.current?.style.setProperty("--s-on", "0");

  return (
    <div ref={ref} className={`spotlight ${className}`.trim()} onPointerMove={move} onPointerLeave={off}>
      {children}
    </div>
  );
}
