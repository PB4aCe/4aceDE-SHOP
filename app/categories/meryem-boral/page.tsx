// app/categories/meryem-boral/page.tsx
import Image from "next/image";
import Link from "next/link";
import { products } from "@/data/products";
import { AddToCartButton } from "@/components/AddToCartButton";
import { BlackWeekBanner } from "@/components/BlackWeekBanner";

export default function MeryemBoralCategoryPage() {
  const meryemProducts = products.filter(
    (p) => p.category === "meryem-boral"
  );

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

      {/* 🔥 HIER: Black Week Banner */}
      <BlackWeekBanner />

      {meryemProducts.length === 0 ? (
        <p className="text-sm text-slate-400">
          In dieser Kategorie sind aktuell keine Produkte hinterlegt.
        </p>
      ) : (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {meryemProducts.map((p) => (
            <article
              key={p.id}
              className="group border border-slate-800 rounded-2xl overflow-hidden bg-black/60 backdrop-blur-sm flex flex-col hover:border-slate-100/70 hover:shadow-[0_0_28px_rgba(255,255,255,0.18)] transition-all duration-300"
            >
              {/* NEU-Badge (optional) */}
              {p.isNew && (
                <div className="px-3 py-1 text-[10px] font-semibold tracking-wide uppercase bg-red-600 text-white rounded-full self-start mx-4 mt-3">
                  NEU!
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
                  <h2 className="font-semibold text-slate-50 group-hover:text-white transition-colors text-sm">
                    {p.name}
                  </h2>
                </Link>

                <p className="text-[13px] text-slate-300 line-clamp-3">
                  {p.description}
                </p>

                {/* Preise inkl. evtl. Rabatt über originalPrice */}
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

                  <AddToCartButton product={p} />
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
