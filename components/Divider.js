// Despărțitor între secțiuni.
//
// „ornament" — o linie fină care se stinge spre margini, cu o piatră mică
//              în mijloc; se folosește între secțiunile deschise.
// „arch"     — arc subțire, ca marginea de sus a unei oglinzi de salon.
export default function Divider({ variant = "ornament", label }) {
  if (variant === "arch") {
    return (
      <div className="divider divider--arch" aria-hidden="true">
        <svg viewBox="0 0 1200 60" preserveAspectRatio="none" focusable="false">
          <path d="M0,60 C300,0 900,0 1200,60" fill="none" />
        </svg>
      </div>
    );
  }

  return (
    <div className="divider" role={label ? undefined : "presentation"}>
      <span className="divider__line" aria-hidden="true" />
      {label ? <span className="divider__label">{label}</span> : <span className="divider__gem" aria-hidden="true" />}
      <span className="divider__line" aria-hidden="true" />
    </div>
  );
}
