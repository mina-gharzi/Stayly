// src/services/hotels.test.ts
import { describe, it, expect } from 'vitest'
import { getHotels } from './hotels'
import { hotels as allHotels } from '@/data/hotels'
import type { PropertyType } from '@/types'

const allCityIds = [...new Set(allHotels.map((h) => h.cityId))]
const priceOf = (id: string) => allHotels.find((h) => h.id === id)!.pricePerNightFrom

describe('getHotels — فیلتر بین دسته‌ها (AND)', () => {
  it('بدون فیلتر، همه‌ی هتل‌ها را برمی‌گرداند', async () => {
    const res = await getHotels({})
    expect(res.total).toBe(allHotels.length)
    res.data.forEach((h) => expect(allHotels.some((a) => a.id === h.id)).toBe(true))
  })

  it('فیلتر مقصد، هتل‌های فقط همان شهر را برمی‌گرداند', async () => {
    const byCity = allHotels.filter((h) => h.cityId === 'baku').length
    const res = await getHotels({ destination: ['baku'] })
    expect(res.total).toBe(byCity)
    res.data.forEach((h) => expect(allCityIds.includes(h.cityId)).toBe(true))
    for (const h of res.data) expect(h.cityId).toBe('baku')
  })

  it('فیلتر حداقل قیمت (priceMin) هتل‌های ارزان‌تر را حذف می‌کند', async () => {
    const min = 150
    const expectedCount = allHotels.filter((h) => h.pricePerNightFrom >= min).length
    const res = await getHotels({ priceMin: min })
    expect(res.total).toBe(expectedCount)
    for (const h of res.data) expect(h.pricePerNightFrom).toBeGreaterThanOrEqual(min)
  })

  it('فیلتر حداکثر قیمت (priceMax) هتل‌های گران‌تر را حذف می‌کند', async () => {
    const max = 150
    const res = await getHotels({ priceMax: max })
    const expectedCount = allHotels.filter((h) => h.pricePerNightFrom <= max).length
    expect(res.total).toBe(expectedCount)
  })

  it('فیلتر حداقل امتیاز مهمان (minGuestRating)', async () => {
    const g = 9.0
    const expectedCount = allHotels.filter((h) => h.guestRating >= g).length
    const res = await getHotels({ minGuestRating: g })
    expect(res.total).toBe(expectedCount)
    for (const h of res.data) expect(h.guestRating).toBeGreaterThanOrEqual(g)
  })
})

describe('getHotels — فیلتر داخل یک دسته (OR)', () => {
  it('starRatings چندگانه، هر هتل با حداقل یکی از ستاره‌ها را می‌آورد', async () => {
    const ratings = [5, 3]
    const expectedCount = allHotels.filter((h) => ratings.includes(h.starRating)).length
    const res = await getHotels({ starRatings: ratings, pageSize: 100 })
    expect(res.total).toBe(expectedCount)
    for (const h of res.data) expect(ratings).toContain(h.starRating)
  })

  it('propertyTypes چندگانه، هتل‌های هرکدام از انواع را می‌آورد', async () => {
    const types: PropertyType[] = ['hotel', 'resort']
    const expectedCount = allHotels.filter((h) => types.includes(h.propertyType)).length
    const res = await getHotels({ propertyTypes: [...types], pageSize: 100 })
    expect(res.total).toBe(expectedCount)
    for (const h of res.data) expect(types).toContain(h.propertyType)
  })

  it('amenityIds چندگانه، هتل دارای حداقل یکی از امکانات را می‌آورد', async () => {
    const amenities = ['pool', 'spa']
    const expectedCount = allHotels.filter((h) => amenities.some((a) => h.amenityIds.includes(a))).length
    const res = await getHotels({ amenityIds: amenities, pageSize: 100 })
    expect(res.total).toBe(expectedCount)
  })
})

describe('getHotels — ترکیب فیلترها (AND بین دسته‌ها)', () => {
  it('ترکیب مقصد + حداقل قیمت، زیرمجموعه‌ی هر دو فیلتر است', async () => {
    const res = await getHotels({ destination: ['baku'], priceMin: 100 })
    for (const h of res.data) {
      expect(h.cityId).toBe('baku')
      expect(h.pricePerNightFrom).toBeGreaterThanOrEqual(100)
    }
  })

  it('ترکیب مقصد + نوع اقامتگاه دقیق است', async () => {
    const res = await getHotels({ destination: ['istanbul'], propertyTypes: ['resort'], pageSize: 100 })
    for (const h of res.data) {
      expect(h.cityId).toBe('istanbul')
      expect(h.propertyType).toBe('resort')
    }
  })

  it('ترکیب با فیلتر بیهوده، نتیجه‌ی خالی می‌دهد', async () => {
    const res = await getHotels({ destination: ['paris-that-does-not-exist'] })
    expect(res.total).toBe(0)
  })
})

describe('getHotels — مرتب‌سازی', () => {
  it('price-asc از ارزان به گران', async () => {
    const res = await getHotels({ sort: 'price-asc', pageSize: 100 })
    for (let i = 1; i < res.data.length; i++) {
      expect(res.data[i].pricePerNightFrom).toBeGreaterThanOrEqual(res.data[i - 1].pricePerNightFrom)
    }
  })

  it('price-desc از گران به ارزان', async () => {
    const res = await getHotels({ sort: 'price-desc', pageSize: 100 })
    for (let i = 1; i < res.data.length; i++) {
      expect(res.data[i].pricePerNightFrom).toBeLessThanOrEqual(res.data[i - 1].pricePerNightFrom)
    }
  })

  it('rating-desc بر اساس امتیاز مهمان', async () => {
    const res = await getHotels({ sort: 'rating-desc', pageSize: 100 })
    for (let i = 1; i < res.data.length; i++) {
      expect(res.data[i].guestRating).toBeLessThanOrEqual(res.data[i - 1].guestRating)
    }
  })

  it('پیش‌فرض (recommended) بر اساس امتیاز بالا به پایین', async () => {
    const res = await getHotels({ pageSize: 100 })
    for (let i = 1; i < res.data.length; i++) {
      expect(res.data[i].guestRating).toBeLessThanOrEqual(res.data[i - 1].guestRating)
    }
  })
})

describe('getHotels — صفحه‌بندی', () => {
  it('صفحه‌بندی صحیح: totalPages = ceil(total / pageSize)', async () => {
    const res = await getHotels({ page: 1, pageSize: 6 })
    expect(res.pageSize).toBe(6)
    expect(res.totalPages).toBe(Math.max(1, Math.ceil(res.total / 6)))
    expect(res.data.length).toBeLessThanOrEqual(6)
  })

  it('صفحه‌ی بعدی داده‌های متفاوت با صفحه‌ی اول دارد', async () => {
    const p1 = await getHotels({ page: 1, pageSize: 3, sort: 'price-asc' })
    const p2 = await getHotels({ page: 2, pageSize: 3, sort: 'price-asc' })
    const ids1 = new Set(p1.data.map((h) => h.id))
    for (const h of p2.data) expect(ids1.has(h.id)).toBe(false)
  })

  it('صفحه‌ای فراتر از کل، داده‌ی خالی دارد اما total و totalPages درست می‌ماند', async () => {
    const res = await getHotels({ page: 999, pageSize: 6 })
    expect(res.data.length).toBe(0)
    expect(res.total).toBe(allHotels.length)
  })

  it('بررسی وجود حداقل یک تست قیمت مرجع صحیح', () => {
    expect(priceOf('baku-fairmont')).toBe(180)
  })
})
