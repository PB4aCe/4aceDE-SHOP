"use client";

import { useCart } from "./CartContext";
import type { Product } from "@/data/products";
import { useState } from "react";

type AddToCartButtonProps = {
  product: Product;
  size?: "sm" | "md" | "lg";

  // ✅ optional: falls du in bestimmten Views extra sperren willst
  disabled?: boolean;
  disabledText?: string;
};

export function AddToCartButton({
  product,
  size = "md",
  disabled,
  disabledText,
}: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  // ✅ Auto-Sperre nur für "unavailable"
  const autoDisabled = product.availability === "unavailable";
  const isDisabled = Boolean(disabled || autoDisabled);

  function handleClick() {
    if (isDisabled) return;

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

  const base =
    "rounded-full border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20";

  const enabledIdle =
    "border-white/70 text-slate-100 hover:bg-white hover:text-black hover:shadow-[0_0_15px_rgba(255,255,255,0.5)]";

  const enabledAdded =
    "border-white bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.7)] scale-105";

  // ✅ Disabled-Look (rot & kräftig für unavailable)
  const unavailableLook =
    "border-red-500/80 text-red-300 bg-red-950/20 cursor-not-allowed opacity-90";

  const genericDisabledLook =
    "border-slate-600 text-slate-400 bg-slate-900/40 cursor-not-allowed opacity-70";

  const disabledClass = autoDisabled ? unavailableLook : genericDisabledLook;

  const label = isDisabled
    ? disabledText || (autoDisabled ? "NICHT LIEFERBAR" : "Nicht verfügbar")
    : added
    ? "Hinzugefügt ✓"
    : "In den Warenkorb";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      className={`${base} ${sizeClasses} ${
        isDisabled ? disabledClass : added ? enabledAdded : enabledIdle
      }`}
      title={isDisabled ? label : "In den Warenkorb"}
    >
      {label}
    </button>
  );
}
