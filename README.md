# Filler Store — site Next.js (headless WordPress)

Frontend modern **Next.js** pentru site-ul WordPress existent. Conținutul
(produse, articole, pagini, poze) se preia automat din WordPress prin
API-urile publice — nu se copiază nimic manual:

- **produse** din WooCommerce (`/wp-json/wc/store/v1/products`) — cu
  **slider de poze** pe fiecare pagină de produs;
- **slider mare** pe prima pagină, cu autoplay;
- **blog** și **paginile WordPress** (Despre, Contact...) servite la
  aceleași adrese (`/contact`, `/despre-noi` etc.);
- totul în română, rapid, optimizat pentru mobil.

Conținutul se reîmprospătează singur la 5 minute — orice modifici în
WordPress apare automat și aici.

## Publicare pe Railway

1. În Railway: **New Project → Deploy from GitHub repo** → alege acest repo.
2. La **Variables** adaugă:

   | Variabilă | Valoare |
   |---|---|
   | `WORDPRESS_URL` | adresa site-ului WordPress, ex. `https://exemplu.ro` |
   | `NEXT_PUBLIC_SITE_NAME` | numele magazinului (opțional) |

3. Railway detectează singur Next.js (build: `npm run build`, pornire:
   `npm start`). După deploy, la **Settings → Networking → Generate Domain**
   primești adresa publică; acolo poți lega și domeniul tău.

Dacă prima pagină afișează „Conectează site-ul WordPress", înseamnă că
`WORDPRESS_URL` lipsește sau API-ul nu răspunde — test rapid în browser:
`https://site-ul-tau.ro/wp-json/wp/v2/posts` trebuie să întoarcă JSON.

## Rulare locală

```
npm install
cp .env.example .env   # completează WORDPRESS_URL
npm run dev
```

## Observații

- Butonul **„Comandă acum"** duce deocamdată la pagina produsului din
  WordPress (coșul și plata rămân pe WooCommerce). Coșul poate fi mutat
  ulterior integral în Next.js prin Store API.
- Pozele se servesc direct de pe WordPress; nu e nevoie de nicio copiere.
