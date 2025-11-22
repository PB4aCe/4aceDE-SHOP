"use client";

import { useSearchParams } from "next/navigation";

export default function ThankYouPage() {
  const searchParams = useSearchParams();

  const orderNumber = searchParams.get("order") || undefined;
  const method = searchParams.get("method") || undefined;

  const methodText =
    method === "paypal"
      ? "PayPal"
      : method === "vorkasse"
      ? "Vorkasse (Banküberweisung)"
      : "deine ausgewählte Zahlungsart";

  return (
    <div className="max-w-4xl space-y-4">
      <h1 className="text-3xl font-bold text-white">
        Vielen Dank für deine Bestellung!
      </h1>

      {orderNumber ? (
        <p className="text-sm text-slate-200">
          Deine Bestellnummer lautet:{" "}
          <span className="font-semibold">{orderNumber}</span>
        </p>
      ) : (
        <p className="text-sm text-slate-200">
          Deine Bestellung wurde erfolgreich übermittelt.
        </p>
      )}

      <p className="text-sm text-slate-300">
        Zahlungsart: <span className="font-semibold">{methodText}</span>.
      </p>

      <p className="text-sm text-slate-300">
        Du solltest in Kürze eine Bestellbestätigung per E-Mail erhalten. Bitte
        prüfe auch deinen Spam-Ordner, falls keine Mail ankommt.
      </p>

      <p className="text-xs text-slate-500 pt-2">
        Wenn du Fragen zu deiner Bestellung hast, antworte einfach auf die
        Bestellbestätigungs-Mail oder melde dich direkt bei 4aCe.
      </p>
    </div>
  );
}
