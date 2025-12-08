import { NextResponse } from "next/server";
import { readReviews, readReviewsByProduct } from "@/lib/reviewsStore";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    const reviews = productId
      ? await readReviewsByProduct(productId)
      : await readReviews();

    // ✅ Sortierung ist in SQL schon DESC
    return NextResponse.json({ success: true, reviews });
  } catch (err) {
    console.error("reviews/list error:", err);
    return NextResponse.json({ success: false, reviews: [] }, { status: 500 });
  }
}
