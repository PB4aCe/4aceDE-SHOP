"use client";

import { useEffect, useMemo, useState } from "react";

type SampleReview = {
  name: string;
  rating: number; // 1-5
  text: string;
};

const SAMPLE: SampleReview[] = [
  {
    name: "Klaus",
    rating: 3,
    text: "Gutes Produkt, Versand hat bisschen gedauert.",
  },
  {
    name: "Sarah",
    rating: 5,
    text: "Klasse Produkt! Mega Qualität.",
  },
  {
    name: "Mariam",
    rating: 4,
    text: "Sehr schön verarbeitet, liebe die Details.",
  },
  {
    name: "Jonas",
    rating: 5,
    text: "Perfekt als Geschenk — kam super an.",
  },
  {
    name: "Eleni",
    rating: 4,
    text: "Top Idee, gerne mehr davon.",
  },
];

function Stars({ rating }: { rating: number }) {
  // kleine, animierte Sterne
  const stars = useMemo(() => Array.from({ length: 5 }, (_, i) => i < rating), [rating]);

  return (
    <div className="flex items-center gap-0.5">
      {stars.map((filled, i) => (
        <span
          key={i}
          className={[
            "inline-block text-[12px] leading-none",
            filled ? "text-amber-300" : "text-slate-600",
            // leichte Animation gestaffelt
            "animate-[starPulse_2.2s_ease-in-out_infinite]",
          ].join(" ")}
          style={{ animationDelay: `${i * 0.12}s` }}
          aria-hidden="true"
        >
          ★
        </span>
      ))}

      {/* screenreader */}
      <span className="sr-only">{rating} von 5 Sternen</span>
    </div>
  );
}

export function ShopUpdateTicker() {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    // prefers-reduced-motion respektieren
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduce = media.matches;

    if (reduce) return;

    const interval = window.setInterval(() => {
      setFade(false);
      // kurzer Fade-Out, dann Index wechseln, dann Fade-In
      window.setTimeout(() => {
        setIdx((prev) => (prev + 1) % SAMPLE.length);
        setFade(true);
      }, 220);
    }, 2800);

    return () => window.clearInterval(interval);
  }, []);

  const item = SAMPLE[idx];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-black/70 shop-update-glow">
<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-5 py-4">

        {/* Left: Update-Text */}
        <div className="flex items-center gap-2">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
          <p className="text-xs md:text-[13px] text-slate-200">
            <span className="font-semibold text-white">Shop wurde geupdatet!</span>{" "}
           Bewerte jetzt die Produkte und sieh Lieferzeit und "Lagerbestand" ein.
          </p>
        </div>

        {/* Right: Animated mini review */}
        <div
          className={[
            "flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/40 px-3 py-1",
            "transition-opacity duration-200",
            fade ? "opacity-100" : "opacity-0",
          ].join(" ")}
        >
          <Stars rating={item.rating} />
          <span className="text-[10px] text-slate-400">•</span>
          <span className="text-[11px] text-slate-200 font-medium">
            {item.name}
          </span>
          <span className="text-[11px] text-slate-400 truncate max-w-[220px] md:max-w-[320px]">
            {item.text}
          </span>
        </div>
      </div>

      {/* keyframes lokal via jsx global */}
      <style jsx global>{`
  @keyframes starPulse {
    0%, 100% { transform: translateY(0); opacity: 0.85; }
    50% { transform: translateY(-1px); opacity: 1; }
  }

  @keyframes greenGlowBorder {
    0%, 100% {
      box-shadow:
        0 0 0 1px rgba(16, 185, 129, 0.15),
        0 0 0 rgba(16, 185, 129, 0),
        inset 0 0 0 1px rgba(148, 163, 184, 0.15);
    }
    50% {
      box-shadow:
        0 0 0 1px rgba(16, 185, 129, 0.55),
        0 0 28px rgba(16, 185, 129, 0.35),
        inset 0 0 0 1px rgba(16, 185, 129, 0.25);
    }
  }

  .shop-update-glow {
  border: 1px solid rgba(30, 41, 59, 0.8);
  background:
    linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0)) padding-box,
    linear-gradient(135deg, rgba(16,185,129,0.25), rgba(16,185,129,0), rgba(16,185,129,0.25)) border-box;
  animation: greenGlowBorder 2.8s ease-in-out infinite;
}


  @media (prefers-reduced-motion: reduce) {
    .shop-update-glow {
      animation: none;
      box-shadow: none;
    }
  }
`}</style>

    </div>
  );
}
