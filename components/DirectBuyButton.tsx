"use client";

import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";
import type { Product } from "@/data/products";

export function DirectBuyButton({ product }: { product: Product }) {
  const { addToCart, clearCart } = useCart();
  const router = useRouter();

  function handleClick() {
    // Warenkorb leeren → Produkt hinzufügen → direkt zum Checkout
    clearCart();
    addToCart(product);
    router.push("/cart");
  }

  return (
    <button
      onClick={handleClick}
      className="flex-1 text-xs sm:text-sm px-4 py-2 rounded-full bg-emerald-500 text-slate-950 font-semibold tracking-wide uppercase border border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.6)] hover:shadow-[0_0_30px_rgba(16,185,129,0.8)] hover:bg-emerald-400 transition-all duration-200"
    >
      Jetzt kaufen
    </button>
  );
}
