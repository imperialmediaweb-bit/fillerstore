// Fotografiile și textul dintr-o pagină WordPress, pregătite pentru
// componentele noastre.
//
// Pagina „Despre" din WordPress are fotografii reale pe care nu le avem
// nicăieri altundeva. Pagina noastră le acoperea; acum le scoatem din
// conținutul ei și le folosim — și în pagina Despre, și pe prima pagină.

import { getPage, imagesFromHtml, stripHtml } from "@/lib/content";

const PROBABIL_SIGLA = /logo|icon|sigla|badge|favicon|placeholder/i;

/** Fotografiile dintr-o pagină, fără siglele și pictogramele mici. */
export async function photosFromPage(slug) {
  const page = await getPage(slug).catch(() => null);
  if (!page?.content) return [];
  return imagesFromHtml(page.content)
    .filter((i) => i.src && !PROBABIL_SIGLA.test(i.src))
    .filter((i) => !/\.svg(\?|$)/i.test(i.src));
}

/** Paragrafele dintr-o pagină, curățate de etichete și de rândurile goale. */
export function paragraphsFromHtml(html, { min = 40 } = {}) {
  if (!html) return [];
  const out = [];
  const re = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let m;
  while ((m = re.exec(html))) {
    const text = stripHtml(m[1]);
    if (text.length >= min && !out.includes(text)) out.push(text);
  }
  return out;
}

/** Pagina Despre, gata de afișat: titlu, paragrafe, fotografii. */
export async function aboutPage(slug = "despre") {
  const page = await getPage(slug).catch(() => null);
  if (!page) return null;
  return {
    title: page.title || "",
    paragraphs: paragraphsFromHtml(page.content),
    photos: (await photosFromPage(slug)),
    raw: page.content || "",
  };
}
