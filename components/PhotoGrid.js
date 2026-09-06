import { img, srcSet } from "@/lib/img";

// Mozaic de fotografii: prima ocupă două celule, restul umplu în jurul ei.
// Se adaptează la câte poze există — cu două arată la fel de bine ca cu opt.
export default function PhotoGrid({ photos = [], alt = "" }) {
  const toate = photos.filter((p) => p?.src);
  if (!toate.length) return null;

  // Prima fotografie se întinde pe două coloane și două rânduri, deci ocupă
  // patru celule; blocul se închide curat doar la 5 sau 9 poze. La orice alt
  // număr rămâne o gaură — aceeași greșeală pe care am făcut-o la categorii.
  // Sub pragul ăsta trecem pe coloane egale, unde nu are ce să rămână gol.
  const mozaic = toate.length >= 9 ? 9 : toate.length >= 5 ? 5 : 0;
  const list = mozaic ? toate.slice(0, mozaic) : toate.slice(0, 8);
  const egale = !mozaic;

  return (
    <div className={`photogrid${egale ? " photogrid--few" : ""}`}>
      {list.map((p, i) => (
        <figure key={p.src} className={i === 0 && !egale ? "photogrid__cell photogrid__cell--lead" : "photogrid__cell"}>
          <img
            src={img(p.src, { w: i === 0 && !egale ? 1000 : 600, h: i === 0 && !egale ? 750 : 600 })}
            srcSet={srcSet(p.src, [400, 700, 1000])}
            sizes={i === 0 && !egale ? "(max-width: 900px) 100vw, 640px" : "(max-width: 900px) 50vw, 320px"}
            alt={p.alt || alt}
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
          />
        </figure>
      ))}
    </div>
  );
}
