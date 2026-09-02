// src/components/review/ReviewsSection.tsx
import { Star, MessageSquare } from 'lucide-react'
import type { Review } from '@/types'
import { RatingDistribution } from './RatingDistribution'
import { ReviewCard } from './ReviewCard'
import { EmptyState } from '@/components/ui/EmptyState'

export function ReviewsSection({ reviews, guestRating }: { reviews: Review[]; guestRating: number }) {
  return (
    <div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 rounded-md bg-primary-700 px-3 py-2 text-white">
          <Star className="h-4 w-4 fill-white" aria-hidden />
          <span className="tabular-nums text-lg font-bold">{guestRating.toFixed(1)}</span>
        </div>
        <div>
          <p className="font-semibold text-neutral-900">امتیاز مهمانان</p>
          <p className="text-sm text-neutral-600">{reviews.length} نظر</p>
        </div>
      </div>

      <div className="mt-4 max-w-md">
        <RatingDistribution reviews={reviews} />
      </div>

      <div className="mt-6">
        {reviews.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="هنوز نظری ثبت نشده است"
            description="اولین نفری باشید که تجربهٔ خود را با مهمانان بعدی به اشتراک می‌گذارد."
            className="py-10"
          />
        ) : (
          reviews.map((review) => <ReviewCard key={review.id} review={review} />)
        )}
      </div>
    </div>
  )
}