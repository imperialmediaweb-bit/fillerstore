// Textul lung dintr-o pagină WordPress, transformat în capitole.
//
// Paginile lor sunt făcute cu un constructor de pagini: printre paragrafe
// stau ilustrații desenate ca SVG, rânduri de un cuvânt („Filler Store"),
// liste de legături („Produse", „Comenzi"), pictograme de rețele sociale al
// căror text ascuns iese la iveală („Facebook Twitter Youtube") și același
// paragraf repetat pentru telefon și pentru birou. Vărsat brut, totul arăta
// ca o pagină stricată.
//
// Aici păstrăm doar ce e text de citit — titluri, paragrafe, liste, citate —
// și îl împărțim pe capitole, ca să-l putem așeza cu cuprins.

import { stripHtml } from "@/lib/content";
import { siteConfig } from "@/lib/site";

const INLINE_PASTRATE = new Set(["a", "strong", "em", "br", "sup", "sub", "u"]);
const SITE_HOSTS = /^(https?:)?\/\/(www\.)?fillerstore\.ro/i;

/** Marcajul din interiorul unui paragraf, curățat până la ce merită păstrat. */
export function cleanInline(html = "") {
  return html
    .replace(/<(svg|script|style|noscript|iframe|picture|video|audio|form|button)[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<img[^>]*>/gi, "")
    .replace(/<\/?(b)\b[^>]*>/gi, (m) => (m.startsWith("</") ? "</strong>" : "<strong>"))
    .replace(/<\/?(i)\b[^>]*>/gi, (m) => (m.startsWith("</") ? "</em>" : "<em>"))
    .replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi, (m, attrs, inner) => {
      const href = (attrs.match(/href=["']([^"']+)["']/i) || [])[1] || "";
      if (!href || /^javascript:/i.test(href) || href === "#") return inner;
      const local = SITE_HOSTS.test(href) ? href.replace(SITE_HOSTS, "") || "/" : href;
      const extern = /^https?:\/\//i.test(local);
      return `<a href="${local.replace(/"/g, "&quot;")}"${extern ? ' target="_blank" rel="noopener"' : ""}>${inner}</a>`;
    })
    .replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, (m, tag) =>
      INLINE_PASTRATE.has(tag.toLowerCase()) ? m : ""
    )
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const normalize = (t) => stripHtml(t).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
const words = (t) => stripHtml(t).split(/\s+/).filter(Boolean).length;
const doarLegaturi = (html) => stripHtml(html.replace(/<a\b[^>]*>[\s\S]*?<\/a>/gi, "")).length === 0;

const BLOCURI = /<(h[1-6])\b[^>]*>([\s\S]*?)<\/\1>|<p\b[^>]*>([\s\S]*?)<\/p>|<(ul|ol)\b[^>]*>([\s\S]*?)<\/\4>|<blockquote\b[^>]*>([\s\S]*?)<\/blockquote>/gi;

/**
 * Blocurile de text dintr-o pagină, în ordinea din document.
 * `skip` — texte care apar deja în altă parte a paginii (paragrafele de
 * lângă fotografia de sus) și nu trebuie să se repete.
 */
export function blocksFromHtml(html = "", { skip = [] } = {}) {
  if (!html) return [];
  const vazute = new Set(skip.map(normalize).filter(Boolean));
  const nume = normalize(siteConfig.name);
  const out = [];
  let m;
  BLOCURI.lastIndex = 0;
  while ((m = BLOCURI.exec(html))) {
    if (m[1]) {
      const text = stripHtml(m[2]);
      // h1 e titlul paginii, îl avem deja în antet
      if (m[1] === "h1" || text.length < 3 || normalize(text) === nume) continue;
      const key = "h:" + normalize(text);
      if (vazute.has(key)) continue;
      vazute.add(key);
      out.push({ type: "h", level: Number(m[1][1]), text, html: cleanInline(m[2]) });
    } else if (m[3] !== undefined) {
      const inner = cleanInline(m[3]);
      const text = stripHtml(inner);
      const key = normalize(text);
      if (!key || vazute.has(key)) continue;
      if (doarLegaturi(inner)) continue; // „Vezi produse" — avem butoanele noastre
      if (words(text) < 4 && text.length < 40) continue; // „Filler Store", „Cu drag,"
      // un rând scurt fără punct la sfârșit e o lozincă de sub o poză, nu text
      if (words(text) < 8 && !/[.!?:;…)]$/.test(text)) continue;
      vazute.add(key);
      out.push({ type: "p", html: inner, text });
    } else if (m[4]) {
      const items = [];
      const li = /<li\b[^>]*>([\s\S]*?)<\/li>/gi;
      let it;
      while ((it = li.exec(m[5]))) {
        const inner = cleanInline(it[1]);
        const text = stripHtml(inner);
        if (!text) continue;
        if (doarLegaturi(inner) && words(text) <= 3) continue; // meniuri, rețele sociale
        items.push({ html: inner, text });
      }
      const key = "l:" + items.map((i) => normalize(i.text)).join("|");
      if (!items.length || vazute.has(key)) continue;
      vazute.add(key);
      out.push({ type: "list", ordered: m[4].toLowerCase() === "ol", items });
    } else if (m[6] !== undefined) {
      const inner = cleanInline(m[6].replace(/<\/?p\b[^>]*>/gi, " "));
      const text = stripHtml(inner);
      if (text.length < 20 || vazute.has(normalize(text))) continue;
      vazute.add(normalize(text));
      out.push({ type: "quote", html: inner, text });
    }
  }
  // Un titlu urmat direct de alt titlu (sau de nimic) nu introduce niciun
  // text — la ei, „Pasiune pentru Inovație" stătea deasupra unei ilustrații.
  return out.filter((b, i) => b.type !== "h" || (out[i + 1] && out[i + 1].type !== "h"));
}

const slugify = (t) =>
  normalize(t).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-").slice(0, 60);

/**
 * Capitolele: fiecare titlu de nivel maxim deschide un capitol; titlurile
 * mai mici rămân în interior ca subtitluri. Ce e înaintea primului titlu
 * devine introducerea.
 */
export function chaptersFromBlocks(blocks = []) {
  const niveluri = blocks.filter((b) => b.type === "h").map((b) => b.level);
  if (!niveluri.length) return { intro: blocks, chapters: [] };
  const top = Math.min(...niveluri);
  const intro = [];
  const chapters = [];
  let cur = null;
  const ids = new Set();
  for (const b of blocks) {
    if (b.type === "h" && b.level <= top) {
      let id = slugify(b.text) || `capitol-${chapters.length + 1}`;
      while (ids.has(id)) id += "-2";
      ids.add(id);
      // „1. Definiții" — numerotarea lor s-ar dubla cu a noastră
      const title = b.text.replace(/^\s*(\d{1,2}|[ivx]{1,4})[.)]\s+/i, "");
      const html = b.html.replace(/^\s*(\d{1,2}|[ivx]{1,4})[.)]\s+/i, "");
      cur = { id, title, html, blocks: [] };
      chapters.push(cur);
    } else if (cur) {
      cur.blocks.push(b);
    } else {
      intro.push(b);
    }
  }
  // Un capitol cu titlu dar fără text ar rămâne un rând gol în cuprins.
  return { intro, chapters: chapters.filter((c) => c.blocks.length) };
}

export function chaptersFromHtml(html, opts) {
  return chaptersFromBlocks(blocksFromHtml(html, opts));
}
