// Căutare în biblioteca media importată din WordPress (content/media.json).
//
// Secțiunile de pe prima pagină au nevoie de poze care nu aparțin niciunui
// produs sau articol — fundalul benzii de promovare, poza de la „cine
// suntem" și așa mai departe. În loc să le configurăm una câte una, le
// căutăm după cuvinte din numele fișierului: pozele din WordPress sunt
// aproape mereu denumite după secțiunea în care apar.

import media from "@/content/media.json";

const list = Array.isArray(media) ? media : [];

const normalize = (text = "") =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

// Textul în care căutăm: numele fișierului, titlul și textul alternativ.
const haystack = (m) => normalize(`${m.src || ""} ${m.title || ""} ${m.alt || ""}`);

// Poze prea mici sunt sigle sau iconițe, nu poze de secțiune.
const isBigEnough = (m) => !m.width || m.width >= 600;

/**
 * Prima poză care conține toate cuvintele cerute.
 * @param {string|string[]} keywords un cuvânt sau mai multe, toate obligatorii
 * @param {object} opts  minWidth, exclude (cuvinte care descalifică poza)
 */
export function findMedia(keywords, { minWidth = 600, exclude = [] } = {}) {
  const words = (Array.isArray(keywords) ? keywords : [keywords]).map(normalize).filter(Boolean);
  if (!words.length) return null;

  const bad = exclude.map(normalize).filter(Boolean);

  const match = list
    .filter((m) => m?.src && (!m.width || m.width >= minWidth))
    .find((m) => {
      const text = haystack(m);
      return words.every((w) => text.includes(w)) && !bad.some((b) => text.includes(b));
    });

  return match || null;
}

/** Prima poză care conține oricare dintre cuvinte, în ordinea dată. */
export function findAnyMedia(keywordGroups = [], opts) {
  for (const group of keywordGroups) {
    const hit = findMedia(group, opts);
    if (hit) return hit;
  }
  return null;
}

export const mediaCount = () => list.filter(isBigEnough).length;
