import { NextResponse } from "next/server";
import { readReviews } from "@/lib/reviewsStore";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    const all = await readReviews();
    const filtered = productId ? all.filter(r => r.productId === productId) : all;

    // newest first
    filtered.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

    return NextResponse.json({ success: true, reviews: filtered });
  } catch (err) {
    console.error("reviews/list error:", err);
    return NextResponse.json({ success: false, reviews: [] }, { status: 500 });
  }
}
