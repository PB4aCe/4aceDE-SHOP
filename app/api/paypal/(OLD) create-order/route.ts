import { NextRequest, NextResponse } from "next/server";
import { getPayPalAccessToken } from "@/lib/paypal";
import { sendOrderMail } from "@/lib/mail";

interface CheckoutItem {
  id: string;
  name: string;
  price: number | string;
  quantity: number | string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    const rawItems = (body?.items || []) as CheckoutItem[];

    // Debug: Rohdaten loggen
    console.log("create-order raw items:", rawItems);

    // Preise & Mengen robust parsen
    const items = rawItems.map((item) => {
      const priceNum = parseFloat(
        String(item.price).replace(",", ".").trim()
      );
      const qtyNum = parseInt(String(item.quantity), 10);

      return {
        ...item,
        price: isNaN(priceNum) ? 0 : priceNum,
        quantity: isNaN(qtyNum) ? 0 : qtyNum,
      };
    });

    // Betrag serverseitig berechnen
    const calculatedTotal = items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    console.log("create-order calculated total:", calculatedTotal);

    // Wenn irgendwas schief ist → NICHT zu PayPal gehen
    if (!items.length || calculatedTotal <= 0) {
      console.error("Ungültiger Warenkorb für PayPal:", {
        items,
        calculatedTotal,
      });

      return NextResponse.json(
        {
          error:
            "Ungültiger Warenkorb. Betrag muss größer als 0 sein und es müssen Artikel vorhanden sein.",
          debug: { items, calculatedTotal },
        },
        { status: 400 }
      );
    }

    const accessToken = await getPayPalAccessToken();

    const res = await fetch(`${process.env.PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "EUR",
              value: calculatedTotal.toFixed(2),
            },
          },
        ],
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("PayPal create-order error:", data);

      const adminMail = process.env.SHOP_ADMIN_EMAIL || process.env.SMTP_USER;
      if (adminMail) {
        await sendOrderMail({
          to: adminMail,
          subject: "CRITICAL ERROR / Zahlungsfehler",
          text:
            `PayPal-Order konnte nicht erstellt werden.\n\n` +
            `HTTP-Status: ${res.status}\n\n` +
            `Payload:\n${JSON.stringify(data, null, 2)}\n`,
        });
      }

      return NextResponse.json(
        { error: "Failed to create PayPal order", paypalPayload: data },
        { status: 400 }
      );
    }

    return NextResponse.json({ orderID: data.id });
  } catch (err: any) {
    console.error("Fehler in create-order:", err);

    const adminMail = process.env.SHOP_ADMIN_EMAIL || process.env.SMTP_USER;
    if (adminMail) {
      await sendOrderMail({
        to: adminMail,
        subject: "CRITICAL ERROR / Zahlungsfehler",
        text:
          `Unhandled Error in /api/paypal/create-order\n\n` +
          `Message: ${err?.message || String(err)}\n\n` +
          `Stack:\n${err?.stack || "-"}\n`,
      });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
