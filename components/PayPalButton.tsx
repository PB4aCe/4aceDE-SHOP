"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "./CartContext";

declare global {
  interface Window {
    paypal?: any;
  }
}

type CheckoutCustomer = {
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  zip: string;
  city: string;
  country: string;
};

// Aus der .env.local (muss mit NEXT_PUBLIC_ anfangen!)
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "";

export function PayPalButton({
  checkoutCustomer,
  couponCode,
  amount,
}: {
  checkoutCustomer?: CheckoutCustomer;
  couponCode?: string;
  amount: number; // 👉 rabattierter Gesamtbetrag (finalTotal) aus dem Checkout
}) {
  const { items, clearCart } = useCart();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Kein Button ohne Artikel oder bei 0 €
  if (items.length === 0 || amount <= 0) return null;

  // PayPal SDK laden
  useEffect(() => {
    const clientId = PAYPAL_CLIENT_ID;

    if (!clientId) {
      setError("Keine PayPal Client-ID konfiguriert.");
      return;
    }

    if (window.paypal) {
      setReady(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=EUR&intent=capture`;
    script.async = true;
    script.onload = () => {
      if (window.paypal) {
        setReady(true);
      } else {
        setError("PayPal SDK geladen, aber window.paypal fehlt.");
      }
    };
    script.onerror = () => {
      setError("Fehler beim Laden des PayPal SDK.");
    };
    document.body.appendChild(script);
  }, []);

  // Buttons rendern
  useEffect(() => {
    if (!ready || !window.paypal || !containerRef.current) return;

    containerRef.current.innerHTML = "";

    window.paypal
      .Buttons({
        // Order wird im Browser erstellt – mit rabattiertem Betrag
        createOrder: (_data: any, actions: any) => {
          if (items.length === 0 || amount <= 0) {
            alert(
              "Der Warenkorb ist leer oder der Betrag ist 0 €. PayPal-Zahlung ist nicht möglich."
            );
            throw new Error("Invalid cart total for PayPal");
          }

          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                amount: {
                  currency_code: "EUR",
                  value: amount.toFixed(2), // z. B. "24.90"
                },
              },
            ],
          });
        },

        // Kunde hat in PayPal bestätigt → capture auf dem Server + DB + Mails
        onApprove: async (data: any) => {
  try {
    const res = await fetch("/api/paypal/capture-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderID: data.orderID,
        customer: checkoutCustomer ?? null,
        couponCode: couponCode ?? null,
        items: items.map((i) => ({
          id: i.product.id,
          name: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
        })),
        total: amount, // finalTotal aus der Kasse
      }),
    });

    const text = await res.text();
    let result: any = {};
    try {
      result = text ? JSON.parse(text) : {};
    } catch {
      console.error("capture-order raw response:", text);
    }

    if (!res.ok || !result.success) {
      console.error("Fehler bei capture-order:", result);
      alert(
        "Fehler bei der Bestätigung der Zahlung. Wenn Geld abgebucht wurde, kontaktiere bitte den Support."
      );
      return;
    }

    const orderNumber =
      result.orderNumber ?? result.localOrderId ?? "UNBEKANNT";

    clearCart();
    window.location.href = `/thank-you?order=${encodeURIComponent(
      orderNumber
    )}&method=paypal`;
  } catch (err) {
    console.error("onApprove exception:", err);
    alert(
      "Es ist ein unerwarteter Fehler bei der Zahlung aufgetreten. Bitte versuche es später erneut."
    );
  }
},

        onError: (err: any) => {
          console.error("PayPal onError:", err);
          setError("Es ist ein Fehler bei PayPal aufgetreten.");
        },
      })
      .render(containerRef.current);
  }, [ready, items, clearCart, amount, checkoutCustomer, couponCode]);

  return (
    <div className="border border-slate-600 rounded-xl p-4 bg-black/70">
      <div className="text-xs text-slate-300 mb-2">
        Bezahle sicher per PayPal. Gesamtbetrag:{" "}
        <span className="text-slate-50 font-semibold">
          {amount.toFixed(2).replace(".", ",")} €
        </span>
      </div>

      {error && (
        <p className="text-xs text-red-400 mb-2">
          {error}
        </p>
      )}

      {!error && !ready && (
        <p className="text-xs text-slate-500 mb-2">PayPal wird geladen…</p>
      )}

      <div ref={containerRef} />
    </div>
  );
}
