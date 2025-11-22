// app/product/[id]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { products } from "@/data/products";
import { AddToCartButton } from "@/components/AddToCartButton";
import { BlackWeekBanner } from "@/components/BlackWeekBanner";

// In Next 16 kann params ein Promise sein → hier direkt so typisieren
export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = products.find((p) => p.id === id);
  if (!product) return notFound();

  return (
    <div className="space-y-6">
      {/* Zurück zur Übersicht */}
      <div>
        <Link
          href="/products"
          className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          ← Zurück zur Produktübersicht
        </Link>
      </div>

      <div className="grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-start">
  <div className="space-y-4">
    {product.isNew && (
      <div className="inline-flex px-3 py-1 text-[11px] font-semibold uppercase tracking-wide bg-red-600 text-white rounded-full">
        NEU!
      </div>
    )}

    <div className="h-96 w-64 mx-auto bg-slate-900/70 rounded-2xl overflow-hidden flex items-center justify-center">
      <Image
        src={product.image}
        alt={product.name}
        width={700}
        height={1050}
        className="max-h-full w-auto object-contain"
      />
    </div>
  </div>

        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-semibold text-white">
              {product.name}
            </h1>
            <p className="text-sm text-slate-300 mt-2">
              {product.description}
            </p>
          </div>

          <p className="text-[13px] text-slate-400">{product.tagline}</p>

          <ul className="text-sm text-slate-200 space-y-1">
            {product.details.map((d, i) => (
              <li key={i}>• {d}</li>
            ))}
          </ul>

          <div className="flex items-center justify-between pt-4">
  <div className="flex flex-col">
    {typeof product.originalPrice === "number" &&
    product.originalPrice > product.price ? (
      <>
        <span className="text-xs text-red-400 line-through">
          {product.originalPrice.toFixed(2).replace(".", ",")} €
        </span>
        <span className="text-xl font-semibold text-white">
          {product.price.toFixed(2).replace(".", ",")} €
        </span>
      </>
    ) : (
      <span className="text-xl font-semibold text-white">
        {product.price.toFixed(2).replace(".", ",")} €
      </span>
    )}
  </div>

  <AddToCartButton product={product} />
</div>

          <p className="text-[11px] text-slate-400">
            🔒Sicherer Checkout über SSL & PayPal. 🚚 Versand aus Deutschland,
            📞 Support direkt von 4aCe.
          </p>
        </div>
      </div>
    </div>
  );
}
