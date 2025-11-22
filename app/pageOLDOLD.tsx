// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero / Intro */}
      <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
        <div className="space-y-4 max-w-xl">
          <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">
            4aCe / Steel & Soul
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight text-white">
            Markante Geschenke
            <br />
            für Menschen mit{" "}
            <span className="underline underline-offset-4 decoration-slate-500/80">
              eigener Linie
            </span>
            .
          </h1>
          <p className="text-slate-300 text-sm">
            Elektrische Feuerzeuge, Lederarmbänder, Geldbörsen – cleanes Design,
            wertige Haptik, auf Wunsch personalisiert. Ideal für Drops, Bundles
            & Creator-Projekte.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/products"
              className="text-xs px-4 py-2 rounded-full border border-white bg-white text-black font-semibold tracking-wide uppercase hover:bg-transparent hover:text-white transition-all"
            >
              Produkte ansehen
            </Link>
          </div>
        </div>

        <div className="relative w-full md:w-auto flex justify-end">
          <div className="w-64 h-64 rounded-3xl bg-gradient-to-br from-white/10 to-black/90 border border-slate-600 shadow-[0_0_40px_rgba(255,255,255,0.2)] flex items-center justify-center text-[11px] text-slate-200">
            <span className="text-center px-5 leading-relaxed">
              „Wir bauen kleine, harte Kollektionen – lieber wenige Teile, die
              sitzen, statt 0815-Massenware.“
            </span>
          </div>
        </div>
      </section>

      {/* Warum-Section + Trust */}
      <section className="space-y-6">
        <h2 className="text-lg font-semibold text-white">
          Was hinter dem Shop steckt
        </h2>
        <div className="grid gap-5 md:grid-cols-3 text-sm">
          <div className="border border-slate-800 rounded-2xl p-4 bg-black/60">
            <p className="text-slate-200 font-semibold mb-1">
              Klarer Look, keine Spielerei
            </p>
            <p className="text-slate-400 text-[13px]">
              Schwarz, Weiß, Stahl – Fokus auf Produkt & Gravur, nicht auf
              bunte Ablenkung. Ideal für Männergeschenke & Creator-Branding.
            </p>
          </div>
          <div className="border border-slate-800 rounded-2xl p-4 bg-black/60">
            <p className="text-slate-200 font-semibold mb-1">
              Kleiner Shop, kurze Wege
            </p>
            <p className="text-slate-400 text-[13px]">
              Direkter Kontakt, schnelle Anpassungen, individuelle Bundles – kein
              anonymes Ticketsystem.
            </p>
          </div>
          <div className="border border-slate-800 rounded-2xl p-4 bg-black/60">
            <p className="text-slate-200 font-semibold mb-1">
              PayPal-Checkout integriert
            </p>
            <p className="text-slate-400 text-[13px]">
              Kunden bezahlen sicher per PayPal, du bekommst eine klare,
              nachvollziehbare Abwicklung für deine Drops.
            </p>
          </div>
        </div>

        {/* Trust-Zeile */}
        <p className="text-[11px] text-center text-slate-500 pt-1">
          ✔ SSL-verschlüsselter Checkout · ✔ Zahlung via PayPal (inkl.
          Käuferschutz) · ✔ Impressum, AGB & Widerruf nach deutschem Recht
        </p>
      </section>
    </div>
  );
}
