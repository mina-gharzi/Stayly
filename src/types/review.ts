// src/types/review.ts
export interface Review {
  id: string
  hotelId: string
  userId: string
  userName: string
  userAvatar: string
  rating: number   // 1-10 یا 1-5، تصمیم بگیر
  date: string      // ISO date
  comment: string
}