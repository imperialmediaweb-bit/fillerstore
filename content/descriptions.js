// Descrierile scrise de noi pentru produse.
//
// Au prioritate față de textele care vin din WooCommerce, deci rezistă la
// orice reimport (`npm run refresh`). Potrivirea se face după slug SAU după
// numele produsului normalizat, ca să meargă chiar dacă slug-ul din
// WooCommerce diferă de cel de aici.
//
// ATENȚIE, de verificat înainte de publicare: cifrele tehnice (concentrație,
// durată, protocol) sunt cele comunicate în mod obișnuit de producători.
// Confirmă-le cu prospectul lotului pe care îl vinzi — sunt dispozitive
// medicale, iar specificațiile se pot schimba între generații de produs.
//
// Toate textele spun explicit că produsele sunt pentru uz profesional.

export const productCopy = {
  // ---------------------------------------------------------------- Profhilo
  "profhilo-h-l-2ml": {
    match: ["profhilo h+l 2ml", "profhilo hl 2ml", "profhilo h l 2ml", "profhilo"],
    seoTitle: "Profhilo H+L 2ml — bio-remodelare cu acid hialuronic",
    shortDescription:
      "<p>Bio-remodelare injectabilă cu acid hialuronic pur, fără agent de reticulare. Nu adaugă volum — redensifică pielea laxă și îi redă fermitatea și strălucirea.</p>",
    description: `
<h2>Ce este Profhilo H+L</h2>
<p>Profhilo nu este un filler. Este un produs de <strong>bio-remodelare</strong>: în loc să umple un rid sau să creeze volum, se răspândește în țesut și stimulează pielea să-și refacă singură structura. De aceea se folosește acolo unde problema nu e o linie anume, ci calitatea generală a pielii — laxitate, textură neregulată, aspect obosit.</p>

<h3>Ce îl face diferit</h3>
<p>Formula combină acid hialuronic cu greutate moleculară mare și mică (de aici „H+L"), stabilizate termic, <strong>fără BDDE sau alt agent de reticulare</strong>. Concentrația de acid hialuronic este printre cele mai ridicate de pe piață — 64 mg în seringa de 2 ml.</p>
<ul>
  <li><strong>Hidratare de profunzime</strong> — componenta cu greutate moleculară mare reține apa în derm.</li>
  <li><strong>Stimulare tisulară</strong> — componenta cu greutate moleculară mică susține sinteza de colagen și elastină.</li>
  <li><strong>Fără reticulare</strong> — se resoarbe complet, natural, fără reziduuri.</li>
  <li><strong>Fără volum adăugat</strong> — trăsăturile rămân neschimbate, se schimbă doar calitatea pielii.</li>
</ul>

<h3>Pentru ce zone se folosește</h3>
<p>Cel mai frecvent pe față, gât și dosul mâinilor — zonele unde laxitatea se vede primele. Se administrează prin tehnica BAP (Bio Aesthetic Points), cu un număr redus de puncte de injectare pe fiecare parte, ceea ce scurtează mult procedura și reduce disconfortul.</p>

<h3>Protocol orientativ</h3>
<p>Schema uzuală este de <strong>două ședințe la interval de patru săptămâni</strong>, cu întreținere la aproximativ șase luni. Protocolul exact rămâne la aprecierea medicului, în funcție de pacient.</p>

<h3>Ambalaj</h3>
<p>O seringă preumplută de 2 ml, cu ace incluse. Produs destinat exclusiv utilizării de către medici și personal medical calificat.</p>
`,
    faq: [
      { q: "Profhilo adaugă volum feței?", a: "Nu. Profhilo este un produs de bio-remodelare, nu un filler. Nu modifică trăsăturile și nu creează volum — acționează asupra calității pielii: fermitate, hidratare, textură." },
      { q: "Câte ședințe sunt necesare?", a: "Protocolul standard prevede două ședințe la patru săptămâni distanță, urmate de întreținere la circa șase luni. Medicul poate ajusta schema în funcție de starea pielii." },
      { q: "Se poate combina cu fillere?", a: "Da, este frecvent folosit împreună cu fillere dermice, pentru că rezolvă o problemă diferită: unul îmbunătățește calitatea pielii, celălalt restaurează volumul. Succesiunea și intervalul le stabilește medicul." },
    ],
  },

  // -------------------------------------------------------------- Restylane
  "restylane-defyne-1ml": {
    match: ["restylane defyne 1ml", "restylane defyne"],
    seoTitle: "Restylane Defyne 1ml — filler flexibil pentru riduri profunde",
    shortDescription:
      "<p>Filler dermic cu acid hialuronic din gama Restylane, formulat să rămână flexibil în mișcare. Pentru pliuri nazolabiale profunde, linii de marionetă și definirea bărbiei.</p>",
    description: `
<h2>Restylane Defyne 1 ml</h2>
<p>Defyne face parte din familia Restylane construită pe tehnologia <strong>XpresHAn</strong>, gândită special pentru zonele feței care se mișcă mult. Gelul are o elasticitate suficientă cât să susțină țesutul, dar și să se deformeze odată cu mimica — de aceea rezultatul rămâne natural când pacientul vorbește, râde sau se încruntă.</p>

<h3>Indicații uzuale</h3>
<ul>
  <li><strong>Pliuri nazolabiale profunde</strong> — corecție cu susținere, fără efect de „rigidizare".</li>
  <li><strong>Linii de marionetă</strong> — zona cea mai solicitată de mimică, unde flexibilitatea contează cel mai mult.</li>
  <li><strong>Definirea bărbiei</strong> — proiecție și contur, cu tranziție naturală spre țesutul din jur.</li>
</ul>

<h3>Confortul pacientului</h3>
<p>Formula conține <strong>lidocaină</strong>, ceea ce reduce semnificativ disconfortul din timpul injectării și scurtează pregătirea procedurii.</p>

<h3>Durata rezultatului</h3>
<p>Rezultatele se mențin în mod obișnuit <strong>în jur de 12 luni</strong>, în funcție de zonă, de cantitatea folosită și de metabolismul fiecărui pacient.</p>

<h3>Ambalaj</h3>
<p>Seringă preumplută de 1 ml, cu ace sterile incluse. Dispozitiv medical destinat exclusiv administrării de către medici cu pregătire în estetică injectabilă.</p>
`,
    faq: [
      { q: "Prin ce diferă Defyne de Refyne?", a: "Ambele folosesc tehnologia XpresHAn, dar Defyne are o susținere mai fermă, potrivită pliurilor profunde și bărbiei, în timp ce Refyne este mai moale, pentru linii moderate." },
      { q: "Conține anestezic?", a: "Da, formula include lidocaină, pentru un disconfort redus în timpul injectării." },
      { q: "Cât durează efectul?", a: "În general în jur de 12 luni. Durata variază cu zona tratată, cantitatea administrată și metabolismul pacientului." },
    ],
  },

  "restylane-eyelight-0-5ml": {
    match: ["restylane eyelight 0.5ml", "restylane eyelight 05ml", "restylane eyelight"],
    seoTitle: "Restylane Eyelight 0.5ml — filler pentru zona infraorbitală",
    shortDescription:
      "<p>Filler creat special pentru zona de sub ochi. Corectează șanțul lacrimal și aspectul de oboseală, cu retenție de apă redusă — exact ce trebuie într-o zonă atât de delicată.</p>",
    description: `
<h2>Restylane Eyelight 0.5 ml</h2>
<p>Zona infraorbitală este cea mai puțin iertătoare de pe față: pielea e subțire, țesutul e sărac, iar un produs care atrage prea multă apă lasă imediat umflătură vizibilă. Eyelight este formulat tocmai pentru acest context — un gel cu <strong>retenție hidrică scăzută</strong>, care corectează golul fără să încarce zona.</p>

<h3>Ce rezolvă</h3>
<ul>
  <li><strong>Șanțul lacrimal</strong> — umbra care dă permanent aspect de oboseală.</li>
  <li><strong>Golul infraorbital</strong> — pierderea de volum care adâncește privirea.</li>
  <li><strong>Tranziția obraz–pleoapă</strong> — netezirea trecerii, pentru un aspect odihnit.</li>
</ul>

<h3>De ce contează formula</h3>
<p>Într-o zonă unde diferența dintre un rezultat bun și unul vizibil greșit este de zecimi de mililitru, comportamentul gelului în timp contează mai mult decât cantitatea injectată. Formula este construită să rămână stabilă și discretă, fără efectul de „pungă" care apare când produsul atrage apă.</p>

<h3>Ambalaj</h3>
<p>Seringă de 0,5 ml — volum potrivit unei zone unde se lucrează în cantități mici. Dispozitiv medical rezervat medicilor cu experiență în tratarea zonei periorbitale.</p>
`,
    faq: [
      { q: "De ce un produs separat pentru sub ochi?", a: "Pentru că zona are pielea foarte subțire și un produs obișnuit poate atrage apă și lăsa umflătură. Eyelight este formulat cu retenție hidrică redusă, tocmai ca să evite acest efect." },
      { q: "De ce seringa este de doar 0,5 ml?", a: "Pentru că în zona infraorbitală se lucrează cu cantități mici. Un volum mai mare ar fi risipă și ar încuraja supracorecția." },
      { q: "Cine poate administra produsul?", a: "Doar medici cu pregătire specifică în zona periorbitală — este una dintre cele mai pretențioase zone din estetica injectabilă." },
    ],
  },

  "restylane-lyft-1x1ml": {
    match: ["restylane lyft (1 x 1ml)", "restylane lyft 1x1ml", "restylane lyft"],
    seoTitle: "Restylane Lyft 1ml — volumizare pentru pomeți și contur",
    shortDescription:
      "<p>Filler cu susținere fermă, pentru volumizare și proiecție. Indicat la pomeți, contur facial și corectarea aspectului îmbătrânit al dosului mâinilor.</p>",
    description: `
<h2>Restylane Lyft 1 ml</h2>
<p>Lyft este produsul din gama Restylane destinat situațiilor în care nu se corectează o linie, ci se <strong>reconstruiește structura</strong>. Gelul are o consistență fermă și o capacitate de proiecție ridicată, ceea ce îl face potrivit pentru zonele unde este nevoie de susținere reală, nu de netezire.</p>

<h3>Indicații uzuale</h3>
<ul>
  <li><strong>Pomeți</strong> — restaurarea volumului pierdut și ridicarea etajului mijlociu al feței.</li>
  <li><strong>Contur facial</strong> — definirea liniei mandibulare și a bărbiei.</li>
  <li><strong>Dosul mâinilor</strong> — acoperirea tendoanelor și venelor devenite proeminente odată cu vârsta.</li>
</ul>

<h3>Tehnologia NASHA</h3>
<p>Lyft folosește tehnologia NASHA, care produce un gel cu structură fermă și comportament predictibil în țesut. Practic: rezultatul se vede imediat și rămâne acolo unde a fost plasat.</p>

<h3>Durata rezultatului</h3>
<p>Volumizarea se menține în general <strong>între 12 și 18 luni</strong>, în funcție de zonă și de cantitatea administrată. Zonele cu mobilitate mare metabolizează produsul mai repede.</p>

<h3>Ambalaj</h3>
<p>Seringă preumplută de 1 ml, cu ace incluse. Produs pentru uz profesional.</p>
`,
    faq: [
      { q: "Ce diferență este între Lyft și Volyme?", a: "Lyft are susținere mai fermă și proiecție mai mare, potrivit pentru structură și contur. Volyme este mai flexibil, gândit pentru volum care trebuie să însoțească mimica." },
      { q: "Se poate folosi pe mâini?", a: "Da, este una dintre indicațiile pentru care este folosit frecvent — acoperă tendoanele și venele devenite vizibile." },
      { q: "Cât ține rezultatul?", a: "În mod obișnuit între 12 și 18 luni, în funcție de zonă, cantitate și metabolism." },
    ],
  },

  "restylane-volyme-lidocaine-1ml": {
    match: ["restylane volyme lidocaine (1ml)", "restylane volyme lidocaine 1ml", "restylane volyme"],
    seoTitle: "Restylane Volyme Lidocaine 1ml — volum natural în mișcare",
    shortDescription:
      "<p>Filler volumizant flexibil, cu lidocaină. Reface volumul etajului mijlociu al feței fără să blocheze expresia — volumul rămâne natural și când pacientul zâmbește.</p>",
    description: `
<h2>Restylane Volyme Lidocaine 1 ml</h2>
<p>Problema clasică a volumizării este că un produs prea rigid arată bine în repaus și artificial în mișcare. Volyme rezolvă exact asta: construit pe tehnologia <strong>XpresHAn</strong>, susține volumul dar se deformează odată cu mușchii feței, astfel încât rezultatul rămâne credibil în expresie.</p>

<h3>Indicații uzuale</h3>
<ul>
  <li><strong>Etajul mijlociu al feței</strong> — refacerea volumului pierdut la nivelul obrajilor.</li>
  <li><strong>Zona zigomatică</strong> — proiecție cu tranziție naturală.</li>
  <li><strong>Corecția aspectului supt</strong> — redarea plinătății feței, fără efect de mască.</li>
</ul>

<h3>Confortul pacientului</h3>
<p>Formula conține <strong>lidocaină</strong>, ceea ce reduce disconfortul în timpul procedurii — un avantaj real la volumele mai mari, unde ședința durează mai mult.</p>

<h3>Durata rezultatului</h3>
<p>Se menține de regulă <strong>12–18 luni</strong>, în funcție de zonă și de cantitatea administrată.</p>

<h3>Ambalaj</h3>
<p>Seringă preumplută de 1 ml, cu ace sterile incluse. Dispozitiv medical pentru uz profesional.</p>
`,
    faq: [
      { q: "De ce Volyme și nu Lyft pentru pomeți?", a: "Depinde de obiectiv. Lyft dă proiecție fermă și structură; Volyme dă volum care se mișcă natural cu mimica. Alegerea ține de anatomia pacientului și de rezultatul urmărit." },
      { q: "Conține anestezic?", a: "Da, conține lidocaină, pentru un disconfort redus în timpul injectării." },
      { q: "Rezultatul se vede imediat?", a: "Da, volumul este vizibil din timpul ședinței. Aspectul final se stabilizează după ce trece edemul post-procedural." },
    ],
  },

  // ----------------------------------------------------------------- Revolax
  "revolax-fine-lidocaina-1x1-1ml": {
    match: ["revolax fine lidocaină (1x 1.1ml)", "revolax fine lidocaina 1x 1.1ml", "revolax fine"],
    seoTitle: "Revolax Fine cu lidocaină 1.1ml — riduri fine și linii superficiale",
    shortDescription:
      "<p>Filler monofazic cu acid hialuronic și lidocaină, cu particulă fină. Pentru ridurile superficiale, liniile periorale și conturul delicat al buzelor.</p>",
    description: `
<h2>Revolax Fine cu lidocaină, 1,1 ml</h2>
<p>Revolax este gama coreeană care a devenit un reper de raport calitate–preț în estetica injectabilă. <strong>Fine</strong> este varianta cea mai fluidă din gamă, destinată injectării superficiale, acolo unde un gel dens ar lăsa neregularități vizibile.</p>

<h3>Indicații uzuale</h3>
<ul>
  <li><strong>Riduri fine</strong> — linii periorbitale și periorale.</li>
  <li><strong>„Codul de bare"</strong> — liniile verticale de deasupra buzei superioare.</li>
  <li><strong>Conturul buzelor</strong> — definire delicată, fără adăugare de volum.</li>
  <li><strong>Riduri frontale superficiale</strong> — netezire discretă.</li>
</ul>

<h3>Gel monofazic</h3>
<p>Formula monofazică se distribuie uniform în țesut și se modelează ușor imediat după injectare — un avantaj practic în zonele unde precizia contează mai mult decât volumul.</p>

<h3>Confort și durată</h3>
<p>Conține <strong>lidocaină</strong>, pentru un disconfort redus. Rezultatele se mențin în mod obișnuit <strong>între 12 și 18 luni</strong>, în funcție de zonă și de mobilitatea acesteia.</p>

<h3>Ambalaj</h3>
<p>Seringă preumplută de 1,1 ml, cu ace incluse. Produs destinat exclusiv utilizării profesionale.</p>
`,
    faq: [
      { q: "Care e diferența între Fine, Deep și Sub-Q?", a: "Densitatea gelului și adâncimea de injectare. Fine este cel mai fluid, pentru riduri superficiale; Deep este mediu, pentru pliuri și buze; Sub-Q este cel mai dens, pentru volumizare profundă." },
      { q: "Se poate folosi pe buze?", a: "Pentru conturul buzelor, da. Pentru volum în buze se folosește de obicei Deep, care are susținere mai mare." },
      { q: "Cât durează efectul?", a: "În general 12–18 luni. Zonele cu mimică intensă metabolizează produsul mai repede." },
    ],
  },

  "revolax-deep-lidocaina-1x1-1ml": {
    match: ["revolax deep lidocaină (1x 1.1ml)", "revolax deep lidocaina 1x 1.1ml", "revolax deep"],
    seoTitle: "Revolax Deep cu lidocaină 1.1ml — riduri profunde și volum în buze",
    shortDescription:
      "<p>Cel mai versatil produs din gama Revolax: filler monofazic cu lidocaină, pentru pliuri nazolabiale, linii de marionetă și volumizarea buzelor.</p>",
    description: `
<h2>Revolax Deep cu lidocaină, 1,1 ml</h2>
<p><strong>Deep</strong> este varianta cea mai folosită din gama Revolax, pentru că acoperă majoritatea indicațiilor de cabinet. Are densitate medie — suficientă pentru susținere reală în pliurile profunde, dar destul de maleabilă pentru buze.</p>

<h3>Indicații uzuale</h3>
<ul>
  <li><strong>Pliuri nazolabiale</strong> — corecție cu susținere de durată.</li>
  <li><strong>Linii de marionetă</strong> — netezirea colțurilor coborâte ale gurii.</li>
  <li><strong>Volumizarea buzelor</strong> — volum și proiecție, cu textură naturală.</li>
  <li><strong>Conturarea bărbiei</strong> — definire moderată.</li>
</ul>

<h3>De ce se lucrează bine cu el</h3>
<p>Gelul monofazic se distribuie uniform și se modelează ușor imediat după injectare, ceea ce lasă loc de ajustare în timpul procedurii. Conține <strong>lidocaină</strong>, deci procedura e semnificativ mai confortabilă pentru pacient — un aspect care contează mult la buze.</p>

<h3>Durata rezultatului</h3>
<p>De regulă <strong>12–18 luni</strong>. În buze, unde mobilitatea este maximă, durata este de obicei spre limita inferioară a intervalului.</p>

<h3>Ambalaj</h3>
<p>Seringă preumplută de 1,1 ml, cu ace incluse. Produs pentru uz profesional.</p>
`,
    faq: [
      { q: "Este potrivit pentru buze?", a: "Da, este una dintre cele mai frecvente utilizări ale sale — oferă volum și proiecție, păstrând o textură naturală la atingere." },
      { q: "Cât durează în buze?", a: "De obicei spre 12 luni. Buzele sunt zona cu cea mai mare mobilitate, deci produsul se metabolizează mai repede decât în alte zone." },
      { q: "Conține anestezic?", a: "Da, conține lidocaină — un avantaj important la tratamentul buzelor, care este sensibil." },
    ],
  },

  "revolax-sub-q-lidocaine-1x1-1ml": {
    match: ["revolax sub-q lidocaine (1x 1.1ml)", "revolax sub q lidocaine 1x 1.1ml", "revolax sub-q", "revolax sub q"],
    seoTitle: "Revolax Sub-Q cu lidocaină 1.1ml — volumizare profundă și contur",
    shortDescription:
      "<p>Cel mai dens filler din gama Revolax, cu lidocaină. Pentru volumizare profundă: pomeți, bărbie, linie mandibulară — acolo unde e nevoie de proiecție reală.</p>",
    description: `
<h2>Revolax Sub-Q cu lidocaină, 1,1 ml</h2>
<p><strong>Sub-Q</strong> este varianta de densitate maximă din gamă, destinată injectării profunde, subcutanat sau supraperiostal. Nu este un produs pentru netezit linii — este un produs pentru <strong>a construi structură</strong>.</p>

<h3>Indicații uzuale</h3>
<ul>
  <li><strong>Pomeți</strong> — proiecție și ridicarea etajului mijlociu.</li>
  <li><strong>Bărbie</strong> — alungire și definire a profilului.</li>
  <li><strong>Linia mandibulară</strong> — contur ferm, delimitare clară.</li>
  <li><strong>Corecția asimetriilor</strong> — echilibrarea volumelor faciale.</li>
</ul>

<h3>Ce înseamnă densitatea mare</h3>
<p>Un gel dens rezistă la presiunea țesutului și își păstrează forma, deci proiecția obținută rămâne. În schimb, cere plasare profundă și mână experimentată — injectat superficial, devine vizibil sau palpabil.</p>

<h3>Confort și durată</h3>
<p>Conține <strong>lidocaină</strong>. Fiind un produs dens, plasat profund, durata este de regulă spre partea superioară a intervalului: <strong>15–18 luni</strong>, uneori mai mult.</p>

<h3>Ambalaj</h3>
<p>Seringă preumplută de 1,1 ml, cu ace incluse. Produs rezervat medicilor cu experiență în volumizare profundă.</p>
`,
    faq: [
      { q: "La ce adâncime se injectează?", a: "Profund — subcutanat sau supraperiostal, în funcție de zonă. Plasarea superficială poate face produsul vizibil sau palpabil." },
      { q: "Se poate folosi pe buze?", a: "Nu este indicat. Pentru buze se folosește Deep; Sub-Q este prea dens pentru această zonă." },
      { q: "Cât ține rezultatul?", a: "De obicei 15–18 luni, uneori mai mult — fiind un gel dens plasat profund, se metabolizează mai lent." },
    ],
  },
};

// Normalizare pentru potrivirea după nume: fără diacritice, fără semne,
// spații colapsate. „Revolax Deep Lidocaină (1x 1.1ml)" → "revolax deep lidocaina 1x 1 1ml"
export function normalizeName(text = "") {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

// Index construit o singură dată: slug și fiecare variantă de nume → copy.
const index = (() => {
  const map = new Map();
  for (const [slug, copy] of Object.entries(productCopy)) {
    map.set(slug, copy);
    map.set(normalizeName(slug), copy);
    for (const alias of copy.match || []) map.set(normalizeName(alias), copy);
  }
  return map;
})();

/** Găsește descrierea scrisă de noi pentru un produs, după slug sau nume. */
export function copyForProduct(product) {
  if (!product) return null;
  return (
    index.get(product.slug) ||
    index.get(normalizeName(product.slug || "")) ||
    index.get(normalizeName(product.name || "")) ||
    null
  );
}
