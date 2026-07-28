// Se afișează doar când WORDPRESS_URL nu e setat sau nu răspunde —
// ca să fie limpede ce mai e de configurat pe Railway.
export default function SetupNotice({ configured }) {
  return (
    <div className="setup-notice">
      <h2>Conectează site-ul WordPress</h2>
      {configured ? (
        <p>
          Adresa WordPress e setată, dar nu am primit conținut de la ea.
          Verifică dacă <code>WORDPRESS_URL</code> e corectă și dacă API-ul
          public e activ (test: <code>WORDPRESS_URL/wp-json/wp/v2/posts</code>).
        </p>
      ) : (
        <p>
          Setează variabila <code>WORDPRESS_URL</code> în Railway
          (Settings → Variables) cu adresa site-ului tău WordPress,
          de exemplu <code>https://exemplu.ro</code>. Produsele, articolele
          și pozele se preiau automat de acolo.
        </p>
      )}
    </div>
  );
}
