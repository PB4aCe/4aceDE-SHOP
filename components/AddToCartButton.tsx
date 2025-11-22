"use client";

import { useCart } from "./CartContext";
import type { Product } from "@/data/products";
import { useState } from "react";

type AddToCartButtonProps = {
  product: Product;
  size?: "sm" | "md" | "lg";
};

export function AddToCartButton({ product, size = "md" }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 600);
  }

  const sizeClasses =
    size === "lg"
      ? "text-sm px-5 py-2"
      : size === "sm"
      ? "text-[11px] px-3 py-1"
      : "text-xs px-4 py-1.5";

  return (
    <button
      onClick={handleClick}
      className={`rounded-full border transition-all duration-200 ${sizeClasses} ${
        added
          ? "border-white bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.7)] scale-105"
          : "border-white/70 text-slate-100 hover:bg-white hover:text-black hover:shadow-[0_0_15px_rgba(255,255,255,0.5)]"
      }`}
    >
      {added ? "Hinzugefügt ✓" : "In den Warenkorb"}
    </button>
  );
}
