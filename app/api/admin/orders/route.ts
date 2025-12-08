// app/api/admin/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const limitParam = url.searchParams.get("limit");
  const limit = Math.min(Number(limitParam) || 50, 200);

  const adminKey = req.headers.get("x-admin-key");
  const expectedKey = process.env.ADMIN_KEY;

  if (!expectedKey || adminKey !== expectedKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rows = await sql`
      SELECT
        id,
        order_number,
        payment_method,
        status,
        total_amount,
        currency,
        billing_first_name,
        billing_last_name,
        billing_email,
        created_at
      FROM orders
      ORDER BY id DESC
      LIMIT ${limit}
    `;

    return NextResponse.json({ orders: rows });
  } catch (err) {
    console.error("Admin orders error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
