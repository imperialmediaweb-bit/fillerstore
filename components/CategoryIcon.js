// Pictogramele categoriilor, desenate de mână ca linii subțiri.
//
// Sunt SVG-uri inline, nu o bibliotecă de iconițe: sunt patru bucăți, se
// colorează din CSS prin `currentColor` și nu adaugă nicio dependință.
// Potrivirea se face pe slug, cu o cădere pe fiolă dacă apare o categorie
// nouă pe care nu o cunoaștem.

const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

// seringă înclinată — fillerele dermice
const Syringe = (
  <g {...STROKE}>
    <path d="M20.4 3.6 13 11" />
    <path d="M16.4 3.2 20.8 7.6" />
    <path d="M14.6 6.4 17.6 9.4" />
    <path d="M13.4 7.6 5.8 15.2v3h3l7.6-7.6Z" />
    <path d="M5.8 18.2 3 21" />
  </g>
);

// picătură cu unde — mezoterapia, hidratarea profundă
const Droplet = (
  <g {...STROKE}>
    <path d="M12 2.8c3.4 4 5.4 6.8 5.4 9.4a5.4 5.4 0 0 1-10.8 0c0-2.6 2-5.4 5.4-9.4Z" />
    <path d="M9.6 13.4a2.6 2.6 0 0 0 2.6 2.6" opacity=".7" />
    <path d="M3.4 18.6c1.6 0 1.6 1.4 3.2 1.4s1.6-1.4 3.2-1.4 1.6 1.4 3.2 1.4 1.6-1.4 3.2-1.4 1.6 1.4 3.2 1.4" opacity=".55" />
  </g>
);

// tub cu capac — cremele anestezice
const Tube = (
  <g {...STROKE}>
    <path d="M9.4 6.4h5.2v13a1.8 1.8 0 0 1-1.8 1.8h-1.6a1.8 1.8 0 0 1-1.8-1.8Z" />
    <path d="M9.4 6.4 8.2 3.4h7.6l-1.2 3" />
    <path d="M9.4 10.2h5.2" opacity=".7" />
    <path d="M11.2 14.2h1.6" opacity=".55" />
  </g>
);

// fiolă cu gât — lipoliticele
const Vial = (
  <g {...STROKE}>
    <path d="M10 2.6h4v3.2l1.8 2.6a3 3 0 0 1 .5 1.7v8.5a2.4 2.4 0 0 1-2.4 2.4h-3.8a2.4 2.4 0 0 1-2.4-2.4v-8.5a3 3 0 0 1 .5-1.7L10 5.8Z" />
    <path d="M7.7 13.6h8.6" opacity=".7" />
    <path d="M9.6 2.6h4.8" />
  </g>
);

// etichetă cu procent — placa de promoție
const Tag = (
  <g {...STROKE}>
    <path d="M12.6 2.8H20a1.2 1.2 0 0 1 1.2 1.2v7.4a2 2 0 0 1-.6 1.4l-7.6 7.6a1.6 1.6 0 0 1-2.2 0l-6.6-6.6a1.6 1.6 0 0 1 0-2.2l7.6-7.6a2 2 0 0 1 1.4-.6Z" />
    <circle cx="16.8" cy="7.2" r="1.4" />
    <path d="M9 15.4 14.2 10.2" opacity=".7" />
  </g>
);

const ICONS = {
  "acid-hialuronic": Syringe,
  mezoterapie: Droplet,
  "creme-anestezice": Tube,
  lipolitice: Vial,
  promo: Tag,
};

export default function CategoryIcon({ slug, className }) {
  const art = ICONS[slug] || Vial;
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {art}
    </svg>
  );
}
