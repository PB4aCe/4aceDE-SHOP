import type { Availability } from "@/data/products";

export function getAvailabilityMeta(a?: Availability) {
  switch (a) {
    case "unavailable":
      return {
        label: "NICHT LIEFERBAR",
        className:
          "text-[11px] font-extrabold tracking-wide text-red-300 bg-red-500/10 border border-red-500/50 px-2 py-0.5 rounded-full",
        canAdd: false,
      };
    case "restock":
      return {
        label: "Nichts auf Lager, Nachschub ist unterwegs",
        className:
          "text-[11px] font-semibold text-amber-200 bg-amber-500/10 border border-amber-500/40 px-2 py-0.5 rounded-full",
        canAdd: true,
      };
    case "1-3":
      return {
        label: "Lieferzeit 1–3 Werktage",
        className:
          "text-[11px] font-extrabold text-emerald-200 bg-emerald-500/10 border border-emerald-500/40 px-2 py-0.5 rounded-full",
        canAdd: true,
      };
    case "5-7":
    default:
      return {
        label: "Lieferzeit 5–7 Werktage",
        className:
          "text-[11px] font-extrabold text-emerald-200 bg-emerald-500/10 border border-emerald-500/40 px-2 py-0.5 rounded-full",
        canAdd: true,
      };
  }
}
