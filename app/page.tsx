// app/page.tsx
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* BLACK WEEK / NEUERÖFFNUNG Banner */}
      <section className="border border-slate-800 rounded-2xl bg-black/70 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[0_0_35px_rgba(255,255,255,0.08)]">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full rounded-full bg-red-500/60 opacity-70 animate-ping" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-[0.35em] text-slate-300">
              Black Week · Neueröffnung
            </span>
            <span className="text-sm text-slate-200">
              Eröffnungsdeals auf ALLE Artikel – nur für kurze Zeit.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-full border border-red-500/70 bg-red-600/20 text-[11px] font-semibold uppercase tracking-wide text-red-300 animate-pulse">
            Bis zu <span className="text-red-400 text-[12px]">40% Rabatt</span>
          </div>
          <Link
            href="/products"
            className="text-[11px] px-4 py-2 rounded-full border border-white/80 bg-white text-black font-semibold tracking-wide uppercase hover:bg-transparent hover:text-white transition-all"
          >
            Angebote ansehen
          </Link>
        </div>
      </section>

      {/* Hero / Intro */}
      <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
        <div className="space-y-4 max-w-xl">
          <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">
            4aCe / Steel & Soul
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight text-white">
            Black Week &{" "}
            <span className="underline underline-offset-4 decoration-slate-500/80">
              Neueröffnung
            </span>
            <br />
            + Release von HERZBLUT
          </h1>
          <p className="text-slate-300 text-sm">
            Nach 450 Tagen Verspätung – neuer Shop, neues Design + Black Deals!
            Während der Black Week profitierst du von Eröffnungsrabatten auf alle
            Artikel.
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

        {/* Rechte BLACK WEEK Box mit Blink-Animation */}
        <div className="relative w-full md:w-auto flex justify-end">
          <div className="w-64 h-64 rounded-3xl bg-gradient-to-br from-black via-slate-900 to-black border border-red-600/70 shadow-[0_0_40px_rgba(248,113,113,0.5)] flex flex-col items-center justify-center gap-1 text-slate-50">
            <span className="text-[10px] tracking-[0.3em] uppercase text-slate-400">
              4aCe Black Week
            </span>

            <div className="mt-1 flex flex-col items-center leading-none">
              <span className="text-3xl font-extrabold bw-blink-1">
                BLACK
              </span>
              <span className="text-3xl font-extrabold bw-blink-2">
                WEEK
              </span>
              <span className="text-[11px] uppercase tracking-[0.2em] mt-3 text-slate-300">
                bis zu
              </span>
              <span className="text-3xl font-extrabold text-red-400 bw-blink-3">
                -40%
              </span>
            </div>

            <span className="mt-3 text-[10px] text-slate-400 text-center px-4">
              Nur für kurze Zeit · Neueröffnung · Limitierte Kontingente
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
              <span className="italic">HERZBLUT</span> ist ihr neustes Projekt
              und erstes mit Hardcover Umschlag.
              Parallel dazu habt Ihr die möglichkeit alle 3 Bücher für einen Unschlagbaren
              Preis zu ergaunern!
            </p>
            <p className="text-slate-400 text-[13px]">
              Ob du Meryem seit Jahren verfolgst oder sie jetzt erst entdeckst –
              Black Week + Neueröffnung ist der perfekte Moment, um HERZBLUT in
              dein Regal (oder Content) zu holen. JETZT ZUSCHLAGEN!
            </p>

            <div className="pt-1 flex flex-wrap gap-3 items-center">
              <Link
                href="/products"
                className="text-[11px] px-4 py-2 rounded-full border border-white/80 bg-white text-black font-semibold tracking-wide uppercase hover:bg-transparent hover:text-white transition-all"
              >
                Zum Shop
              </Link>
              {/*<span className="text-[11px] text-slate-500">}
                Hinweis: HERZBLUT-Editionen & Bundles werden nach und nach
                freigeschaltet.
              </span>*/}
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
              Klarer Look, keine Spielerei
            </p>
            <p className="text-slate-400 text-[13px]">
              Schwarz, Weiß, Stahl – Fokus auf Produkt & Gravur, nicht auf bunte
              Ablenkung. Ideal für Männergeschenke & Creator-Branding.
            </p>
          </div>
          <div className="border border-slate-800 rounded-2xl p-4 bg-black/60">
            <p className="text-slate-200 font-semibold mb-1">
              Kleiner Shop, kurze Wege
            </p>
            <p className="text-slate-400 text-[13px]">
              Direkter Kontakt, schnelle Anpassungen, individuelle Bundles – kein
              anonymes Ticketsystem. Black Week eignet sich perfekt, um den Shop
              zu testen.
            </p>
          </div>
          <div className="border border-slate-800 rounded-2xl p-4 bg-black/60">
            <p className="text-slate-200 font-semibold mb-1">
              PayPal-Checkout integriert
            </p>
            <p className="text-slate-400 text-[13px]">
              Kunden bezahlen sicher per PayPal oder Vorkasse, du bekommst eine
              klare, nachvollziehbare Abwicklung für deine Drops – inkl.
              Bestellnummern & Mailsystem.
            </p>
          </div>
        </div>

        {/* Trust-Zeile */}
        <p className="text-[11px] text-center text-slate-500 pt-1">
          ✔ SSL-verschlüsselter Checkout · ✔ Zahlung via PayPal (inkl.
          Käuferschutz) & Vorkasse · ✔ Impressum, AGB & Widerruf nach deutschem
          Recht · ✔ Black Week & Neueröffnungsrabatte auf ausgewählte Artikel
        </p>
      </section>
    </div>
  );
}
