import { sql } from "@/lib/db";

export type Review = {
  id: string;
  productId: string;
  rating: number; // 1-5
  title?: string;
  text?: string;
  name?: string;
  email?: string; // für "nur 1x"
  createdAt: string;
};

// -----------------------------
// Helpers
// -----------------------------

export function makeId() {
  // stabiler als Math.random
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID().replace(/-/g, "");
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function normalizeReviewRow(r: any): Review {
  return {
    id: r.id,
    productId: r.product_id,
    rating: Number(r.rating),
    title: r.title ?? undefined,
    text: r.text ?? undefined,
    name: r.name ?? undefined,
    email: r.email ?? undefined,
    createdAt: r.created_at,
  };
}

// -----------------------------
// READ (kompatibel zu alt)
// -----------------------------

// ✅ wie vorher: holt "alle" Reviews
// Für Listen/Übersicht okay, aber später ggf. SQL-Aggregat nutzen.
export async function readReviews(): Promise<Review[]> {
  const rows = await sql`
    SELECT id, product_id, rating, title, text, name, email, created_at
    FROM reviews
    ORDER BY created_at DESC
    LIMIT 2000
  `;

  return rows.map(normalizeReviewRow);
}

// ✅ sinnvoll für Detailseiten
export async function readReviewsByProduct(productId: string): Promise<Review[]> {
  const rows = await sql`
    SELECT id, product_id, rating, title, text, name, email, created_at
    FROM reviews
    WHERE product_id = ${productId}
    ORDER BY created_at DESC
    LIMIT 200
  `;

  return rows.map(normalizeReviewRow);
}

// ✅ "1x pro Produkt pro Email" Check für deine create-route
export async function hasReviewedByEmail(productId: string, email: string) {
  const e = email.toLowerCase();

  const rows = await sql`
    SELECT 1
    FROM reviews
    WHERE product_id = ${productId}
      AND lower(email) = ${e}
    LIMIT 1
  `;

  return rows.length > 0;
}

// -----------------------------
// WRITE (neu, sauber für API)
// -----------------------------

// ✅ empfohlen für /reviews/create
export async function addReview(input: {
  productId: string;
  rating: number;
  title?: string;
  text?: string;
  name?: string;
  email?: string;
  id?: string;
  createdAt?: string;
}): Promise<Review> {
  const review: Review = {
    id: input.id ?? makeId(),
    productId: String(input.productId),
    rating: Math.max(1, Math.min(5, Number(input.rating))),
    title: input.title?.toString().slice(0, 80),
    text: input.text?.toString().slice(0, 2000),
    name: input.name?.toString().slice(0, 80),
    email: input.email?.toString().slice(0, 120),
    createdAt: input.createdAt ?? new Date().toISOString(),
  };

  const rows = await sql`
    INSERT INTO reviews (id, product_id, rating, title, text, name, email, created_at)
    VALUES (
      ${review.id},
      ${review.productId},
      ${review.rating},
      ${review.title ?? null},
      ${review.text ?? null},
      ${review.name ?? null},
      ${review.email ?? null},
      ${review.createdAt}
    )
    RETURNING id, product_id, rating, title, text, name, email, created_at
  `;

  return normalizeReviewRow(rows[0]);
}

/**
 * ⚠️ Kompatibilitäts-Funktion zur alten JSON-API.
 * Ersetzt *komplett* den Review-Bestand.
 *
 * Auf Serverless/Neon ist das ok für Admin/Dev,
 * aber du wirst es im normalen Flow vermutlich NICHT brauchen.
 */
export async function writeReviews(reviews: Review[]) {
  // Achtung: kein "echter" Multi-Statement-Transaction-Guarantee nötig,
  // aber für Admin-Zwecke reicht das.
  await sql`TRUNCATE TABLE reviews`;

  for (const r of reviews) {
    const rating = Math.max(1, Math.min(5, Number(r.rating)));

    await sql`
      INSERT INTO reviews (id, product_id, rating, title, text, name, email, created_at)
      VALUES (
        ${r.id ?? makeId()},
        ${r.productId},
        ${rating},
        ${r.title ?? null},
        ${r.text ?? null},
        ${r.name ?? null},
        ${r.email ?? null},
        ${r.createdAt ?? new Date().toISOString()}
      )
    `;
  }
}

// -----------------------------
// OPTIONAL: schneller Summary-Helper
// (falls du später Listen optimieren willst)
// -----------------------------

export async function getReviewSummaryByProductIds(productIds: string[]) {
  if (!productIds.length) return new Map<string, { avg: number; count: number }>();

  const rows = await sql`
    SELECT product_id,
           AVG(rating)::float AS avg,
           COUNT(*)::int AS count
    FROM reviews
    WHERE product_id = ANY(${productIds}::text[])
    GROUP BY product_id
  `;

  const map = new Map<string, { avg: number; count: number }>();

  for (const id of productIds) {
    map.set(id, { avg: 0, count: 0 });
  }

  for (const r of rows as any[]) {
    map.set(r.product_id, {
      avg: Number(r.avg ?? 0),
      count: Number(r.count ?? 0),
    });
  }

  return map;
}
