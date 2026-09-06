"use client";

import { useRef } from "react";

// Card cu înclinare 3D după mouse (efectul „3D card" din Aceternity UI),
// scris de mână ca să nu adăugăm nicio bibliotecă.
//
// Totul se face prin variabile CSS scrise direct pe element, într-un
// requestAnimationFrame — nu declanșează re-randări React, deci rămâne fluid.
// La `prefers-reduced-motion` efectul nu pornește deloc.
export default function Tilt3D({ children, max = 7, scale = 1.015, className = "" }) {
  const ref = useRef(null);
  const frame = useRef(0);

  const move = (e) => {
    const el = ref.current;
    if (!el || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    if (frame.current) return;

    const { clientX, clientY } = e;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const r = el.getBoundingClientRect();
      const px = (clientX - r.left) / r.width;   // 0…1
      const py = (clientY - r.top) / r.height;   // 0…1
      el.style.setProperty("--rx", `${(0.5 - py) * max * 2}deg`);
      el.style.setProperty("--ry", `${(px - 0.5) * max * 2}deg`);
      el.style.setProperty("--mx", `${px * 100}%`);
      el.style.setProperty("--my", `${py * 100}%`);
      el.style.setProperty("--tilt-scale", String(scale));
    });
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    if (frame.current) { cancelAnimationFrame(frame.current); frame.current = 0; }
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--tilt-scale", "1");
  };

  return (
    <div
      ref={ref}
      className={`tilt3d ${className}`.trim()}
      onPointerMove={move}
      onPointerLeave={reset}
      onBlurCapture={reset}
    >
      <div className="tilt3d__inner">{children}</div>
      <span className="tilt3d__sheen" aria-hidden="true" />
    </div>
  );
}
