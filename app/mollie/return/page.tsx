"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function MollieReturnPage() {
  const sp = useSearchParams();
  const order = sp.get("order");

  const [msg, setMsg] = useState("Zahlung wird geprüft...");

  useEffect(() => {
    async function run() {
      const safeOrder =
        order ?? sessionStorage.getItem("mollie_last_order") ?? undefined;

      if (!safeOrder) {
        setMsg("Keine Bestellnummer gefunden. Weiterleitung...");
        window.location.replace(`/thank-you?method=mollie`);
        return;
      }

      const paymentId =
        sessionStorage.getItem(`mollie_payment_${safeOrder}`) ?? undefined;

      if (!paymentId) {
        setMsg("Payment-ID fehlt lokal. Weiterleitung...");
        window.location.replace(
          `/thank-you?order=${encodeURIComponent(safeOrder)}&method=mollie`
        );
        return;
      }

      try {
        const res = await fetch("/api/mollie/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId }),
        });

        const json = await res.json();

        // ✅ wenn paid -> complete liefert orderNumber zurück
        if (json?.success && json?.orderNumber) {
          // cleanup optional
          sessionStorage.removeItem(`mollie_payment_${json.orderNumber}`);
          window.location.replace(
            `/thank-you?order=${encodeURIComponent(
              json.orderNumber
            )}&method=mollie`
          );
          return;
        }

        // Fallback
        window.location.replace(
          `/thank-you?order=${encodeURIComponent(safeOrder)}&method=mollie`
        );
      } catch (e) {
        console.error(e);
        window.location.replace(
          `/thank-you?order=${encodeURIComponent(safeOrder)}&method=mollie`
        );
      }
    }

    run();
  }, [order]);

  return (
    <div className="max-w-2xl space-y-3">
      <h1 className="text-2xl font-semibold text-white">Zahlung wird geprüft</h1>
      <p className="text-sm text-slate-300">{msg}</p>
    </div>
  );
}
