import { readReviews } from "@/lib/reviewsStore";

export type ReviewsSummary = {
  avg: number;
  count: number;
};

export async function getReviewsSummaryByProductIds(productIds: string[]) {
  const reviews = await readReviews();

  const map = new Map<string, { sum: number; count: number }>();

  for (const r of reviews) {
    if (!productIds.includes(r.productId)) continue;
    const cur = map.get(r.productId) ?? { sum: 0, count: 0 };
    cur.sum += Number(r.rating) || 0;
    cur.count += 1;
    map.set(r.productId, cur);
  }

  const summary = new Map<string, ReviewsSummary>();
  for (const id of productIds) {
    const v = map.get(id);
    if (!v) {
      summary.set(id, { avg: 0, count: 0 });
    } else {
      const avg = Math.round((v.sum / v.count) * 10) / 10;
      summary.set(id, { avg, count: v.count });
    }
  }

  return summary;
}
