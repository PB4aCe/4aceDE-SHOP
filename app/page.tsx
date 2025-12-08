// app/page.tsx
import Link from "next/link";
import Image from "next/image";
import { ShopUpdateTicker } from "@/components/ShopUpdateTicker";


export default function HomePage() {
  return (
    <div className="space-y-12">
      <ShopUpdateTicker />
      {/* Hero / Intro */}
      <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
        <div className="space-y-4 max-w-xl">
          <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">
            4aCe / Steel & Soul
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight text-white">
            Der neue 4aCe-Shop
            <br />
            &amp; Release von HERZBLUT
          </h1>
          <p className="text-slate-300 text-sm">
            Nach 450 Tagen „wir bauen das noch kurz um“ ist Version 2 endlich
            da: eigenes Design, eigener Checkout und ein Zuhause für Projekte,
            in die wirklich Herz und Zeit geflossen sind.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/products"
              className="text-xs px-4 py-2 rounded-full border border-white bg-white text-black font-semibold tracking-wide uppercase hover:bg-transparent hover:text-white transition-all"
            >
              Produkte ansehen
            </Link>
            <a
              href="#why"
              className="text-[11px] px-3 py-2 rounded-full border border-slate-600 text-slate-200 hover:border-white hover:bg-slate-900 transition-all"
            >
              Mehr über den Shop
            </a>
          </div>
        </div>

        {/* Rechte Launch-Box (ohne Black-Week-Texte) */}
        <div className="relative w-full md:w-auto flex justify-end">
          <div className="w-64 h-64 rounded-3xl bg-gradient-to-br from-black via-slate-900 to-black border border-emerald-600/70 shadow-[0_0_40px_rgba(16,185,129,0.5)] flex flex-col items-center justify-center gap-1 text-slate-50">
            <span className="text-[10px] tracking-[0.3em] uppercase text-slate-400">
              4aCe Shop Launch
            </span>

            <div className="mt-1 flex flex-col items-center leading-none">
              <span className="text-3xl font-extrabold bw-blink-1">NEW</span>
              <span className="text-3xl font-extrabold bw-blink-2">
                STORE
              </span>
              <span className="text-[11px] uppercase tracking-[0.2em] mt-3 text-slate-300">
                mit extra viel
              </span>
              <span className="text-2xl font-extrabold text-emerald-400 bw-blink-3">
                HERZBLUT
              </span>
            </div>

            <span className="mt-3 text-[10px] text-slate-400 text-center px-4">
              Kleine Auflagen, persönliche Betreuung und direkte Wege – kein
              Massenmarkt, sondern bewusst ausgewählte Projekte.
            </span>
          </div>
        </div>
      </section>

      {/* HERZBLUT / Meryem Boral Feature */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">
          Release: <span className="italic">HERZBLUT</span> von Meryem Boral
        </h2>

        <div className="border border-slate-800 rounded-2xl p-4 md:p-6 bg-black/60 flex flex-col md:flex-row gap-6 items-center">
          {/* Cover */}
          <div className="w-full md:w-56 lg:w-64">
            <div className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/80">
              <Image
                src="/images/herzblut-start.png"
                alt="HERZBLUT – Meryem Boral"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Text */}
          <div className="flex-1 space-y-3 text-sm">
            <p className="text-slate-200">
              Feier mit uns den Release von{" "}
              <span className="font-semibold italic">HERZBLUT</span>, dem dritten
              Buch von <span className="font-semibold">Meryem Boral</span>.
            </p>
            <p className="text-slate-400 text-[13px]">
              Rohe Emotionen, ehrliche Texte und keine geschönten Kanten –{" "}
              <span className="italic">HERZBLUT</span> ist ihr neuestes Projekt
              und das erste mit Hardcover-Umschlag. Dazu hast du die Möglichkeit,
              alle drei Bücher im Set zu einem fair kalkulierten Paketpreis zu
              sichern.
            </p>
            <p className="text-slate-400 text-[13px]">
              Ob du Meryem schon lange verfolgst oder sie gerade erst entdeckst:
              Der neue Shop bündelt ihre Bücher, Bundles und kommende Editionen
              zentral – ohne Umwege über zig Plattformen.
            </p>

            <div className="pt-1 flex flex-wrap gap-3 items-center">
              <Link
                href="/products"
                className="text-[11px] px-4 py-2 rounded-full border border-white/80 bg-white text-black font-semibold tracking-wide uppercase hover:bg-transparent hover:text-white transition-all"
              >
                Zum Shop
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Warum-Section + Trust */}
      <section id="why" className="space-y-6">
        <h2 className="text-lg font-semibold text-white">
          Was hinter dem Shop steckt
        </h2>
        <div className="grid gap-5 md:grid-cols-3 text-sm">
          <div className="border border-slate-800 rounded-2xl p-4 bg-black/60">
            <p className="text-slate-200 font-semibold mb-1">
              Das neue 4ace.de V2
            </p>
            <p className="text-slate-400 text-[13px]">
              Modernes Layout, eigener Code, eigene Produkte. Kein Baukasten,
              keine generischen Themes – sondern ein Setup, das mit deinen
              Projekten wächst.
            </p>
          </div>
          <div className="border border-slate-800 rounded-2xl p-4 bg-black/60">
            <p className="text-slate-200 font-semibold mb-1">
              Fokus statt Fake-Rabatte
            </p>
            <p className="text-slate-400 text-[13px]">
              Hier gibt es keine „nur heute -90%“-Show, sondern fair kalkulierte
              Preise, limitierte Auflagen und Aktionen, die wirklich Sinn
              ergeben – nicht nur fürs Marketing.
            </p>
          </div>
          <div className="border border-slate-800 rounded-2xl p-4 bg-black/60">
            <p className="text-slate-200 font-semibold mb-1">
              PayPal | Klarna | Sofort
            </p>
            <p className="text-slate-400 text-[13px]">
              Du bezahlst sicher per PayPal, Klarna oder anderen Zahlungsmethoden und bekommst eine
              klare, nachvollziehbare Abwicklung. 
            </p>
          </div>
        </div>

        {/* Trust-Zeile */}
        <p className="text-[11px] text-center text-slate-500 pt-1">
          ✔ SSL-verschlüsselter Checkout · ✔ Zahlung via PayPal (inkl.
          Käuferschutz) &amp; Vorkasse · ✔ Impressum, AGB &amp; Widerruf nach
          deutschem Recht · ✔ fair kalkulierte Preise ohne Rabatt-Zirkus
        </p>
      </section>
    </div>
  );
}
