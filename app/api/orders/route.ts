// app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const runtime = "nodejs";

type OrderPayload = {
  orderNumber: string;
  paymentMethod: "paypal" | "vorkasse";
  status?: string;
  paypalOrderId?: string | null;
  paypalCaptureId?: string | null;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    street: string;
    zip: string;
    city: string;
    country: string;
  };
  totals: {
    totalAmount: number;
    currency?: string;
  };
  billing?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    street?: string;
    zip?: string;
    city?: string;
    country?: string;
  };
  payer?: {
    email?: string;
    name?: string;
  };
  shipping?: {
    name?: string;
    address?: string;
  };
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as OrderPayload;

    const {
      orderNumber,
      paymentMethod,
      status,
      paypalOrderId,
      paypalCaptureId,
      customer,
      billing,
      totals,
      payer,
      shipping,
    } = body;

    // Minimal-Check
    if (
      !orderNumber ||
      !paymentMethod ||
      !customer?.firstName ||
      !customer?.lastName ||
      !customer?.email ||
      !customer?.street ||
      !customer?.zip ||
      !customer?.city ||
      !customer?.country ||
      typeof totals?.totalAmount !== "number"
    ) {
      return NextResponse.json(
        { error: "Missing required order fields" },
        { status: 400 }
      );
    }

    const finalStatus =
      status ?? (paymentMethod === "vorkasse" ? "pending" : "paid");

    const currency = totals.currency ?? "EUR";

    await sql`
      INSERT INTO orders (
        order_number,
        payment_method,
        status,
        paypal_order_id,
        paypal_capture_id,
        customer_first_name,
        customer_last_name,
        customer_email,
        customer_street,
        customer_zip,
        customer_city,
        customer_country,
        total_amount,
        currency,
        billing_first_name,
        billing_last_name,
        billing_email,
        billing_street,
        billing_zip,
        billing_city,
        billing_country,
        payer_email,
        payer_name,
        shipping_name,
        shipping_address
      ) VALUES (
        ${orderNumber},
        ${paymentMethod},
        ${finalStatus},
        ${paypalOrderId ?? null},
        ${paypalCaptureId ?? null},
        ${customer.firstName},
        ${customer.lastName},
        ${customer.email},
        ${customer.street},
        ${customer.zip},
        ${customer.city},
        ${customer.country},
        ${totals.totalAmount},
        ${currency},
        ${billing?.firstName ?? null},
        ${billing?.lastName ?? null},
        ${billing?.email ?? null},
        ${billing?.street ?? null},
        ${billing?.zip ?? null},
        ${billing?.city ?? null},
        ${billing?.country ?? null},
        ${payer?.email ?? null},
        ${payer?.name ?? null},
        ${shipping?.name ?? null},
        ${shipping?.address ?? null}
      )
      ON CONFLICT (order_number) DO NOTHING
    `;

    return NextResponse.json({ success: true, orderNumber }, { status: 201 });
  } catch (err: any) {
    console.error("Order insert error:", err);
    return NextResponse.json(
      { error: "Database error", details: err?.message },
      { status: 500 }
    );
  }
}
