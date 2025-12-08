// app/api/mollie/webhook/route.ts
import { NextResponse } from "next/server";
import { mollieClient } from "@/lib/mollie";
import { dbQuery } from "@/lib/db";

// Helfer: Payment-ID aus allen möglichen Body-Formaten ziehen
function extractPaymentIdFromRaw(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // Fall 1: Body ist direkt die ID: "tr_xxx"
  if (trimmed.startsWith("tr_")) return trimmed;

  // Fall 2: Body ist "id=tr_xxx" oder "id: tr_xxx"
  const match = trimmed.match(/id\s*[:=]\s*(tr_[A-Za-z0-9_-]+)/i);
  if (match?.[1]) return match[1];

  // Fall 3: irgendwas mit tr_ drin
  const loose = trimmed.match(/(tr_[A-Za-z0-9_-]+)/);
  if (loose?.[1]) return loose[1];

  return null;
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let paymentId: string | null = null;

    // ✅ JSON Body
    if (contentType.includes("application/json")) {
      try {
        const body = await req.json();
        paymentId = body?.id ?? null;
      } catch {
        // fallback lesen wir weiter unten als text
      }
    }

    // ✅ Form-encoded / multipart
    if (!paymentId && (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data"))) {
      try {
        const form = await req.formData();
        paymentId = form.get("id")?.toString() ?? null;
      } catch {
        // ignore
      }
    }

    // ✅ Fallback: raw text
    if (!paymentId) {
      const raw = await req.text();
      paymentId = extractPaymentIdFromRaw(raw);
    }

    // Mollie erwartet i.d.R. 200 OK, auch wenn du nix machst
    if (!paymentId) {
      return NextResponse.json({ ok: true });
    }

    const payment = await mollieClient.payments.get(paymentId);
    const status = payment.status; // "paid", "open", "failed", ...

    // metadata sollte in create-payment gesetzt werden
    const metadata = (payment.metadata ?? {}) as Record<string, any>;
    const orderNumber: string | undefined =
      typeof metadata.orderNumber === "string" ? metadata.orderNumber : undefined;

    console.log("Mollie webhook received:", {
      id: payment.id,
      status,
      orderNumber,
      metadata,
    });

    // ✅ Nur bei bezahlter Zahlung weiter
    if (status !== "paid") {
      return NextResponse.json({ ok: true });
    }

    // ✅ Wenn wir keine orderNumber haben, können wir nix sauber zuordnen
    if (!orderNumber) {
      console.warn("Mollie webhook: paid, aber keine metadata.orderNumber gefunden.");
      return NextResponse.json({ ok: true });
    }

    // ✅ Orders-Status update (minimal & schema-safe)
    // Wir fassen nur "status" an, weil wir nicht sicher wissen,
    // welche zusätzlichen Spalten du wirklich in deiner Tabelle hast.
    try {
      await dbQuery(
        "UPDATE orders SET status = ? WHERE order_number = ?",
        ["paid", orderNumber]
      );
    } catch (dbErr) {
      console.warn("Mollie webhook: DB update failed (ignored):", dbErr);
    }

    // ✅ OPTIONAL später:
    // - Bestellbestätigung-Mail senden
    // - Admin Notification
    // Das hier lassen wir bewusst raus, damit dein Build nicht bricht,
    // falls du keine zentrale Mail-Funktion/Route hast.

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Mollie webhook error:", err);

    // Mollie erwartet 200, sonst spammt es mögliche Retries.
    return NextResponse.json({ ok: true });
  }
}
