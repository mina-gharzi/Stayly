// src/components/review/RatingDistribution.tsx
import type { Review } from "@/types";

const buckets = [
  { label: "عالی", min: 9, max: 10, color: "bg-emerald-500" },
  { label: "خیلی خوب", min: 7, max: 8.9, color: "bg-primary-600" },
  { label: "خوب", min: 5, max: 6.9, color: "bg-amber-500" },
  { label: "متوسط", min: 3, max: 4.9, color: "bg-orange-400" },
  { label: "ضعیف", min: 0, max: 2.9, color: "bg-red-400" },
];

export function RatingDistribution({ reviews }: { reviews: Review[] }) {
  const total = reviews.length || 1;

  return (
    <div className="flex flex-col gap-2.5">
      {buckets.map((bucket) => {
        const count = reviews.filter(
          (r) => r.rating >= bucket.min && r.rating <= bucket.max,
        ).length;
        const percent = Math.round((count / total) * 100);
        return (
          <div key={bucket.label} className="flex items-center gap-3">
            <span className="w-20 shrink-0 text-sm text-neutral-600">
              {bucket.label}
            </span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-neutral-100">
              <div
                className={`h-full rounded-full ${bucket.color} transition-all duration-500`}
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className="w-10 shrink-0 text-end text-sm font-medium tabular-nums text-neutral-800">
              {percent}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
