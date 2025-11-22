"use client";

import Link from "next/link";
import { useCart } from "./CartContext";

export function CartNavButton() {
  const { itemCount } = useCart();

  return (
    <Link
      href="/cart"
      className="relative inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border border-slate-700/70 bg-black/70 hover:border-slate-100 hover:bg-black transition-all"
    >
      <div className="relative">
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          aria-hidden="true"
          role="img"
        >
          <path
            d="M7 6h13l-1.2 7.2a2 2 0 0 1-2 1.8H9.3a2 2 0 0 1-2-1.6L6 4H3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="10" cy="19" r="1" />
          <circle cx="17" cy="19" r="1" />
        </svg>
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 min-w-[16px] h-[16px] rounded-full bg-white text-[10px] font-semibold text-black flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </div>
      <span className="hidden sm:inline text-slate-200">
        Warenkorb
      </span>
    </Link>
  );
}
