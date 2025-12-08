"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const cart = useCart();
  const { items, removeFromCart, clearCart, total } = cart as any;

  // ✅ optional: falls dein Context addToCart anbietet
  const addToCart =
    (cart as any).addToCart as ((product: any) => void) | undefined;

  const router = useRouter();

  if (!items || items.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Warenkorb</h1>
        <p className="text-slate-300 text-sm">
          Dein Warenkorb ist leer. Füge Produkte auf der Startseite hinzu.
        </p>
      </div>
    );
  }

  function calcDiscountPercent(original?: number, price?: number) {
    if (
      typeof original !== "number" ||
      typeof price !== "number" ||
      original <= price ||
      original <= 0
    )
      return 0;
    return Math.round(((original - price) / original) * 100);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Warenkorb</h1>

      <ul className="space-y-3">
        {items.map((item: any) => {
          const p = item.product;
          const qty = item.quantity ?? 1;

          const hasDiscount =
            typeof p?.originalPrice === "number" &&
            typeof p?.price === "number" &&
            p.originalPrice > p.price;

          const discountPercent = calcDiscountPercent(
            p?.originalPrice,
            p?.price
          );

          const lineTotal = Number(p?.price ?? 0) * qty;

          return (
            <li
              key={p.id}
              className="border border-slate-800 rounded-xl px-4 py-3 bg-slate-900/60"
            >
              <div className="flex items-center justify-between gap-4">
                {/* LEFT: Bild + Name + Meta */}
                <div className="flex items-center gap-3 min-w-0">
                  {/* Thumbnail (klickbar) */}
                  <Link
                    href={`/product/${p.id}`}
                    className="shrink-0 w-14 h-14 rounded-md border border-slate-700 bg-slate-950/40 flex items-center justify-center overflow-hidden hover:border-slate-500 transition"
                    title={p.name}
                  >
                    {p.image ? (
                      <Image
                        src={p.image}
                        alt={p.name}
                        width={56}
                        height={56}
                        className="object-contain"
                      />
                    ) : (
                      <span className="text-[10px] text-slate-500">
                        Kein Bild
                      </span>
                    )}
                  </Link>

                  {/* Name + Preise */}
                  <div className="min-w-0">
                    <Link
                      href={`/product/${p.id}`}
                      className="font-semibold text-slate-50 truncate hover:text-white transition-colors"
                    >
                      {p.name}
                    </Link>

                    {/* Preiszeile (mini) */}
                    <div className="flex items-center gap-2 mt-0.5">
                      {hasDiscount ? (
                        <>
                          <span className="text-[10px] text-red-400 line-through">
                            {Number(p.originalPrice)
                              .toFixed(2)
                              .replace(".", ",")}{" "}
                            €
                          </span>
                          <span className="text-[11px] text-slate-200 font-semibold">
                            {Number(p.price).toFixed(2).replace(".", ",")} €
                          </span>
                          {discountPercent > 0 && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full border border-red-500/50 text-red-300 bg-red-500/10">
                              -{discountPercent}%
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-[11px] text-slate-300">
                          {Number(p?.price ?? 0).toFixed(2).replace(".", ",")} €
                        </span>
                      )}
                    </div>

                    <div className="text-[10px] text-slate-500">
                      Menge: {qty}
                    </div>
                  </div>
                </div>

                {/* RIGHT: Qty Controls + Line Total */}
                <div className="flex items-center gap-3">
                  {/* Stepper */}
                  <div className="flex items-center rounded-full border border-slate-700 overflow-hidden">
                    <button
                      onClick={() => removeFromCart(p.id)}
                      className="px-2.5 py-1 text-xs text-slate-200 hover:bg-slate-800 transition"
                      title="1 Stück entfernen"
                    >
                      −
                    </button>
                    <span className="px-2 text-[11px] text-slate-300 min-w-[26px] text-center">
                      {qty}
                    </span>
                    <button
                      onClick={() => addToCart?.(p)}
                      disabled={!addToCart}
                      className="px-2.5 py-1 text-xs text-slate-200 hover:bg-slate-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
                      title={
                        addToCart
                          ? "1 Stück hinzufügen"
                          : "addToCart fehlt im CartContext"
                      }
                    >
                      +
                    </button>
                  </div>

                  {/* Line total */}
                  <div className="text-sm text-slate-100 min-w-[80px] text-right">
                    {lineTotal.toFixed(2).replace(".", ",")} €
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-slate-800 pt-4">
        <div className="text-sm text-slate-300">
          Summe:{" "}
          <span className="font-semibold text-slate-50">
            {Number(total ?? 0).toFixed(2).replace(".", ",")} €
          </span>
        </div>
        <button
          onClick={clearCart}
          className="text-xs px-3 py-1 rounded-full border border-slate-600 hover:bg-slate-800"
        >
          Warenkorb leeren
        </button>
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={() => router.push("/checkout")}
          className="text-xs px-5 py-2 rounded-full border border-white bg-white text-black font-semibold tracking-wide uppercase hover:bg-transparent hover:text-white transition-all"
        >
          Zur Kasse
        </button>
      </div>
    </div>
  );
}
