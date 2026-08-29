// src/types/hotel.ts
import type { PropertyType } from './common'

export interface HotelImage {
  id: string
  url: string
  alt: string
}

export interface HotelPolicy {
  checkInTime: string   // '14:00'
  checkOutTime: string  // '12:00'
  cancellation: string  // متن policy
}

export interface Hotel {
  id: string
  name: string
  propertyType: PropertyType
  cityId: string
  address: string
  description: string
  starRating: number       // 1-5
  guestRating: number      // 0-10
  reviewCount: number
  pricePerNightFrom: number // برای Card و Sort سریع
  images: HotelImage[]
  amenityIds: string[]
  policy: HotelPolicy
  latitude: number
  longitude: number
}