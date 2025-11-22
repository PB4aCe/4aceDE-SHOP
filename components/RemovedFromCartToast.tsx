"use client";

import { useEffect } from "react";
import { useCart } from "./CartContext";

export function RemovedFromCartToast() {
  const { lastRemoved, clearLastRemoved } = useCart();

  useEffect(() => {
    if (!lastRemoved) return;
    const t = setTimeout(() => {
      clearLastRemoved();
    }, 2500);
    return () => clearTimeout(t);
  }, [lastRemoved, clearLastRemoved]);

  if (!lastRemoved) return null;

  return (
    <div className="fixed right-4 bottom-20 z-50 max-w-xs">
      <div className="rounded-2xl border border-red-500/70 bg-slate-900/95 px-4 py-3 shadow-[0_0_24px_rgba(239,68,68,0.6)] animate-[toast-in_0.18s_ease-out_forwards]">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 h-6 w-6 rounded-full bg-red-500 flex items-center justify-center text-slate-950 text-xs font-bold">
            −
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-slate-50">
              Aus dem Warenkorb entfernt
            </p>
            <p className="text-[11px] text-slate-300 mt-0.5">
              <span className="font-medium text-red-300">
                {lastRemoved.name}
              </span>{" "}
              wurde aus deinem Warenkorb entfernt.
            </p>
          </div>
          <button
            onClick={clearLastRemoved}
            className="text-slate-400 hover:text-slate-100 text-xs ml-1"
          >
            ✕
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes toast-in {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
