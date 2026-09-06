// Datele fixe ale magazinului: identitate, navigație, contact.
// Tot ce e afișat în antet, subsol și în datele structurate pleacă de aici.

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "Filler Store",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://www.fillerstore.ro").replace(/\/+$/, ""),
  locale: "ro_RO",
  lang: "ro",
  tagline: "Produse acid hialuronic, mezoterapie și altele",
  description:
    "Comercializăm produse pe bază de acid hialuronic și mezoterapie de la branduri de top precum Revolax, certificate și de cea mai bună calitate. Produsele ajută la reîntinerirea pielii, hidratarea profundă și tratarea ridurilor, cu rezultate naturale și de lungă durată.",
  // Banda de anunț de sub antet (aceleași mesaje ca pe site-ul actual).
  announcements: [
    "Transport gratuit la comenzile peste 600 lei",
    "Livrare rapidă în 48 de ore",
    "Oferte exclusive!",
  ],
  company: {
    legalName: "DENTAL PLUS MARKET S.R.L.",
    cui: "40464670",
    address: {
      street: "Sat Odobești, Comuna Odobești, Nr. 410",
      region: "Județ Bacău",
      country: "RO",
    },
  },
  nav: [
    { href: "/", label: "Acasă" },
    { href: "/produse", label: "Produse" },
    { href: "/blog", label: "Blog" },
    { href: "/despre", label: "Despre" },
    { href: "/contact-us", label: "Contact" },
  ],
  footer: [
    {
      title: "Magazin",
      links: [
        { href: "/produse", label: "Toate produsele" },
        { href: "/produse?categorie=acid-hialuronic", label: "Acid hialuronic" },
        { href: "/produse?categorie=mezoterapie", label: "Mezoterapie" },
        { href: "/produse?categorie=creme-anestezice", label: "Creme anestezice" },
        { href: "/produse?categorie=lipolitice", label: "Lipolitice" },
      ],
    },
    {
      title: "Informații",
      links: [
        { href: "/livrare-si-plata", label: "Livrare și plată" },
        { href: "/returnare", label: "Returnare" },
        { href: "/faq", label: "Întrebări frecvente" },
        { href: "/contact-us", label: "Contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { href: "/termeni-si-conditii-fillerstore-ro", label: "Termeni și condiții" },
        { href: "/politica-de-confidentialitate", label: "Confidențialitate" },
        { href: "/politica-de-cookies", label: "Cookies" },
      ],
    },
  ],

  external: [
    { href: "https://anpc.ro/", label: "ANPC" },
    { href: "https://ec.europa.eu/consumers/odr", label: "SOL" },
  ],
  // Cele trei promisiuni de sub hero (preluate de pe site-ul actual).
  trust: [
    { icon: "✦", kicker: "Transport", title: "Livrare rapidă și sigură", text: "Expediere în 48–72 de ore, ambalat corespunzător, în toată România." },
    { icon: "✓", kicker: "Suport", title: "24/7 suport clienți", text: "Consiliere pe produs și protocol, de la oameni care cunosc domeniul." },
    { icon: "◆", kicker: "Calitate", title: "Calitate testată", text: "Produse originale, de la distribuitori autorizați, cu trasabilitate completă." },
  ],

  // Cele patru argumente de produs.
  features: [
    { title: "Hidratare intensă", text: "Formule avansate care oferă hidratare profundă și de lungă durată." },
    { title: "Protecție naturală", text: "Ingrediente naturale pentru a proteja și revitaliza pielea sensibilă." },
    { title: "Testat dermatologic", text: "Produse testate dermatologic, potrivite pentru toate tipurile de piele." },
    { title: "Siguranță garantată", text: "Produse fără parabeni, sigure pentru uz frecvent și profesional." },
  ],

  // Argumentele afișate în banda derulantă de sub antet.
  usps: [
    { icon: "✦", text: "Calitate premium" },
    { icon: "✓", text: "Hidratare intensă garantată" },
    { icon: "◆", text: "Livrare rapidă" },
    { icon: "✦", text: "Rezultate vizibile" },
    { icon: "✓", text: "Produse testate dermatologic" },
    { icon: "◆", text: "Rezultate naturale rapide" },
  ],
};

export const absoluteUrl = (path = "/") =>
  `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
