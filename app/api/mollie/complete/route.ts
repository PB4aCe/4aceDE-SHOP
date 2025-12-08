import { NextResponse } from "next/server";
import { mollieClient } from "@/lib/mollie";
import { sendOrderMail } from "@/lib/mail";

export const runtime = "nodejs";

function formatEUR(n: number) {
  return `${n.toFixed(2).replace(".", ",")} €`;
}

function calcSubtotal(items: any[] = []) {
  if (!Array.isArray(items)) return 0;
  return items.reduce((sum, i) => {
    const price = Number(i.price ?? 0);
    const qty = Number(i.quantity ?? 1);
    return sum + price * qty;
  }, 0);
}

function buildItemsText(items: any[] = []) {
  if (!Array.isArray(items) || items.length === 0) return "Keine Artikel-Daten.";

  return items
    .map((i) => {
      const name = i.name ?? i.id ?? "Artikel";
      const qty = Number(i.quantity ?? 1);
      const price = Number(i.price ?? 0);
      const lineTotal = price * qty;

      return `- ${name} | ${qty} × ${formatEUR(price)} = ${formatEUR(lineTotal)}`;
    })
    .join("\n");
}

export async function POST(req: Request) {
  try {
    const { paymentId } = await req.json();

    if (!paymentId) {
      return NextResponse.json(
        { success: false, error: "Missing paymentId" },
        { status: 400 }
      );
    }

    const payment = await mollieClient.payments.get(paymentId);

    // Nur "paid" triggert Mails
    if (payment.status !== "paid") {
      return NextResponse.json({
        success: false,
        status: payment.status,
      });
    }

    const md = (payment.metadata ?? {}) as any;

    const orderNumber =
      md.orderNumber ||
      (typeof payment.description === "string"
        ? payment.description.replace("4aCe Bestellung ", "").trim()
        : "UNBEKANNT");

    const customer = md.customer ?? {};
    const items = Array.isArray(md.items) ? md.items : [];
    const totals = md.totals ?? {};

    const currency = totals.currency ?? payment.amount?.currency ?? "EUR";

    // totalAmount aus metadata bevorzugt, fallback payment.amount.value
    const totalAmount = Number(
      totals.totalAmount ?? payment.amount?.value ?? 0
    );

    const subtotal = calcSubtotal(items);
    const rawDiscount = subtotal - totalAmount;
    const discountAmount = rawDiscount > 0 ? rawDiscount : 0;

    const couponCode = md.couponCode ?? null;

    const customerEmail = customer.email;

    const itemsText = buildItemsText(items);

    // ---------- Kundenmail ----------
    const customerLines: string[] = [
      `Vielen Dank für deine Bestellung bei 4aCe!`,
      ``,
      `Bestellnummer: ${orderNumber}`,
      `Zahlungsart: Mollie (z.B. Klarna/Karte/Sofort)`,
      ``,
      `Artikel:`,
      itemsText,
      ``,
      `Zwischensumme: ${formatEUR(subtotal)}`,
    ];

    if (couponCode) {
      customerLines.push(`Rabattcode: ${String(couponCode).toUpperCase()}`);
    }
    if (discountAmount > 0) {
      customerLines.push(`Rabatt: -${formatEUR(discountAmount)}`);
    }

    customerLines.push(
      `Gesamt: ${formatEUR(totalAmount)} ${currency !== "EUR" ? currency : ""}`.trim(),
      ``,
      `Lieferadresse:`,
      `${customer.firstName ?? ""} ${customer.lastName ?? ""}`.trim(),
      `${customer.street ?? ""}`.trim(),
      `${customer.zip ?? ""} ${customer.city ?? ""}`.trim(),
      `${customer.country ?? ""}`.trim(),
      ``,
      `Wenn du Fragen hast, antworte einfach auf diese Mail.`
    );

    const customerText = customerLines.filter(Boolean).join("\n");

    // ---------- Interne Mail ----------
    const internalTo =
      process.env.ADMIN_ORDER_EMAIL || process.env.SMTP_USER || "";

    const internalLines: string[] = [
      `Neue Mollie-Bestellung (PAID)`,
      ``,
      `Bestellnummer: ${orderNumber}`,
      `Payment ID: ${paymentId}`,
      `Status: ${payment.status}`,
      ``,
      `Kunde:`,
      `${customer.firstName ?? ""} ${customer.lastName ?? ""}`.trim(),
      `${customer.email ?? ""}`.trim(),
      `${customer.street ?? ""}`.trim(),
      `${customer.zip ?? ""} ${customer.city ?? ""}`.trim(),
      `${customer.country ?? ""}`.trim(),
      ``,
      `Artikel:`,
      itemsText,
      ``,
      `Zwischensumme: ${formatEUR(subtotal)}`,
    ];

    if (couponCode) {
      internalLines.push(`Rabattcode: ${String(couponCode).toUpperCase()}`);
    }
    if (discountAmount > 0) {
      internalLines.push(`Rabatt: -${formatEUR(discountAmount)}`);
    }

    internalLines.push(`Gesamt: ${formatEUR(totalAmount)} ${currency}`);

    const internalText = internalLines.filter(Boolean).join("\n");

    // ✅ Mails nur wenn wir Empfänger haben
    if (customerEmail) {
      await sendOrderMail({
        to: customerEmail,
        subject: `Deine 4aCe Bestellung ${orderNumber}`,
        text: customerText,
      });
    }

    if (internalTo) {
      await sendOrderMail({
        to: internalTo,
        subject: `Neue 4aCe Mollie-Bestellung ${orderNumber}`,
        text: internalText,
      });
    }

    return NextResponse.json({
      success: true,
      orderNumber,
      subtotal,
      discountAmount,
      totalAmount,
      couponCode,
    });
  } catch (err) {
    console.error("Mollie complete error:", err);
    return NextResponse.json(
      { success: false, error: "Complete failed" },
      { status: 500 }
    );
  }
}
