// data/products.ts


export type Availability =
  | "unavailable" // NICHT LIEFERBAR
  | "restock"     // Nichts auf Lager, Nachschub ist unterwegs
  | "1-3"         // Lieferzeit 1-3 Werktage
  | "5-7";        // Lieferzeit 5-7 Werktage

export type Product = {
  id: string;
  name: string;
  price: number;           // aktueller Preis (z. B. rabattierter Preis)
  originalPrice?: number; // optionaler „Alter Preis“ (durchgestrichen)
  description: string;
  image: string;
  tagline: string;
  details: string[];
  isNew?: boolean;
  category?: string;

  availability: Availability; // ✅ NEU
};

export const products: Product[] = [
  {
    id: "meryemb-set",
    name: "Meryem Boral Trilogie-Set",
    price: 29.99,
    originalPrice: 36.97,
    description:
      "Von Ohne Liebe bis HERZBLUT – eine Reise durch toxische Liebe, Verlust und Selbstheilung.",
    image: "/images/MB-Trio.png",
    tagline:
      "Du bekommst mit diesem Set alle drei Bücher von Meryem Boral in einem Bundle – perfekt, wenn du ihre Geschichte nicht nur anreißen, sondern komplett fühlen willst. Drei Bände, drei Phasen, ein roter Faden: rohe Ehrlichkeit, ungeschönte Gefühle und Texte, die sich nicht dafür entschuldigen, dass sie weh tun. In diesen Büchern schreibt Meryem nicht „über“ Gefühle – sie schreibt aus ihnen heraus. Über Beziehungen, die dich kaputt machen und trotzdem nicht loslassen. Über Loyalität, die viel zu oft nur in eine Richtung geht. Über Angst, Zweifel, Wut – aber auch darüber, wie man Stück für Stück wieder bei sich selbst ankommt. Keine weichgespülten Sprüche, kein Kalender-Gelaber, sondern Sätze, die du nachts im Kopf mit dir rumträgst. Die drei Bücher ergänzen sich inhaltlich wie Kapitel eines größeren Ganzen: Vergangenheit, die nicht loslässt. Gefühle, die man eigentlich nie mehr anfassen wollte. Und der Moment, in dem du merkst, dass dein Herz nicht nur zum Zerbrechen da ist, sondern auch zum Heilen. Ob du alles in einem Rutsch liest oder dir jede Seite einteilst – dieses Set ist nicht einfach „Lesestoff“. Es ist Begleitung. Für die Nächte, in denen du glaubst, allein mit all dem zu sein. Und für die Tage, an denen du endlich verstehst: Du warst es nie. Wenn du Meryem schon länger verfolgst, ist dieses 3er-Set die logische Konsequenz. Wenn du neu bist: Es ist der ehrlichste Einstieg, den du bekommen kannst.",
    details: [
      "📕 Alle 3 Bücher von Meryem Boral",
      "🌍 Deutsche Ausführung",
      "📏 Alle im `A5` Format",
      "2025 © Publishing by 4aCe. Alle Rechte vorbehalten.",
    ],
    isNew: true,
    category: "meryem-boral",

    // ✅ Empfehlung: Bundle meist etwas länger
    availability: "5-7",
  },
  {
    id: "herzblut-2025",
    name: "HERZBLUT",
    price: 13.49,
    description: "Gebundene Ausgabe – 7. Oktober 2025",
    image: "/images/herzblut-cover.png",
    tagline:
      "Als Firuze Tuna den Mut findet, sich ihrer Therapeutin Frau Hemming zu öffnen, bricht eine Flut von Erinnerungen hervor. Stück für Stück erzählt sie von einer Liebe, die alles versprach - und sie schließlich zerbrach. Was einmal Herzblut war, wurde zu Schmerz, der nicht mehr loslässt. Doch die Vergangenheit bleibt nicht in der Vergangenheit. Auch ihre neue Beziehung trägt die Narben dieser zerstörerischen Liebe, bis sie zerfällt unter der Last dessen, was Firuze erlebt hat. Herzblut ist ein zerbrechliches, eindringliches und zugleich schonungslos ehrliches Buch. Es erzählt davon, wie man sich in der Liebe verlieren und glauben kann, endlich angekommen zu sein, bis sich alles als herzloses Spiel entpuppt. Es geht darum, das wahre Gesicht eines Menschen zu erkennen und den Mut zu finden, bei sich selbst anzusetzen, um den endlosen Kreislauf von Schmerz und Täuschung zu durchbrechen. Ein bewegender, zerbrechlicher Roman über Trauma, Verletzlichkeit und die Suche nach Heilung.",
    details: [
      "📕 Hardcover mit 80 Seiten ",
      "🌍 Deutsche Ausführung",
      "📏 14.57 x 0.99 x 22.19 cm",
      "KDP ISBN: 979-8268872750",
      "2025 © Publishing by 4aCe. Alle Rechte vorbehalten.",
    ],
    isNew: true,
    category: "meryem-boral",

    availability: "5-7",
  },
  {
    id: "ohne-liebe-22",
    name: "OHNE LIEBE – Meryem Boral",
    price: 10.99,
    description: "Taschenbuch – 14. Juli 2022",
    image: "/images/ohne-liebe-cover.png",
    tagline:
      "In dem Buch geht es um die fehlende Bindung der Liebe. Es geht darum, wie das Leben eines Menschen verlaufen kann, wenn man innerlich das Gefühl von „Ohne Liebe“ hat. Dabei spielen Depression, Familie, Freunde, Schule und natürlich die Liebe eine Rolle.",
    details: [
      "📕 Softcover mit 133 Seiten ",
      "🌍 Deutsche Ausführung",
      "📏 12.7 x 0.86 x 20.32 cm",
      "KDP ISBN: 979-8840134917",
      "2025 © Publishing by 4aCe. Alle Rechte vorbehalten.",
    ],
    isNew: false,
    category: "meryem-boral",

    availability: "1-3",
  },
  {
    id: "badt-2023",
    name: "Brief an den Täter",
    price: 12.49,
    description: "Taschenbuch – 21. Oktober 2023",
    image: "/images/badt-cover.png",
    tagline:
      "In diesem Buch erzählt Aylin ihre Lebensgeschichte, ein Mädchen, das ihr Leben lang von schweren Schicksalsschlägen geprägt wurde. Sie hat bis zum Zeitpunkt ihres Todes nie mit jemandem über ihre traumatischen Erfahrungen gesprochen. Vor ihrem Abschied schreibt sie Briefe an all diejenigen, die sie emotional heruntergezogen haben. Diese Briefe hinterlassen eine zentrale Frage: Hat Aylin jemals wirklich gelebt? Und wird sie jemand wieder leben können?",
    details: [
      "📕 Softcover mit 152 Seiten ",
      "🌍 Deutsche Ausführung",
      "📏 12.7 x 0.86 x 20.32 cm",
      "KDP ISBN: 979-8865002086",
      "2025 © Publishing by 4aCe. Alle Rechte vorbehalten.",
    ],
    isNew: false,
    category: "meryem-boral",

    availability: "5-7",
  },
];
