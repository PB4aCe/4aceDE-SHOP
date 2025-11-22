"use client";

import { useCart } from "@/components/CartContext";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, removeFromCart, clearCart, total } = useCart();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Warenkorb</h1>
        <p className="text-slate-300 text-sm">
          Dein Warenkorb ist leer. Füge Produkte auf der Startseite hinzu.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Warenkorb</h1>

      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.product.id}
            className="flex items-center justify-between border border-slate-800 rounded-lg px-4 py-3 bg-slate-900/60"
          >
            <div>
              <div className="font-semibold">{item.product.name}</div>
              <div className="text-xs text-slate-400">
                Menge: {item.quantity}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                {(item.product.price * item.quantity)
                  .toFixed(2)
                  .replace(".", ",")}{" "}
                €
              </div>
              <button
                onClick={() => removeFromCart(item.product.id)}
                className="text-xs px-2 py-1 rounded border border-red-500/70 hover:bg-red-500 hover:text-slate-950 transition"
              >
                − 1
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between border-t border-slate-800 pt-4">
        <div className="text-sm text-slate-300">
          Summe:{" "}
          <span className="font-semibold text-slate-50">
            {total.toFixed(2).replace(".", ",")} €
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
