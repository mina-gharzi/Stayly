// src/components/review/RatingDistribution.tsx
import type { Review } from '@/types'

const buckets = [
  { label: 'عالی', min: 9, max: 10 },
  { label: 'خیلی خوب', min: 7, max: 8.9 },
  { label: 'خوب', min: 5, max: 6.9 },
  { label: 'متوسط', min: 3, max: 4.9 },
  { label: 'ضعیف', min: 0, max: 2.9 },
]

export function RatingDistribution({ reviews }: { reviews: Review[] }) {
  const total = reviews.length || 1

  return (
    <div className="flex flex-col gap-2">
      {buckets.map((bucket) => {
        const count = reviews.filter((r) => r.rating >= bucket.min && r.rating <= bucket.max).length
        const percent = Math.round((count / total) * 100)
        return (
          <div key={bucket.label} className="flex items-center gap-3 text-sm">
            <span className="w-16 shrink-0 text-neutral-700">{bucket.label}</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100">
              <div className="h-full rounded-full bg-primary-700" style={{ width: `${percent}%` }} />
            </div>
            <span className="w-8 shrink-0 text-end tabular-nums text-neutral-600">{percent}%</span>
          </div>
        )
      })}
    </div>
  )
}