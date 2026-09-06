"use client";

import { useEffect, useRef, useState } from "react";

// Cifră care urcă de la zero când secțiunea intră în ecran
// (efectul „number ticker" din Magic UI).
export default function NumberTicker({ value, suffix = "", duration = 1400 }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setShown(value);
      return;
    }

    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || done.current) return;
      done.current = true;
      io.disconnect();

      const start = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - start) / duration);
        // încetinire spre final, ca să pară că „aterizează"
        const eased = 1 - Math.pow(1 - t, 3);
        setShown(Math.round(value * eased));
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.4 });

    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref}>
      {shown.toLocaleString("ro-RO")}
      {suffix}
    </span>
  );
}
