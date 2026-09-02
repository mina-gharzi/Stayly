// src/services/hotels.ts
import { hotels } from '@/data/hotels'
import type { Hotel, PropertyType } from '@/types'

export interface HotelSearchFilters {
  destination?: string[]
  priceMin?: number
  priceMax?: number
  starRatings?: number[]
  minGuestRating?: number
  propertyTypes?: PropertyType[]
  amenityIds?: string[]
  sort?: 'recommended' | 'price-asc' | 'price-desc' | 'rating-desc'
  page?: number
  pageSize?: number
}

export interface HotelSearchResult {
  data: Hotel[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export function getHotels(filters: HotelSearchFilters): Promise<HotelSearchResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = [...hotels]

      // بین دسته‌ها: AND
      if (filters.destination?.length) {
        result = result.filter((h) => filters.destination!.includes(h.cityId))
      }
      if (filters.priceMin !== undefined) {
        result = result.filter((h) => h.pricePerNightFrom >= filters.priceMin!)
      }
      if (filters.priceMax !== undefined) {
        result = result.filter((h) => h.pricePerNightFrom <= filters.priceMax!)
      }
      if (filters.minGuestRating !== undefined) {
        result = result.filter((h) => h.guestRating >= filters.minGuestRating!)
      }
      // داخل هر دسته چندانتخابی: OR
      if (filters.starRatings?.length) {
        result = result.filter((h) => filters.starRatings!.includes(h.starRating))
      }
      if (filters.propertyTypes?.length) {
        result = result.filter((h) => filters.propertyTypes!.includes(h.propertyType))
      }
      if (filters.amenityIds?.length) {
        result = result.filter((h) => filters.amenityIds!.some((id) => h.amenityIds.includes(id)))
      }

      switch (filters.sort) {
        case 'price-asc':
          result.sort((a, b) => a.pricePerNightFrom - b.pricePerNightFrom)
          break
        case 'price-desc':
          result.sort((a, b) => b.pricePerNightFrom - a.pricePerNightFrom)
          break
        case 'rating-desc':
          result.sort((a, b) => b.guestRating - a.guestRating)
          break
        default:
          result.sort((a, b) => b.guestRating - a.guestRating || b.reviewCount - a.reviewCount)
      }

      const page = filters.page ?? 1
      const pageSize = filters.pageSize ?? 6
      const total = result.length
      const totalPages = Math.max(1, Math.ceil(total / pageSize))
      const start = (page - 1) * pageSize

      resolve({ data: result.slice(start, start + pageSize), total, page, pageSize, totalPages })
    }, 400) // شبیه‌سازی تاخیر شبکه؛ امضای Promise با نسخه واقعی Supabase یکی می‌مونه
  })
}
export function getHotelById(id: string): Promise<Hotel | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(hotels.find((h) => h.id === id)), 300)
  })
}

// حل‌کردن گروهی شناسه‌های هتل به آبجکت کامل — مثلاً برای صفحه علاقه‌مندی‌ها
export function getHotelsByIds(ids: string[]): Promise<Hotel[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(ids.map((id) => hotels.find((h) => h.id === id)).filter((h): h is Hotel => !!h))
    }, 200)
  })
}

// تعداد اقامتگاه‌ها به تفکیک نوع اقامتگاه — برای «جستجو بر اساس نوع اقامتگاه»
export function getHotelCountsByType(): Promise<Record<PropertyType, number>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const counts = {
        hotel: 0,
        resort: 0,
        apartment: 0,
        villa: 0,
        hostel: 0,
        boutique: 0,
      } as Record<PropertyType, number>
      for (const h of hotels) counts[h.propertyType] += 1
      resolve(counts)
    }, 200)
  })
}