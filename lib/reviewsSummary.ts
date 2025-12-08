import {
  getReviewSummaryByProductIds as getDbReviewSummaryByProductIds,
} from "@/lib/reviewsStore";

export type ReviewsSummary = {
  avg: number;
  count: number;
};

export async function getReviewsSummaryByProductIds(productIds: string[]) {
  const raw = await getDbReviewSummaryByProductIds(productIds);

  const summary = new Map<string, ReviewsSummary>();

  for (const id of productIds) {
    const v = raw.get(id) ?? { avg: 0, count: 0 };
    const avg = v.count > 0 ? Math.round(v.avg * 10) / 10 : 0;
    summary.set(id, { avg, count: v.count });
  }

  return summary;
}
