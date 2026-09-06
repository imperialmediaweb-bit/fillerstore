"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

// Slider de poze fără nicio dependență: derulare cu prindere nativă
// (scroll-snap) + săgeți + buline + miniaturi. Merge din deget pe telefon.
//
// Pozele vin gata pregătite de pe server (adresă CDN + srcSet), ca harta
// media să nu ajungă în pachetul trimis către browser.
//
// variant="hero"     — sliderul mare, cu autoderulare
// variant="gallery"  — galeria de produs/articol, cu miniaturi
export default function Slider({
  slides = [],
  variant = "gallery",
  autoPlayMs = 0,
  thumbs = false,
  sizes,
  priority = false,
}) {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const id = useId();

  const goTo = useCallback((i) => {
    const track = trackRef.current;
    const count = track?.children.length;
    if (!count) return;
    const n = ((i % count) + count) % count;
    track.scrollTo({ left: n * track.clientWidth, behavior: "smooth" });
  }, []);

  // bulinele urmăresc poziția reală de derulare, oricum ar fi mișcat sliderul
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setIndex(Math.round(track.scrollLeft / (track.clientWidth || 1)));
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // autoderulare — se oprește la hover, la focus și când pagina nu e vizibilă
  useEffect(() => {
    if (!autoPlayMs || slides.length < 2 || paused) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => {
      const track = trackRef.current;
      if (!track || document.hidden) return;
      goTo(Math.round(track.scrollLeft / (track.clientWidth || 1)) + 1);
    }, autoPlayMs);
    return () => clearInterval(t);
  }, [autoPlayMs, slides.length, paused, goTo]);

  const onKeyDown = (e) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); goTo(index - 1); }
    if (e.key === "ArrowRight") { e.preventDefault(); goTo(index + 1); }
  };

  if (!slides.length) return null;
  const many = slides.length > 1;

  return (
    <div
      className={`slider slider--${variant}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        className="slider__track"
        ref={trackRef}
        role={many ? "group" : undefined}
        aria-roledescription={many ? "carusel" : undefined}
        aria-label={many ? `Galerie, ${slides.length} poze` : undefined}
        tabIndex={many ? 0 : undefined}
        onKeyDown={many ? onKeyDown : undefined}
      >
        {slides.map((s, i) => (
          <div
            className="slider__slide"
            key={s.src || i}
            id={`${id}-${i}`}
            role={many ? "group" : undefined}
            aria-roledescription={many ? "poză" : undefined}
            aria-label={many ? `${i + 1} din ${slides.length}` : undefined}
          >
            {s.href ? (
              <a href={s.href} className="slider__link">
                <SlideContent slide={s} sizes={sizes} eager={priority && i === 0} />
              </a>
            ) : (
              <SlideContent slide={s} sizes={sizes} eager={priority && i === 0} />
            )}
          </div>
        ))}
      </div>

      {many && (
        <>
          <button className="slider__arrow slider__arrow--prev" aria-label="Poza anterioară" onClick={() => goTo(index - 1)}>‹</button>
          <button className="slider__arrow slider__arrow--next" aria-label="Poza următoare" onClick={() => goTo(index + 1)}>›</button>
          {!thumbs && (
            <div className="slider__dots">
              {slides.map((_, i) => (
                <button
                  key={i}
                  className={`slider__dot${i === index ? " is-active" : ""}`}
                  aria-label={`Mergi la poza ${i + 1}`}
                  aria-current={i === index || undefined}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {thumbs && many && (
        <div className="slider__thumbs">
          {slides.map((s, i) => (
            <button
              key={s.src || i}
              className={`slider__thumb${i === index ? " is-active" : ""}`}
              aria-label={`Poza ${i + 1}`}
              aria-current={i === index || undefined}
              onClick={() => goTo(i)}
            >
              <img src={s.thumb || s.src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SlideContent({ slide, sizes, eager }) {
  return (
    <>
      <img
        src={slide.src}
        srcSet={slide.srcSet}
        sizes={slide.srcSet ? sizes || "100vw" : undefined}
        alt={slide.alt || ""}
        width={slide.width || undefined}
        height={slide.height || undefined}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : undefined}
        decoding="async"
      />
      {(slide.title || slide.subtitle || slide.kicker) && (
        <div className="slider__caption">
          {slide.kicker && <span className="chip">{slide.kicker}</span>}
          {slide.title && <h2>{slide.title}</h2>}
          {slide.subtitle && <p>{slide.subtitle}</p>}
        </div>
      )}
    </>
  );
}
