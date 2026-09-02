// src/services/catalog.ts
// قانون ۱۰: داده‌های مرجعِ کاتالوگ (شهرها و امکانات) که فقط برای حل‌کردنِ نمایشی
// (نام شهر، آیکون امکانات، لیست‌های فیلتر) استفاده می‌شن، از طریق همین سرویس در دسترسن —
// نه ایمپورت مستقیم از data/.
// چون این داده‌ها استاتیک و بی‌زمان هستن (برخلاف کوئری‌های API که سرویس با setTimeout شبیه‌سازی
// می‌کنه)، به‌صورت همگام (Sync) برگردونده می‌شن — مثل getRoomByIdSync.
import { cities } from '@/data/cities'
import { amenities } from '@/data/amenities'
import { hotels } from '@/data/hotels'
import { reviews } from '@/data/reviews'
import type { City, Amenity } from '@/types'

export function getCities(): City[] {
  return cities
}

export function getCityById(id: string): City | undefined {
  return cities.find((c) => c.id === id)
}

export function getAmenities(): Amenity[] {
  return amenities
}

export function getAmenitiesByIds(ids: string[]): Amenity[] {
  return amenities.filter((a) => ids.includes(a.id))
}

// آمار کلی برای صفحه «درباره ما» — کوئری تجمیعی، پس مثل سایر کوئری‌های API غیرهمگامه
export function getCatalogStats(): Promise<{ hotels: number; cities: number; reviews: number }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ hotels: hotels.length, cities: cities.length, reviews: reviews.length })
    }, 200)
  })
}
