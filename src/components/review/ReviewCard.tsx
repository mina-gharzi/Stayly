// src/components/review/ReviewCard.tsx
import { Star } from "lucide-react";
import type { Review } from "@/types";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex flex-col gap-3 py-5">
      <div className="flex items-center gap-3">
        {/* آواتار */}
        <img
          src={review.userAvatar}
          alt={review.userName}
          className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
        />

        {/* نام و تاریخ */}
        <div className="flex-1">
          <p className="text-sm font-semibold text-neutral-900">
            {review.userName}
          </p>
          <p className="ltr-content text-xs text-neutral-400">
            {new Date(review.date).toLocaleDateString("fa-IR")}
          </p>
        </div>

        {/* امتیاز */}
        <div className="flex items-center gap-1.5 rounded-lg bg-neutral-50 px-2.5 py-1.5">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="text-sm font-bold tabular-nums text-neutral-800">
            {review.rating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* متن نظر */}
      <p className="text-sm leading-relaxed text-neutral-600">
        {review.comment}
      </p>

      {/* جداکننده */}
      <div className="h-px bg-neutral-100" />
    </div>
  );
}
