// Banda de cifre. Se afișează doar valorile reale primite — nimic inventat.
export default function Stats({ items = [] }) {
  const list = items.filter((s) => s?.value);
  if (!list.length) return null;

  return (
    <div className="stats">
      {list.map((s) => (
        <div className="stats__item" key={s.label}>
          <b>{s.value}</b>
          <span>{s.label}</span>
        </div>
      ))}
    </div>
  );
}
