"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Slider de poze fără dependențe: scroll-snap nativ + săgeți + buline.
// `variant="hero"` = sliderul mare de pe prima pagină (cu autoplay);
// `variant="gallery"` = galeria de produs/articol.
export default function Slider({ slides = [], variant = "gallery", autoPlayMs = 0 }) {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);

  const goTo = useCallback((i) => {
    const track = trackRef.current;
    if (!track || !track.children.length) return;
    const n = ((i % track.children.length) + track.children.length) % track.children.length;
    track.children[n].scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  }, []);

  // ține bulinele sincronizate cu poziția reală de scroll
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const w = track.clientWidth || 1;
      setIndex(Math.round(track.scrollLeft / w));
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!autoPlayMs || slides.length < 2) return;
    const t = setInterval(() => goTo(indexRefValue(trackRef) + 1), autoPlayMs);
    return () => clearInterval(t);
  }, [autoPlayMs, slides.length, goTo]);

  if (!slides.length) return null;

  return (
    <div className={`slider slider--${variant}`}>
      <div className="slider__track" ref={trackRef}>
        {slides.map((s, i) => (
          <div className="slider__slide" key={i}>
            {s.href ? (
              <a href={s.href} className="slider__link">
                <SlideContent slide={s} />
              </a>
            ) : (
              <SlideContent slide={s} />
            )}
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <button className="slider__arrow slider__arrow--prev" aria-label="Poza anterioară"
            onClick={() => goTo(index - 1)}>‹</button>
          <button className="slider__arrow slider__arrow--next" aria-label="Poza următoare"
            onClick={() => goTo(index + 1)}>›</button>
          <div className="slider__dots">
            {slides.map((_, i) => (
              <button key={i} aria-label={`Poza ${i + 1}`}
                className={`slider__dot${i === index ? " is-active" : ""}`}
                onClick={() => goTo(i)} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function indexRefValue(trackRef) {
  const track = trackRef.current;
  if (!track) return 0;
  return Math.round(track.scrollLeft / (track.clientWidth || 1));
}

function SlideContent({ slide }) {
  return (
    <>
      {/* img simplu: sursele vin din WordPress, pe orice domeniu */}
      <img src={slide.src} alt={slide.alt || ""} loading="lazy" />
      {(slide.title || slide.subtitle) && (
        <div className="slider__caption">
          {slide.title && <h2>{slide.title}</h2>}
          {slide.subtitle && <p>{slide.subtitle}</p>}
        </div>
      )}
    </>
  );
}
