// src/components/review/ReviewCard.tsx
import type { Review } from '@/types'

export function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="border-b border-neutral-100 py-4 last:border-0">
      <div className="flex items-center gap-3">
        <img src={review.userAvatar} alt={review.userName} className="h-9 w-9 rounded-full object-cover" />
        <div>
          <p className="text-sm font-medium text-neutral-900">{review.userName}</p>
          <p className="ltr-content text-xs text-neutral-500">
            {new Date(review.date).toLocaleDateString('fa-IR')}
          </p>
        </div>
        <span className="ms-auto rounded-sm bg-primary-50 px-2 py-0.5 text-xs font-semibold text-primary-700">
          {review.rating.toFixed(1)}
        </span>
      </div>
      <p className="mt-2 text-sm text-neutral-700">{review.comment}</p>
    </div>
  )
}