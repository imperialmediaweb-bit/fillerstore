import Link from "next/link";

// Firimiturile de navigație. Perechea lor în date structurate se pune din
// pagină cu breadcrumbLd(items) — Google le arată sub titlul rezultatului.
export default function Breadcrumbs({ items = [] }) {
  return (
    <nav className="crumbs" aria-label="Firimituri de navigație">
      {items.map((item, i) => (
        <span key={item.href || item.label}>
          {i > 0 && <span aria-hidden="true"> / </span>}
          {item.href ? <Link href={item.href}>{item.label}</Link> : <b aria-current="page">{item.label}</b>}
        </span>
      ))}
    </nav>
  );
}
