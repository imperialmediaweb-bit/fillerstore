import { siteConfig } from "@/lib/site";

// Banda derulantă cu argumentele magazinului. Grupul se repetă de două ori
// ca bucla să fie continuă; la hover se oprește, ca să poată fi citită.
export default function Marquee({ items = siteConfig.usps }) {
  const group = (
    <div className="marquee__group" aria-hidden="true">
      {items.map((item, i) => (
        <span className="marquee__item" key={i}>
          <i>{item.icon}</i>
          {item.text}
        </span>
      ))}
    </div>
  );

  return (
    <div className="marquee">
      <p className="sr-only">{items.map((i) => i.text).join(". ")}</p>
      <div className="marquee__track">
        {group}
        {group}
      </div>
    </div>
  );
}
