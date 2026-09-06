// Se arată doar când nu există conținut: nici importat local, nici preluat
// în direct din WordPress. Spune limpede ce mai e de făcut.
export default function SetupNotice({ configured }) {
  return (
    <div className="setup-notice">
      <h2>Mai e un pas: conținutul</h2>
      {configured ? (
        <>
          <p>
            Adresa WordPress e setată, dar nu am primit conținut de la ea.
            Verifică dacă <code>WORDPRESS_URL</code> e corectă și dacă API-ul
            public răspunde — testul rapid, în browser:{" "}
            <code>WORDPRESS_URL/wp-json/wp/v2/posts</code>.
          </p>
          <p>
            Ca site-ul să nu mai depindă deloc de WordPress, rulează importul:{" "}
            <code>npm run import</code>, apoi <code>npm run upload-media</code>.
          </p>
        </>
      ) : (
        <>
          <p>
            Rulează importul o dată, ca produsele, articolele, paginile și
            pozele să intre în site:
          </p>
          <p>
            <code>WORDPRESS_URL=https://fillerstore.ro npm run import</code>
            <br />
            <code>npm run upload-media</code>
          </p>
          <p>
            Alternativ, setează doar <code>WORDPRESS_URL</code> ca variabilă de
            mediu și conținutul se ia în direct din WordPress, la fiecare 5 minute.
          </p>
        </>
      )}
    </div>
  );
}
