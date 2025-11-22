// app/api/checkout/vorkasse/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dbQuery } from "@/lib/db";
import { sendOrderMail } from "@/lib/mail";

type CheckoutCustomer = {
  firstName: string;
  lastName: string;
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

    const customer = body?.customer as CheckoutCustomer | undefined;
    const items = (body?.items || []) as CheckoutItem[];
    const total = body?.total as number | undefined;
    const couponCode = body?.couponCode as string | undefined;

    const hasEmail = !!customer?.email;

    // Eigene Bestellnummer für Vorkasse
    const orderNumber = `4ACE-VK-${new Date().getFullYear()}-${Math.floor(
      Math.random() * 900000 + 100000
    )}`;

    // Gesamtbetrag als Text
    const amountText =
      typeof total === "number"
        ? `${total.toFixed(2).replace(".", ",")} EUR`
        : "–";

    // Bestellübersicht für Text-Mail
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

    // --- DB: speichern, aber Fehler NICHT den Flow killen lassen ---
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
          coupon_code
        )
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
        `,
        [
          orderNumber,
          "vorkasse",
          "pending",
          customer?.firstName ?? null,
          customer?.lastName ?? null,
          customer?.email ?? null,
          customer?.street ?? null,
          customer?.zip ?? null,
          customer?.city ?? null,
          customer?.country ?? null,
          total ?? null,
          "EUR",
          couponCode ?? null,
        ]
      );

      // falls du später order_items speichern willst:
      // const rows: any = await dbQuery("SELECT LAST_INSERT_ID() as id");
      // const orderId = rows[0].id;
      // items.forEach(...) → INSERT INTO order_items ...
    } catch (err) {
      console.error("DB-Fehler bei Vorkasse (wird ignoriert):", err);
    }

    // --- Mails schicken ---

    const adminMail = process.env.SHOP_ADMIN_EMAIL || process.env.SMTP_USER;

    const bankEmpfaenger =
      process.env.VORKASSE_EMPFAENGER || "4aCe (Empfänger bitte in .env setzen)";
    const bankIban =
      process.env.VORKASSE_IBAN || "DE-IBAN-IN-.env-SETZEN";
    const bankBic =
      process.env.VORKASSE_BIC || "BIC-IN-.env-SETZEN";
    const bankName =
      process.env.VORKASSE_BANKNAME || "Deine Bank";

    // Mail an Kunden (nur wenn E-Mail vorhanden)
    if (hasEmail && customer?.email) {
      try {
        await sendOrderMail({
          to: customer.email,
          subject: `Deine Vorkasse-Bestellung ${orderNumber} bei 4aCe`,
          text:
            `Hallo ${customer.firstName || ""} ${customer.lastName || ""}\n\n` +
            `vielen Dank für deine Bestellung im 4aCe Shop.\n\n` +
            `Bestellnummer: ${orderNumber}\n` +
            `Zahlungsart: Vorkasse (Banküberweisung)\n` +
            `Betrag: ${amountText}\n` +
            (couponCode
              ? `Eingesetzter Gutschein: ${couponCode.toUpperCase()}\n`
              : "") +
            `\nBestellte Artikel:\n${itemsText}\n\n` +
            `Bitte überweise den Gesamtbetrag innerhalb von 7 Tagen auf folgendes Konto:\n\n` +
            `Empfänger: ${bankEmpfaenger}\n` +
            `Bank: ${bankName}\n` +
            `IBAN: ${bankIban}\n` +
            `BIC: ${bankBic}\n\n` +
            `Verwendungszweck: ${orderNumber}\n\n` +
            `Sobald deine Zahlung bei uns eingegangen ist, beginnen wir mit der Bearbeitung deiner Bestellung.\n\n` +
            `Viele Grüße\n` +
            `dein 4aCe Team`,
        });
      } catch (mailErr) {
        console.error("Mail-Fehler (Kunde, Vorkasse):", mailErr);
      }
    }

    // Mail an dich / internes Postfach
    try {
      if (adminMail) {
        await sendOrderMail({
          to: adminMail,
          subject: `Neue Vorkasse-Bestellung ${orderNumber}`,
          text:
            `Neue Vorkasse-Bestellung im 4aCe Shop.\n\n` +
            `Bestellnummer: ${orderNumber}\n` +
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
      console.error("Mail-Fehler (intern, Vorkasse):", mailErr);
    }

    // 👉 Egal was oben an DB/Mail schiefgeht: Bestellung gilt als angelegt
    return NextResponse.json({
      success: true,
      orderNumber,
    });
  } catch (err) {
    console.error("Fehler in /api/checkout/vorkasse:", err);
    // Im absoluten Notfall trotzdem eine Ordernummer generieren
    const fallbackOrderNumber = `4ACE-VK-ERR-${Date.now()}`;
    return NextResponse.json(
      {
        success: true,
        orderNumber: fallbackOrderNumber,
        warning: "Interner Fehler, bitte Logs prüfen.",
      },
      { status: 200 }
    );
  }
}
