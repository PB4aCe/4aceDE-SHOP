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

    if (!customer?.email || !Array.isArray(items) || !total) {
      return NextResponse.json(
        { success: false, error: "Missing checkout data" },
        { status: 400 }
      );
    }

    const orderNumber = generateOrderNumber();
    const siteUrl =
      process.env.SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

    const payment = await mollieClient.payments.create({
      amount: {
        currency: "EUR",
        value: Number(total).toFixed(2),
      },
      description: `4aCe Bestellung ${orderNumber}`,
      redirectUrl: `${siteUrl}/mollie/return?payment={paymentId}`,
      // webhook erstmal weglassen
      metadata: {
        orderNumber,
        couponCode: couponCode ?? null,
        customer,
        items,
        totals: {
          totalAmount: total,
          currency: "EUR",
        },
      },
    });

    return NextResponse.json({
      success: true,
      checkoutUrl: payment.getCheckoutUrl(),
      orderNumber,
      paymentId: payment.id,
    });
  } catch (err) {
    console.error("checkout/mollie error:", err);
    return NextResponse.json(
      { success: false, error: "Mollie checkout failed" },
      { status: 500 }
    );
  }
}
