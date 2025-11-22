import { NextRequest, NextResponse } from "next/server";
import { getPayPalAccessToken } from "@/lib/paypal";
import { dbQuery } from "@/lib/db";
import { sendOrderMail } from "@/lib/mail";

type CheckoutCustomer = {
  firstName?: string;
  lastName?: string;
  email?: string;
  street?: string;
  zip?: string;
  city?: string;
  country?: string;
};

type CheckoutItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    const orderID = body?.orderID as string | undefined;
    const customer = body?.customer as CheckoutCustomer | undefined;
    const items = (body?.items || []) as CheckoutItem[];
    const totalFromClient = body?.total as number | undefined;
    const couponCode = body?.couponCode as string | undefined;

    if (!orderID) {
      return NextResponse.json(
        { success: false, error: "Missing orderID" },
        { status: 400 }
      );
    }

    const accessToken = await getPayPalAccessToken();

    const res = await fetch(
      `${process.env.PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok || data.status !== "COMPLETED") {
      console.error("PayPal capture error:", data);

      const adminMail = process.env.SHOP_ADMIN_EMAIL || process.env.SMTP_USER;
      if (adminMail) {
        await sendOrderMail({
          to: adminMail,
          subject: "CRITICAL ERROR / Zahlungsfehler",
          text:
            `PayPal-Capture fehlgeschlagen.\n\n` +
            `OrderID: ${orderID}\n\n` +
            `HTTP-Status: ${res.status}\n\n` +
            `Payload:\n${JSON.stringify(data, null, 2)}\n`,
        });
      }

      return NextResponse.json(
        { success: false, error: "Capture failed" },
        { status: 400 }
      );
    }

    // Betrag aus PayPal-Response holen
    const pu = data.purchase_units?.[0];
    const capture = pu?.payments?.captures?.[0];
    const amountValue = capture?.amount?.value;
    const currencyCode = capture?.amount?.currency_code ?? "EUR";

    const numericAmount = amountValue ? parseFloat(amountValue) : totalFromClient ?? 0;

    // Eigene Bestellnummer
    const orderNumber = `4ACE-PP-${new Date().getFullYear()}-${Math.floor(
      Math.random() * 900000 + 100000
    )}`;

    const amountText = numericAmount
      ? `${numericAmount.toFixed(2).replace(".", ",")} ${currencyCode}`
      : "–";

    // Text-Übersicht für Mail
    const itemsText =
      items.length > 0
        ? items
            .map(
              (i) =>
                `- ${i.name} × ${i.quantity} = ${(i.price * i.quantity)
                  .toFixed(2)
                  .replace(".", ",")} €`
            )
            .join("\n")
        : "Keine Artikeldetails übermittelt.";

    // --- DB: speichern, Fehler nicht weiterwerfen ---
    try {
      await dbQuery(
        `
        INSERT INTO orders (
          order_number,
          payment_method,
          status,
          billing_first_name,
          billing_last_name,
          billing_email,
          billing_street,
          billing_zip,
          billing_city,
          billing_country,
          total_amount,
          currency,
          paypal_order_id,
          coupon_code
        )
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        `,
        [
          orderNumber,
          "paypal",
          "paid",
          customer?.firstName ?? null,
          customer?.lastName ?? null,
          customer?.email ?? null,
          customer?.street ?? null,
          customer?.zip ?? null,
          customer?.city ?? null,
          customer?.country ?? null,
          numericAmount || null,
          currencyCode,
          orderID,
          couponCode ?? null,
        ]
      );
    } catch (dbErr) {
      console.error("DB-Fehler bei PayPal-Capture (wird ignoriert):", dbErr);
    }

    const adminMail = process.env.SHOP_ADMIN_EMAIL || process.env.SMTP_USER;

    // Mail an Kunden (nur wenn E-Mail existiert)
    if (customer?.email) {
      try {
        await sendOrderMail({
          to: customer.email,
          subject: `Deine Bestellung ${orderNumber} bei 4aCe (PayPal)`,
          text:
            `Hallo ${customer.firstName || ""} ${customer.lastName || ""}\n\n` +
            `vielen Dank für deine Bestellung im 4aCe Shop.\n\n` +
            `Bestellnummer: ${orderNumber}\n` +
            `Zahlungsart: PayPal\n` +
            `Betrag: ${amountText}\n` +
            (couponCode
              ? `Eingesetzter Gutschein: ${couponCode.toUpperCase()}\n`
              : "") +
            `\nBestellte Artikel:\n${itemsText}\n\n` +
            `Wir melden uns, sobald deine Bestellung in den Versand geht.\n\n` +
            `Viele Grüße\n` +
            `dein 4aCe Team`,
        });
      } catch (mailErr) {
        console.error("Mail-Fehler (Kunde, PayPal):", mailErr);
      }
    }

    // Mail an dich / intern
    try {
      if (adminMail) {
        await sendOrderMail({
          to: adminMail,
          subject: `Neue PayPal-Bestellung ${orderNumber}`,
          text:
            `Neue PayPal-Bestellung im 4aCe Shop.\n\n` +
            `Bestellnummer: ${orderNumber}\n` +
            `PayPal OrderID: ${orderID}\n` +
            `Betrag: ${amountText}\n` +
            (couponCode
              ? `Gutschein: ${couponCode.toUpperCase()}\n`
              : "") +
            `\nKunde: ${customer?.firstName || ""} ${
              customer?.lastName || ""
            }\n` +
            `E-Mail: ${customer?.email || "-"}\n` +
            `Adresse: ${customer?.street || "-"}, ${customer?.zip || ""} ${
              customer?.city || ""
            }, ${customer?.country || ""}\n\n` +
            `Artikel:\n${itemsText}\n`,
        });
      }
    } catch (mailErr) {
      console.error("Mail-Fehler (intern, PayPal):", mailErr);
    }

    return NextResponse.json({
      success: true,
      orderNumber,
      localOrderId: orderNumber,
    });
  } catch (err: any) {
    console.error("Fehler in /api/paypal/capture-order:", err);

    const adminMail = process.env.SHOP_ADMIN_EMAIL || process.env.SMTP_USER;
    if (adminMail) {
      await sendOrderMail({
        to: adminMail,
        subject: "CRITICAL ERROR / Zahlungsfehler",
        text:
          `Unhandled Error in /api/paypal/capture-order\n\n` +
          `Message: ${err?.message || String(err)}\n\n` +
          `Stack:\n${err?.stack || "-"}\n`,
      });
    }

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
