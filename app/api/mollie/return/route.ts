import { NextResponse } from "next/server";
import { mollieClient } from "@/lib/mollie";
import { sendOrderMail } from "@/lib/mail";

export const runtime = "nodejs";

function buildCustomerMailText(meta: any) {
  const customer = meta?.customer;
  const items = meta?.items ?? [];
  const totals = meta?.totals;

  const lines = [
    `Vielen Dank für deine Bestellung bei 4aCe!`,
    ``,
    `Bestellnummer: ${meta?.orderNumber ?? "—"}`,
    `Zahlungsart: Mollie (z.B. Klarna/Karte/Sofort)`,
    ``,
    `Kundendaten:`,
    `${customer?.firstName ?? ""} ${customer?.lastName ?? ""}`,
    `${customer?.street ?? ""}`,
    `${customer?.zip ?? ""} ${customer?.city ?? ""}`,
    `${customer?.country ?? ""}`,
    `${customer?.email ?? ""}`,
    ``,
    `Artikel:`,
    ...items.map((i: any) =>
      `- ${i.name} x${i.quantity} = ${(i.price * i.quantity)
        .toFixed(2)
        .replace(".", ",")} €`
    ),
    ``,
    `Gesamt: ${Number(totals?.totalAmount ?? 0)
      .toFixed(2)
      .replace(".", ",")} ${totals?.currency ?? "EUR"}`,
    ``,
    `Wenn du Fragen hast, antworte einfach auf diese Mail.`,
  ];

  return lines.join("\n");
}

function buildAdminMailText(meta: any, payment: any) {
  const customer = meta?.customer;
  const items = meta?.items ?? [];
  const totals = meta?.totals;

  const lines = [
    `🧾 Neue Mollie-Bestellung`,
    ``,
    `Status: ${payment?.status}`,
    `Payment ID: ${payment?.id}`,
    `Bestellnummer: ${meta?.orderNumber ?? "—"}`,
    `Coupon: ${meta?.couponCode ?? "—"}`,
    ``,
    `Kunde:`,
    `${customer?.firstName ?? ""} ${customer?.lastName ?? ""}`,
    `${customer?.email ?? ""}`,
    `${customer?.street ?? ""}`,
    `${customer?.zip ?? ""} ${customer?.city ?? ""}`,
    `${customer?.country ?? ""}`,
    ``,
    `Artikel:`,
    ...items.map((i: any) =>
      `- ${i.name} (${i.id}) x${i.quantity} @ ${Number(i.price).toFixed(2)}`
    ),
    ``,
    `Gesamt: ${Number(totals?.totalAmount ?? 0).toFixed(2)} ${totals?.currency ?? "EUR"}`,
  ];

  return lines.join("\n");
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const paymentId = url.searchParams.get("payment") ?? "";
    const method = url.searchParams.get("method") ?? "mollie";

    const siteUrl =
      process.env.SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

    if (!paymentId) {
      return NextResponse.redirect(`${siteUrl}/thank-you?method=${method}`);
    }

    const payment = await mollieClient.payments.get(paymentId);
    const meta: any = payment?.metadata ?? {};
    const orderNumber = meta?.orderNumber;

    // ✅ Nur wenn wirklich bezahlt → Mails raus
    if (payment.status === "paid") {
      // Kunde
      if (meta?.customer?.email) {
        await sendOrderMail({
          to: meta.customer.email,
          subject: `Deine 4aCe Bestellung ${orderNumber ?? ""}`,
          text: buildCustomerMailText(meta),
        });
      }

      // Admin / intern
      const adminTo = process.env.SMTP_USER; // oder extra ADMIN_MAIL
      if (adminTo) {
        await sendOrderMail({
          to: adminTo,
          subject: `🧾 Neue Mollie-Bestellung ${orderNumber ?? ""}`,
          text: buildAdminMailText(meta, payment),
        });
      }
    }

    // ✅ Immer weiter zur Thank-You Seite
    const safeOrder = orderNumber ? encodeURIComponent(orderNumber) : "";
    return NextResponse.redirect(
      `${siteUrl}/thank-you${safeOrder ? `?order=${safeOrder}&method=mollie` : `?method=mollie`}`
    );
  } catch (err) {
    console.error("Mollie return error:", err);
    const siteUrl =
      process.env.SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";
    return NextResponse.redirect(`${siteUrl}/thank-you?method=mollie`);
  }
}
