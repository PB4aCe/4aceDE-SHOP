// app/api/mollie/create-payment/route.ts
import { NextResponse } from "next/server";
import { mollieClient } from "@/lib/mollie";

export const runtime = "nodejs";

function generateOrderNumber() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `4ACE-${yyyy}${mm}${dd}-${rand}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customer, items, total, couponCode } = body ?? {};

    const numericTotal = Number(total);

    if (
      !customer?.email ||
      !Array.isArray(items) ||
      !Number.isFinite(numericTotal) ||
      numericTotal <= 0
    ) {
      return NextResponse.json(
        { success: false, error: "Missing or invalid checkout data" },
        { status: 400 }
      );
    }

    const orderNumber = generateOrderNumber();

    const siteUrl =
      process.env.SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

    // ✅ Redirect NUR mit orderNumber
    const redirectUrl = `${siteUrl}/mollie/return?order=${encodeURIComponent(
      orderNumber
    )}`;

    const payment = await mollieClient.payments.create({
      amount: {
        currency: "EUR",
        value: numericTotal.toFixed(2),
      },
      description: `4aCe Bestellung ${orderNumber}`,
      redirectUrl,

      metadata: {
        orderNumber,
        couponCode: couponCode ?? null,
        customer,
        items,
        totals: {
          totalAmount: numericTotal,
          currency: "EUR",
        },
      },
    });

    const checkoutUrl = payment.getCheckoutUrl();
    if (!checkoutUrl) {
      return NextResponse.json(
        { success: false, error: "No checkout URL from Mollie" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      checkoutUrl,
      orderNumber,
      paymentId: payment.id,
    });
  } catch (err) {
    console.error("Mollie create-payment error:", err);
    return NextResponse.json(
      { success: false, error: "Mollie create-payment failed" },
      { status: 500 }
    );
  }
}
