const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Filler Store";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <p>© {new Date().getFullYear()} {SITE_NAME}. Toate drepturile rezervate.</p>
      </div>
    </footer>
  );
}
