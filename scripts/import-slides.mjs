#!/usr/bin/env node
// Extrage pozele sliderelor din prima pagină a site-ului WordPress.
//
// De ce nu prin API: sliderele făcute în Elementor nu sunt expuse prin
// /wp-json — configurația lor stă în metadatele paginii, într-un format
// intern. Singura cale sigură e să citim HTML-ul randat și să scoatem de
// acolo pozele, în ordinea în care apar.
//
// Rezultatul se scrie în content/slides.json, care e un fișier EDITABIL DE
// MÂNĂ: după prima rulare poți schimba titlurile, textele și linkurile,
// iar reimporturile ulterioare nu le suprascriu decât cu --force.
//
//     WORDPRESS_URL=https://fillerstore.ro npm run import-slides

import "./load-env.mjs";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const BASE = (process.env.WORDPRESS_URL || "").replace(/\/+$/, "");
const OUT = resolve(process.cwd(), "content", "slides.json");
const force = process.argv.includes("--force");

if (!BASE) {
  console.error("Lipsește WORDPRESS_URL.");
  process.exit(1);
}

// Poze prea mici sau cu nume de interfață: sigle, iconițe, avataruri, embleme
// de plată. Nu au ce căuta într-un slider.
const JUNK = /(logo|icon|favicon|avatar|placeholder|spinner|loader|badge|payment|visa|mastercard|netopia|anpc|sol[-_]|sigla)/i;

const isUsable = (url) =>
  /^https?:\/\//.test(url) &&
  /\.(jpe?g|png|webp|avif)(\?|$)/i.test(url) &&
  !JUNK.test(url);

// WordPress servește variante redimensionate (nume-1024x576.jpg).
// Le reducem la originalul pe care l-am urcat pe CDN.
const toOriginal = (url) => url.replace(/-\d{2,4}x\d{2,4}(?=\.[a-z0-9]+(\?|$))/i, "");

// Scoate toate adresele de poze dintr-un fragment de HTML, în ordinea apariției:
// <img src>, data-src (încărcare leneșă), srcset și background-image din stil.
function imagesIn(html) {
  const out = [];
  const push = (u) => {
    if (!u) return;
    const clean = toOriginal(u.trim().replace(/&amp;/g, "&"));
    if (isUsable(clean) && !out.includes(clean)) out.push(clean);
  };

  for (const m of html.matchAll(/<img[^>]*>/gi)) {
    const tag = m[0];
    push((tag.match(/\bsrc=["']([^"']+)["']/i) || [])[1]);
    push((tag.match(/\bdata-(?:src|lazy-src)=["']([^"']+)["']/i) || [])[1]);
    const srcset = (tag.match(/\bsrcset=["']([^"']+)["']/i) || [])[1];
    if (srcset) {
      // din srcset luăm varianta cea mai mare
      const best = srcset
        .split(",")
        .map((s) => s.trim().split(/\s+/))
        .map(([u, w]) => ({ u, w: parseInt(w) || 0 }))
        .sort((a, b) => b.w - a.w)[0];
      push(best?.u);
    }
  }
  for (const m of html.matchAll(/background-image\s*:\s*url\((['"]?)([^)'"]+)\1\)/gi)) push(m[2]);
  for (const m of html.matchAll(/data-(?:bg|background)=["']([^"']+)["']/gi)) push(m[1]);

  return out;
}

// Izolează secțiunile care arată a slider. Acoperim numele folosite de
// Elementor, Swiper, Slick și de temele obișnuite.
//
// Marcajele se imbrică (un elementor-widget-slides conține un swiper-wrapper,
// care conține swiper-slide), așa că marcajele apropiate între ele se
// consideră același slider. Fiecare secțiune ține până la începutul
// următoarei — altfel prima felie ar înghiți toată pagina.
const MARKER = /class=["'][^"']*(elementor-widget-slides|elementor-slides|swiper-wrapper|swiper-container|slick-track|slick-slider|carousel-inner|n2-ss-slider)[^"']*["']/gi;
const NESTED_GAP = 1500; // sub atâtea caractere = același slider, imbricat

function sliderSections(html) {
  const positions = [...html.matchAll(MARKER)].map((m) => m.index);
  if (!positions.length) return [];

  // grupăm marcajele imbricate
  const starts = [positions[0]];
  for (let i = 1; i < positions.length; i++) {
    if (positions[i] - positions[i - 1] > NESTED_GAP) starts.push(positions[i]);
  }

  return starts.map((start, i) => html.slice(start, starts[i + 1] ?? html.length));
}

async function main() {
  console.log(`\nCitesc prima pagină de la ${BASE}\n`);
  const res = await fetch(`${BASE}/`, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; fillerstore-import/1.0)", Accept: "text/html" },
  });
  if (!res.ok) {
    console.error(`Nu am putut citi prima pagină: HTTP ${res.status}`);
    process.exit(1);
  }
  const html = await res.text();

  const sections = sliderSections(html);
  console.log(`  ${sections.length} secțiuni care arată a slider`);

  const groups = [];
  for (const section of sections) {
    const imgs = imagesIn(section);
    // un slider are cel puțin două poze; una singură e doar o imagine de fundal
    if (imgs.length >= 2) groups.push(imgs);
  }

  // dacă nu am găsit nimic, luăm pozele mari din prima treime a paginii
  if (!groups.length) {
    const top = imagesIn(html.slice(0, Math.floor(html.length / 3)));
    if (top.length >= 2) {
      groups.push(top.slice(0, 8));
      console.log("  (n-am găsit marcaje de slider — am luat pozele din partea de sus a paginii)");
    }
  }

  if (!groups.length) {
    console.error("\nNu am găsit poze de slider. Completează content/slides.json manual.\n");
    process.exit(1);
  }

  // eliminăm duplicatele între grupuri, păstrând ordinea
  const seen = new Set();
  const sliders = groups
    .map((imgs, i) => ({
      id: `slider-${i + 1}`,
      slides: imgs
        .filter((src) => !seen.has(src) && seen.add(src))
        .slice(0, 10)
        .map((src) => ({ src, alt: "", kicker: "", title: "", subtitle: "", href: "" })),
    }))
    .filter((s) => s.slides.length >= 2);

  await mkdir(resolve(process.cwd(), "content"), { recursive: true });

  // nu suprascriem textele scrise de mână
  let existing = null;
  try { existing = JSON.parse(await readFile(OUT, "utf8")); } catch { /* prima rulare */ }
  if (existing?.length && !force) {
    console.log("\ncontent/slides.json există deja și are texte — nu îl suprascriu.");
    console.log("Rulează cu --force dacă vrei să îl reconstruiesc de la zero.\n");
    console.log("Poze găsite acum:");
    sliders.forEach((s) => console.log(`  ${s.id}: ${s.slides.length} poze`));
    return;
  }

  await writeFile(OUT, JSON.stringify(sliders, null, 2) + "\n", "utf8");
  console.log(`\nAm scris content/slides.json:`);
  sliders.forEach((s) => {
    console.log(`  ${s.id} — ${s.slides.length} poze`);
    s.slides.forEach((sl) => console.log(`      ${sl.src}`));
  });
  console.log("\nCompletează titlurile și linkurile în fișier, apoi commit.\n");
}

main().catch((err) => { console.error(err); process.exit(1); });
