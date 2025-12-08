// app/categories/meryem-boral/page.tsx
import Image from "next/image";
import Link from "next/link";
import { products } from "@/data/products";
import { AddToCartButton } from "@/components/AddToCartButton";
import { StarRating } from "@/components/StarRating";
import { readReviews } from "@/lib/reviewsStore";
import { getAvailabilityMeta } from "@/lib/availability";

//import { BlackWeekBanner } from "@/components/BlackWeekBanner";

type Summary = { avg: number; count: number };

export default async function MeryemBoralCategoryPage() {
  const meryemProducts = products.filter((p) => p.category === "meryem-boral");
  const productIds = meryemProducts.map((p) => p.id);

  // ✅ Reviews serverseitig laden
  let allReviews: any[] = [];
  try {
    allReviews = await readReviews();
  } catch {
    allReviews = [];
  }

  // ✅ Zusammenfassung pro Produkt
  const tmp = new Map<string, { sum: number; count: number }>();

  for (const r of allReviews) {
    if (!productIds.includes(r.productId)) continue;
    const cur = tmp.get(r.productId) ?? { sum: 0, count: 0 };
    cur.sum += Number(r.rating) || 0;
    cur.count += 1;
    tmp.set(r.productId, cur);
  }

  const summary = new Map<string, Summary>();
  for (const id of productIds) {
    const v = tmp.get(id);
    if (!v) {
      summary.set(id, { avg: 0, count: 0 });
    } else {
      const avg = Math.round((v.sum / v.count) * 10) / 10;
      summary.set(id, { avg, count: v.count });
    }
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-[11px] text-slate-400 uppercase tracking-[0.25em]">
          Kategorie
        </p>
        <h1 className="text-2xl font-semibold text-white">
          Meryem Boral – Bücher & Sets
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl">
          Hier findest du alle Produkte rund um Meryem Boral – von Einzelbänden
          bis hin zur HERZBLUT-Trilogie im Set.
        </p>
        <Link
          href="/categories"
          className="text-[11px] text-slate-400 hover:text-slate-200 underline underline-offset-2"
        >
          ← Zur Kategorieliste
        </Link>
      </header>

      {/* <BlackWeekBanner /> */}

      {meryemProducts.length === 0 ? (
        <p className="text-sm text-slate-400">
          In dieser Kategorie sind aktuell keine Produkte hinterlegt.
        </p>
      ) : (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {meryemProducts.map((p) => {
            const s = summary.get(p.id) ?? { avg: 0, count: 0 };

            // ✅ Availability defensiv holen (wie auf Products)
            let availability: any = null;
            try {
              availability = getAvailabilityMeta((p as any).availability);
            } catch {
              try {
                availability = getAvailabilityMeta(p as any);
              } catch {
                availability = null;
              }
            }

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
                  {/* Titel + ⭐ Ø-Bewertung */}
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/product/${p.id}`}>
                      <h2 className="font-semibold text-slate-50 group-hover:text-white transition-colors text-sm">
                        {p.name}
                      </h2>
                    </Link>

                    {/* Nur Sterne + Anzahl */}
                    <div className="flex items-center gap-1 shrink-0">
                      {s.count > 0 ? (
                        <>
                          <StarRating value={s.avg} readonly size={12} />
                          <span className="text-[10px] text-slate-400">
                            ({s.count})
                          </span>
                        </>
                      ) : (
                        <span className="text-[10px] text-slate-500">
                          —
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-[13px] text-slate-300 line-clamp-3">
                    {p.description}
                  </p>

                  {/* Preise + Button */}
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

                    <AddToCartButton product={p as any} />
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
