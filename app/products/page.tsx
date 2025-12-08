// app/products/page.tsx
import Image from "next/image";
import Link from "next/link";
import { products } from "@/data/products";
import { AddToCartButton } from "@/components/AddToCartButton";
import { StarRating } from "@/components/StarRating";
import { readReviews } from "@/lib/reviewsStore";
import { getAvailabilityMeta } from "@/lib/availability";

type RatingStats = {
  avg: number;
  count: number;
};

function buildRatingMap(reviews: any[]): Record<string, RatingStats> {
  const map: Record<string, { sum: number; count: number }> = {};

  for (const r of reviews) {
    const pid = String(r.productId ?? "");
    const rating = Number(r.rating ?? 0);
    if (!pid || rating <= 0) continue;

    if (!map[pid]) map[pid] = { sum: 0, count: 0 };
    map[pid].sum += rating;
    map[pid].count += 1;
  }

  const out: Record<string, RatingStats> = {};
  for (const pid of Object.keys(map)) {
    const { sum, count } = map[pid];
    const avg = count ? sum / count : 0;

    // auf 0.5 Schritte runden für hübschere Sterne
    const rounded = Math.round(avg * 2) / 2;

    out[pid] = { avg: rounded, count };
  }

  return out;
}

export default async function ProductsPage() {
  // Reviews laden (serverseitig)
  let ratingMap: Record<string, RatingStats> = {};

  try {
    const reviews = await readReviews();
    ratingMap = buildRatingMap(reviews);
  } catch {
    ratingMap = {};
  }

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Produkte</h1>
        <p className="text-xs text-slate-400">
          Auswahl aktueller Artikel im 4aCe Shop.
        </p>
      </header>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => {
          const stats = ratingMap[p.id] ?? { avg: 0, count: 0 };

          // ✅ Availability defensiv holen
          let availability: any = null;
          try {
            // falls deine Funktion nur den Wert erwartet:
            availability = getAvailabilityMeta((p as any).availability);
          } catch {
            try {
              // falls deine Funktion das ganze Produkt erwartet:
              availability = getAvailabilityMeta(p as any);
            } catch {
              availability = null;
            }
          }

          // erwartet:
          // availability = { label: string, tone: "red"|"yellow"|"green"|"gray", className?: string }
          const label: string | null = availability?.label ?? null;
          const tone: string | null = availability?.tone ?? null;

          const toneClasses =
            availability?.className ||
            (tone === "red"
              ? "border-red-500/70 bg-red-950/30 text-red-300 font-semibold"
              : tone === "yellow"
              ? "border-yellow-500/60 bg-yellow-950/30 text-yellow-200 font-semibold"
              : tone === "green"
              ? "border-emerald-500/60 bg-emerald-950/25 text-emerald-200 font-semibold"
              : "border-slate-700 bg-slate-900/40 text-slate-300");

          return (
            <article
              key={p.id}
              className="group border border-slate-800 rounded-2xl overflow-hidden bg-black/60 backdrop-blur-sm flex flex-col hover:border-slate-100/70 hover:shadow-[0_0_28px_rgba(255,255,255,0.18)] transition-all duration-300"
            >
              {/* NEU-Badge */}
              {p.isNew && (
                <div className="px-3 py-1 text-[10px] font-semibold tracking-wide uppercase bg-red-600 text-white rounded-full self-start mx-4 mt-3">
                  NEU!
                </div>
              )}

              {/* ✅ Lieferstatus Badge */}
              {label && (
                <div
                  className={`mx-4 mt-3 inline-flex self-start rounded-full border px-2.5 py-1 text-[10px] tracking-wide uppercase ${toneClasses}`}
                >
                  {label}
                </div>
              )}

              <Link href={`/product/${p.id}`} className="block">
                <div className="h-72 bg-slate-900/70 flex items-center justify-center">
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={p.name}
                      width={600}
                      height={900}
                      className="max-h-full w-auto object-contain group-hover:opacity-90 transition-opacity duration-300"
                    />
                  ) : (
                    <span className="text-xs text-slate-500">
                      Bild {p.name}
                    </span>
                  )}
                </div>
              </Link>

              <div className="p-4 flex flex-col gap-2 flex-1">
                <Link href={`/product/${p.id}`}>
                  <h2 className="font-semibold text-slate-50 group-hover:text-white transition-colors">
                    {p.name}
                  </h2>
                </Link>

                {/* ⭐ Durchschnittssterne */}
                <div className="flex items-center gap-2">
                  {stats.count > 0 ? (
                    <>
                      <StarRating value={stats.avg} readonly size={14} />
                      <span className="text-[10px] text-slate-400">
                        ({stats.count})
                      </span>
                    </>
                  ) : (
                    <span className="text-[10px] text-slate-500">
                      Noch keine Bewertungen
                    </span>
                  )}
                </div>

                <p className="text-[13px] text-slate-300 line-clamp-2">
                  {p.description}
                </p>

                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex flex-col">
                    {typeof p.originalPrice === "number" &&
                    p.originalPrice > p.price ? (
                      <>
                        <span className="text-xs text-red-400 line-through">
                          {p.originalPrice.toFixed(2).replace(".", ",")} €
                        </span>
                        <span className="text-base font-semibold text-white">
                          {p.price.toFixed(2).replace(".", ",")} €
                        </span>
                      </>
                    ) : (
                      <span className="text-base font-semibold text-white">
                        {p.price.toFixed(2).replace(".", ",")} €
                      </span>
                    )}
                  </div>

                  {/* ✅ Button sperrt automatisch bei availability === "unavailable" */}
                  <AddToCartButton
                    product={p as any}
                    disabledText={
                      (p as any).availability === "unavailable"
                        ? "NICHT LIEFERBAR"
                        : undefined
                    }
                  />
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
