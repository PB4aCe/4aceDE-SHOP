// app/categories/page.tsx
import Link from "next/link";
import { BlackWeekBanner } from "@/components/BlackWeekBanner";

const categories = [
  {
    slug: "meryem-boral",
    name: "Meryem Boral",
    description:
      "Buchreihen, Bundles & Special Editions von Meryem Boral – inklusive HERZBLUT-Trilogie.",
  },
  // später weitere Kategorien ergänzen
  // { slug: "steel-and-soul", name: "Steel & Soul", description: "Männergeschenke, Feuerzeuge, Leder & mehr." },
];

export default function CategoriesPage() {
  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Kategorien</h1>
          <p className="text-xs text-slate-400 mt-1">
            Wähle eine Kategorie, um passende Produkte zu sehen.
          </p>
        </div>
      </header>

      <BlackWeekBanner />

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Link key={cat.slug} href={`/categories/${cat.slug}`}>
            <article className="border border-slate-800 rounded-2xl bg-black/60 p-4 hover:border-slate-100/70 hover:shadow-[0_0_28px_rgba(255,255,255,0.18)] transition-all duration-300 h-full flex flex-col justify-between">
              <div className="space-y-2">
                <h2 className="text-sm font-semibold text-white">
                  {cat.name}
                </h2>
                <p className="text-[13px] text-slate-400">
                  {cat.description}
                </p>
              </div>
              <div className="mt-4 text-[11px] text-slate-300 flex items-center gap-2">
                <span className="inline-block h-[1px] w-6 bg-slate-600" />
                <span>Zur Kategorie</span>
              </div>
            </article>
          </Link>
        ))}
      </section>
    </div>
  );
}
