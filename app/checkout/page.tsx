"use client";

import { useState, useMemo } from "react";
import { useCart } from "@/components/CartContext";
import { PayPalButton } from "@/components/PayPalButton";
import {
  applyCouponToCart,
  type CartItemInput,
  type CouponResult,
} from "@/lib/coupons";

type CheckoutData = {
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  zip: string;
  city: string;
  country: string;
};

const defaultData: CheckoutData = {
  firstName: "",
  lastName: "",
  email: "",
  street: "",
  zip: "",
  city: "",
  country: "Deutschland",
};

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();

  const [data, setData] = useState<CheckoutData>(defaultData);
  const [confirmed, setConfirmed] = useState(false);
  const [processingVorkasse, setProcessingVorkasse] = useState(false);
  const [agbAccepted, setAgbAccepted] = useState(false);

  // Rabattcode-States
  const [couponInput, setCouponInput] = useState("");
  const [activeCouponCode, setActiveCouponCode] = useState<string | null>(null);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [couponResult, setCouponResult] = useState<CouponResult | null>(null);
  const [couponIsError, setCouponIsError] = useState(false);

  const baseInputClass =
    "w-full rounded-md border px-2 py-1 text-sm transition-colors";
  const editableClass = "bg-slate-950 border-slate-700 text-slate-100";
  const lockedClass =
    "bg-slate-900 border-slate-700 text-slate-400 cursor-not-allowed";

  if (items.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Kasse</h1>
        <p className="text-sm text-slate-300">
          Dein Warenkorb ist leer. Bitte füge Produkte hinzu, bevor du zur Kasse
          gehst.
        </p>
      </div>
    );
  }

  // Basis-Zwischensumme aus dem Warenkorb
  const baseSubtotal = useMemo(
    () =>
      items.reduce(
        (sum, i) => sum + i.product.price * i.quantity,
        0
      ),
    [items]
  );

  // Endgültige Werte (mit oder ohne aktiven Gutschein)
  const subtotal = couponResult?.subtotal ?? baseSubtotal;
  const discountAmount = couponResult?.discountAmount ?? 0;
  const finalTotal = couponResult?.finalTotal ?? subtotal;
  const appliedCoupon = couponResult?.appliedCoupon ?? null;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    return (
      data.firstName.trim() &&
      data.lastName.trim() &&
      data.email.trim() &&
      data.street.trim() &&
      data.zip.trim() &&
      data.city.trim()
    );
  }

  async function handleVorkasse() {
  if (!confirmed) return;
  try {
    setProcessingVorkasse(true);

    // 1. Bisherige API: Mail etc.
    const res = await fetch("/api/checkout/vorkasse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: data,
        items: items.map((i) => ({
          id: i.product.id,
          name: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
        })),
        total: finalTotal,
        couponCode: activeCouponCode,
      }),
    });
    const json = await res.json();
    if (!res.ok || !json.success || !json.orderNumber) {
      alert("Fehler bei der Vorkasse-Bestellung.");
      setProcessingVorkasse(false);
      return;
    }

    const orderNumber: string = json.orderNumber;

    // 2. NEU: Bestellung in DB speichern
    await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderNumber,
        paymentMethod: "vorkasse" as const,
        status: "pending",
        customer: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          street: data.street,
          zip: data.zip,
          city: data.city,
          country: data.country,
        },
        totals: {
          totalAmount: finalTotal,
          currency: "EUR",
        },
        // billing/payer/shipping kannst du später bei Bedarf ergänzen
      }),
    });

    // 3. Warenkorb leeren + Redirect
    clearCart();
    window.location.href = `/thank-you?order=${encodeURIComponent(
      orderNumber
    )}&method=vorkasse`;
  } catch (e) {
    console.error(e);
    alert("Unerwarteter Fehler bei der Vorkasse-Bestellung.");
    setProcessingVorkasse(false);
  }
}


  function handleApplyCoupon() {
  const code = couponInput.trim();
  if (!code) {
    setActiveCouponCode(null);
    setCouponResult(null);
    setCouponMessage(null);
    setCouponIsError(false);
    return;
  }

  const cartItemsForCoupon: CartItemInput[] = items.map((i) => ({
    id: i.product.id,
    price: i.product.price,
    quantity: i.quantity,
  }));

  const result = applyCouponToCart(cartItemsForCoupon, code);

  if (result.discountAmount > 0 && result.appliedCoupon) {
    setActiveCouponCode(code.toUpperCase());
    setCouponResult(result);
    setCouponMessage(
      `Gutschein "${code.toUpperCase()}" angewendet: -${result.discountAmount
        .toFixed(2)
        .replace(".", ",")} €`
    );
    setCouponIsError(false);
  } else {
    setActiveCouponCode(null);
    setCouponResult(null);
    setCouponMessage(`Gutschein "${code.toUpperCase()}" ist nicht gültig.`);
    setCouponIsError(true);
  }
}


  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] items-start">
      {/* Adressdaten */}
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Kasse</h1>
        <p className="text-sm text-slate-300">
          Bitte gib deine Rechnungs- und Lieferdaten ein. Erst nach Zahlung wird
          die Bestellung endgültig ausgelöst.
        </p>

        <div className="space-y-3 border border-slate-800 rounded-2xl p-4 bg-black/60">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                Vorname
              </label>
              <input
                name="firstName"
                value={data.firstName}
                onChange={handleChange}
                readOnly={confirmed}
                className={`${baseInputClass} ${
                  confirmed ? lockedClass : editableClass
                }`}
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                Nachname
              </label>
              <input
                name="lastName"
                value={data.lastName}
                onChange={handleChange}
                readOnly={confirmed}
                className={`${baseInputClass} ${
                  confirmed ? lockedClass : editableClass
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">
              E-Mail
            </label>
            <input
              name="email"
              type="email"
              value={data.email}
              onChange={handleChange}
              readOnly={confirmed}
              className={`${baseInputClass} ${
                confirmed ? lockedClass : editableClass
              }`}
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">
              Straße & Hausnummer
            </label>
            <input
              name="street"
              value={data.street}
              onChange={handleChange}
              readOnly={confirmed}
              className={`${baseInputClass} ${
                confirmed ? lockedClass : editableClass
              }`}
            />
          </div>

          <div className="grid grid-cols-[1.2fr_2fr] gap-3">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                PLZ
              </label>
              <input
                name="zip"
                value={data.zip}
                onChange={handleChange}
                readOnly={confirmed}
                className={`${baseInputClass} ${
                  confirmed ? lockedClass : editableClass
                }`}
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                Ort
              </label>
              <input
                name="city"
                value={data.city}
                onChange={handleChange}
                readOnly={confirmed}
                className={`${baseInputClass} ${
                  confirmed ? lockedClass : editableClass
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">
              Land
            </label>
            <input
              name="country"
              value={data.country}
              onChange={handleChange}
              readOnly={confirmed}
              className={`${baseInputClass} ${
                confirmed ? lockedClass : editableClass
              }`}
            />
          </div>

          {/* AGB + Widerruf + Impressum Checkbox */}
          <div className="mt-3 flex items-start gap-2">
            <input
              type="checkbox"
              id="agb"
              checked={agbAccepted}
              onChange={(e) => setAgbAccepted(e.target.checked)}
              disabled={confirmed}
              className="mt-0.5 h-3 w-3 rounded border-slate-500 bg-slate-950"
            />
            <label
              htmlFor="agb"
              className="text-[11px] leading-snug text-slate-400"
            >
              Ich habe die{" "}
              <a
                href="https://4ace.de/agb"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2 hover:text-slate-200"
              >
                AGB
              </a>
              , die{" "}
              <a
                href="https://4ace.de/widerrufsbelehrung"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2 hover:text-slate-200"
              >
                Widerrufsbelehrung
              </a>{" "}
              sowie das{" "}
              <a
                href="https://4ace.de/impressum"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2 hover:text-slate-200"
              >
                Impressum
              </a>{" "}
              gelesen und akzeptiere diese.
            </label>
          </div>

          {/* Vertragshinweis */}
          <p className="mt-2 text-[11px] text-slate-500">
            Der Vertrag kommt mit{" "}
            <span className="font-semibold">
              Publishing by 4aCe (Raoul Rajski)
            </span>
            , Am Siel 6, 28790 Schwanewede zustande.
          </p>

          {/* Buttons: Daten bestätigen / Daten ändern */}
          <div className="mt-3 flex flex-wrap gap-2 items-center">
            {!confirmed && (
              <button
                disabled={!validate() || !agbAccepted}
                onClick={() => setConfirmed(true)}
                className="text-xs px-4 py-2 rounded-full border border-white bg-white text-black font-semibold tracking-wide uppercase hover:bg-transparent hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Daten bestätigen
              </button>
            )}

            {confirmed && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setConfirmed(false);
                  }}
                  className="text-xs px-4 py-2 rounded-full border border-slate-500 text-slate-200 hover:border-slate-200 hover:bg-slate-900 transition-all"
                >
                  Daten ändern
                </button>
                <span className="text-[11px] text-emerald-400">
                  Daten bestätigt. Du kannst jetzt eine Zahlungsmethode
                  auswählen.
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bestellübersicht + Zahlarten */}
      <div className="space-y-4">
        <div className="border border-slate-800 rounded-2xl p-4 bg-black/60 space-y-3">
          <h2 className="text-sm font-semibold mb-1">Übersicht</h2>
          <ul className="space-y-2 text-sm text-slate-200">
            {items.map((item) => (
              <li
                key={item.product.id}
                className="flex justify-between text-[13px]"
              >
                <span>
                  {item.product.name} × {item.quantity}
                </span>
                <span>
                  {(item.product.price * item.quantity)
                    .toFixed(2)
                    .replace(".", ",")}{" "}
                  €
                </span>
              </li>
            ))}
          </ul>

          <div className="flex justify-between border-t border-slate-800 mt-3 pt-3 text-sm">
            <span className="text-slate-300">Zwischensumme</span>
            <span className="font-semibold text-slate-50">
              {subtotal.toFixed(2).replace(".", ",")} €
            </span>
          </div>

          {discountAmount > 0 && appliedCoupon && (
            <div className="flex justify-between text-xs text-red-400 mt-1">
              <span>Rabatt ({appliedCoupon.code.toUpperCase()})</span>
              <span>-{discountAmount.toFixed(2).replace(".", ",")} €</span>
            </div>
          )}

          <div className="flex justify-between mt-3 pt-2 text-sm border-t border-slate-800">
            <span className="text-slate-200 font-semibold">
              Gesamt (inkl. Rabatt)
            </span>
            <span className="font-semibold text-slate-50">
              {finalTotal.toFixed(2).replace(".", ",")} €
            </span>
          </div>

          {/* Coupon-Eingabe */}
          <div className="mt-4 space-y-2">
            <label className="block text-[11px] text-slate-400">
              Rabattcode
            </label>
            <div className="flex gap-2">
              <input
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="flex-1 rounded-md bg-slate-950 border border-slate-700 px-2 py-1 text-sm text-slate-100"
                placeholder="z.B. HERZ10"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="text-xs px-3 py-1 rounded-full border border-white text-white hover:bg-white hover:text-black transition-all"
              >
                Anwenden
              </button>
            </div>
            {couponMessage && (
  <p
    className={`text-[11px] ${
      couponIsError ? "text-red-400" : "text-emerald-400"
    }`}
  >
    {couponMessage}
  </p>
)}

          </div>
        </div>

        {confirmed && (
          <div className="space-y-3">
            <div className="border border-slate-800 rounded-2xl p-4 bg-black/60 space-y-3">
              <p className="text-xs text-slate-300 mb-1">Bezahlmethoden</p>

              {/* PayPal – bekommt Checkout-Daten + Coupon + finalen Betrag */}
              <PayPalButton
                checkoutCustomer={data}
                couponCode={activeCouponCode ?? undefined}
                amount={finalTotal}
              />

              {/* Vorkasse */}
              <button
                onClick={handleVorkasse}
                disabled={processingVorkasse}
                className="w-full text-xs px-4 py-2 rounded-full border border-slate-500 text-slate-100 hover:border-white hover:text-white hover:bg-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processingVorkasse
                  ? "Vorkasse wird angelegt…"
                  : "Vorkasse (Banküberweisung)"}
              </button>

              <p className="text-[11px] text-slate-400">
                Bei Vorkasse erhältst du eine E-Mail mit allen Überweisungsdaten.
                Die Bestellung wird erst nach Zahlungseingang von 4aCe
                bearbeitet.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
