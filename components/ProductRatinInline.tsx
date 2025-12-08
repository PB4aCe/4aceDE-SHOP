import { StarRating } from "@/components/StarRating";

export function ProductRatingInline({
  avg,
  count,
}: {
  avg: number;
  count: number;
}) {
  if (!count) {
    return (
      <div className="flex items-center gap-1 text-[10px] text-slate-500">
        <StarRating value={0} readonly size={12} />
        <span>noch keine Bewertungen</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <StarRating value={avg} readonly size={12} />
      <span className="text-[10px] text-slate-400">({count})</span>
    </div>
  );
}
