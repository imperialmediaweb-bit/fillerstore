// Datele fixe ale magazinului: identitate, navigație, contact.
// Tot ce e afișat în antet, subsol și în datele structurate pleacă de aici.

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "Filler Store",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://fillerstore.ro").replace(/\/+$/, ""),
  locale: "ro_RO",
  lang: "ro",
  tagline: "Fillere și produse profesionale de înfrumusețare",
  description:
    "Magazin specializat în produse pe bază de acid hialuronic și produse de înfrumusețare profesionale, la prețuri accesibile și calitate de top pentru clinici și saloane.",
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
    { href: "/contact", label: "Contact" },
  ],
  footer: [
    {
      title: "Magazin",
      links: [
        { href: "/produse", label: "Toate produsele" },
        { href: "/blog", label: "Blog" },
        { href: "/despre", label: "Despre noi" },
        { href: "/contact", label: "Contact" },
      ],
    },
    {
      title: "Informații",
      links: [
        { href: "/livrare-si-plata", label: "Livrare și plată" },
        { href: "/returnare", label: "Returnare" },
        { href: "/intrebari-frecvente", label: "Întrebări frecvente" },
      ],
    },
    {
      title: "Legal",
      links: [
        { href: "/termeni-si-conditii", label: "Termeni și condiții" },
        { href: "/confidentialitate", label: "Confidențialitate" },
        { href: "/cookies", label: "Cookies" },
      ],
    },
  ],
  external: [
    { href: "https://anpc.ro/", label: "ANPC" },
    { href: "https://ec.europa.eu/consumers/odr", label: "SOL" },
  ],
  // Argumentele afișate în banda derulantă de sub antet.
  usps: [
    { icon: "✦", text: "Transport rapid în toată România" },
    { icon: "✓", text: "Produse originale, testate dermatologic" },
    { icon: "◆", text: "Livrare gratuită peste 600 lei" },
    { icon: "✦", text: "Suport dedicat pentru clinici și saloane" },
    { icon: "✓", text: "Plata online securizată sau ramburs" },
    { icon: "◆", text: "Livrare în 48–72 de ore" },
  ],
};

export const absoluteUrl = (path = "/") =>
  `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
