// src/services/reviews.ts
import { reviews } from '@/data/reviews'
import type { Review } from '@/types'

export function getReviewsByHotel(hotelId: string): Promise<Review[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(reviews.filter((r) => r.hotelId === hotelId)), 300)
  })
}