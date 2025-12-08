import { NextResponse } from "next/server";
import { mollieClient } from "@/lib/mollie";
import {
  sendCustomerConfirmationMail,
  sendInternalOrderNotification,
} from "@/lib/order-mails";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const paymentId = searchParams.get("payment");

    if (!paymentId) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    const payment = await mollieClient.payments.get(paymentId);

    if (payment.status !== "paid") {
      return NextResponse.json({
        success: true,
        status: payment.status,
        message: "Not paid (yet)",
      });
    }

    const meta: any = payment.metadata ?? {};
    const orderNumber = meta.orderNumber ?? "UNBEKANNT";
    const customer = meta.customer;
    const items = meta.items ?? [];
    const total =
      Number(meta?.totals?.totalAmount) ||
      Number(payment.amount?.value) ||
      0;

    if (!customer?.email) {
      // Ohne Customer-Mail nur intern
      await sendInternalOrderNotification({
        orderNumber,
        customer: { email: "-" },
        items,
        total,
        paymentMethod: "mollie",
        couponCode: meta.couponCode ?? null,
        molliePaymentId: payment.id,
      });

      return NextResponse.json({ success: true, status: "paid" });
    }

    await sendCustomerConfirmationMail({
      orderNumber,
      customer,
      items,
      total,
      paymentMethod: "mollie",
      couponCode: meta.couponCode ?? null,
      molliePaymentId: payment.id,
    });

    await sendInternalOrderNotification({
      orderNumber,
      customer,
      items,
      total,
      paymentMethod: "mollie",
      couponCode: meta.couponCode ?? null,
      molliePaymentId: payment.id,
    });

    return NextResponse.json({ success: true, status: "paid" });
  } catch (err) {
    console.error("Mollie finalize error:", err);
    return NextResponse.json(
      { success: false, error: "finalize failed" },
      { status: 500 }
    );
  }
}
