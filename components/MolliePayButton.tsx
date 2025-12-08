"use client";

import { useMemo } from "react";

type MolliePayButtonProps = {
  amount: number;
  onStartPayment: () => void | Promise<void>;
  disabled?: boolean;
  label?: string;
  className?: string;
};

export function MolliePayButton({
  amount,
  onStartPayment,
  disabled,
  label = "Klarna · Apple Pay · Karte",
  className = "",
}: MolliePayButtonProps) {
  const amountText = useMemo(
    () => amount.toFixed(2).replace(".", ","),
    [amount]
  );

  return (
    <button
      type="button"
      onClick={onStartPayment}
      disabled={disabled}
      className={[
        "w-full group",
        "border border-emerald-500/40",
        "bg-gradient-to-r from-emerald-950/40 via-black/40 to-emerald-950/40",
        "rounded-xl",
        "px-4 py-3",
        "text-left",
        "transition-all duration-200",
        "hover:border-emerald-300/70 hover:shadow-[0_0_18px_rgba(16,185,129,0.18)]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      ].join(" ")}
    >
      {/* 1 Zeile: Titel + Betrag + Pfeil */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* kleiner „Pulse-Dot“ */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400/40 opacity-60 animate-ping" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </span>

          <span className="text-xs font-semibold tracking-wide text-emerald-100">
            Weitere Zahlarten
          </span>

          <span className="text-[10px] text-slate-400">
            über Mollie
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400">Gesamt</span>
          <span className="text-xs font-semibold text-slate-50">
            {amountText} €
          </span>
          <span className="text-slate-500 group-hover:text-emerald-200 transition-colors">
            →
          </span>
        </div>
      </div>

      {/* 2 Zeile: kompakte Logos als „Mini-Chips“ */}
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <MiniBadge>KLARNA</MiniBadge>
        <MiniBadge>APPLE PAY</MiniBadge>
        <MiniBadge>VISA</MiniBadge>
        <MiniBadge>MASTERCARD</MiniBadge>
        <MiniBadge>SOFORT</MiniBadge>
        <MiniBadge>GIROPAY</MiniBadge>
        <MiniBadge>EPS</MiniBadge>
      </div>

      {/* 3 Zeile: super kurzer Untertitel */}
      <div className="mt-1 text-[10px] text-slate-500">
        {label}
      </div>
    </button>
  );
}

function MiniBadge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className={[
        "inline-flex items-center",
        "px-2 py-0.5",
        "rounded-full",
        "border border-white/8",
        "bg-white/5",
        "text-[9px]",
        "tracking-widest",
        "uppercase",
        "text-slate-200/90",
      ].join(" ")}
    >
      {children}
    </span>
  );
}
