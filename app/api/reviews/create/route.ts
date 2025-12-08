import { NextResponse } from "next/server";
import {
  makeId,
  type Review,
  addReview,
  hasReviewedByEmail,
} from "@/lib/reviewsStore";
import { isValidEmail } from "@/lib/validators";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, rating, title, text, name, email } = body ?? {};

    if (!productId || !rating) {
      return NextResponse.json(
        { success: false, error: "Missing productId or rating" },
        { status: 400 }
      );
    }

    // ✅ Wenn Email angegeben wird, muss sie gültig sein
    if (email && !isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: "invalid_email" },
        { status: 400 }
      );
    }

    const safeRating = Math.max(1, Math.min(5, Number(rating)));

    // ✅ 1x pro Produkt pro Email (jetzt DB-basiert)
    if (email) {
      const exists = await hasReviewedByEmail(String(productId), String(email));
      if (exists) {
        return NextResponse.json(
          { success: false, error: "already_reviewed" },
          { status: 409 }
        );
      }
    }

    const review: Review = {
      id: makeId(),
      productId: String(productId),
      rating: safeRating,
      title: title?.toString().slice(0, 80),
      text: text?.toString().slice(0, 2000),
      name: name?.toString().slice(0, 80),
      email: email?.toString().slice(0, 120),
      createdAt: new Date().toISOString(),
    };

    const saved = await addReview(review);

    return NextResponse.json({ success: true, review: saved });
  } catch (err) {
    console.error("reviews/create error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
