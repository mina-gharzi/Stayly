// src/components/review/ReviewsSection.tsx
import { Star } from 'lucide-react'
import type { Review } from '@/types'
import { RatingDistribution } from './RatingDistribution'
import { ReviewCard } from './ReviewCard'

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
          <p className="text-sm text-neutral-600">هنوز نظری ثبت نشده است.</p>
        ) : (
          reviews.map((review) => <ReviewCard key={review.id} review={review} />)
        )}
      </div>
    </div>
  )
}