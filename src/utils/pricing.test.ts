// src/utils/pricing.test.ts
// این تست‌ها با Vitest نوشته شدن — اگه پروژه Vitest نصب نداره، با
// `npm i -D vitest` اضافه‌ش کنید و `vitest` رو به scripts پروژه اضافه کنید.
import { describe, it, expect } from 'vitest'
import {
  calculateNights,
  calculateSubtotal,
  calculateTaxes,
  calculateDiscount,
  calculateTotal,
  TAX_RATE,
} from './pricing'

describe('calculateNights', () => {
  it('تعداد شب بین دو تاریخ رو درست حساب می‌کنه', () => {
    expect(calculateNights('2026-09-01', '2026-09-04')).toBe(3)
  })

  it('برای تاریخ‌های خالی صفر برمی‌گردونه', () => {
    expect(calculateNights('', '2026-09-04')).toBe(0)
    expect(calculateNights('2026-09-01', '')).toBe(0)
  })

  it('وقتی checkOut قبل یا برابر checkIn باشه، منفی نمی‌شه (صفر)', () => {
    expect(calculateNights('2026-09-04', '2026-09-04')).toBe(0)
    expect(calculateNights('2026-09-04', '2026-09-01')).toBe(0)
  })
})

describe('calculateSubtotal — قانون ۹: price × nights × rooms', () => {
  it('برای یک اتاق و چند شب، ساده ضرب می‌کنه', () => {
    expect(calculateSubtotal(100, 3)).toBe(300) // rooms پیش‌فرض ۱
  })

  it('برای چند اتاق، باید در تعداد اتاق هم ضرب بشه', () => {
    expect(calculateSubtotal(100, 3, 2)).toBe(600)
  })

  it('برای ۱ شب و ۳ اتاق', () => {
    expect(calculateSubtotal(150, 1, 3)).toBe(450)
  })

  it('برای صفر شب، جمع صفر می‌شه (صرف‌نظر از تعداد اتاق)', () => {
    expect(calculateSubtotal(200, 0, 4)).toBe(0)
  })

  it('یک سناریوی واقعی چند‌اتاقه رو درست محاسبه می‌کنه', () => {
    // ۲۱۰,۰۰۰ تومان هر شب × ۴ شب × ۳ اتاق
    const subtotal = calculateSubtotal(210_000, 4, 3)
    expect(subtotal).toBe(2_520_000)
  })
})

describe('calculateTaxes', () => {
  it('مالیات رو با نرخ پیش‌فرض حساب می‌کنه', () => {
    expect(calculateTaxes(1000)).toBe(1000 * TAX_RATE)
  })

  it('با نرخ سفارشی هم درست کار می‌کنه', () => {
    expect(calculateTaxes(1000, 0.2)).toBe(200)
  })
})

describe('calculateDiscount', () => {
  it('با کد تخفیف معتبر ۱۰٪ تخفیف می‌ده', () => {
    expect(calculateDiscount(1000, 'STAYLY10')).toBe(100)
    expect(calculateDiscount(1000, 'stayly10')).toBe(100) // بدون حساسیت به حروف بزرگ/کوچک
  })

  it('بدون کد یا با کد نامعتبر، تخفیف صفره', () => {
    expect(calculateDiscount(1000)).toBe(0)
    expect(calculateDiscount(1000, 'INVALID')).toBe(0)
  })
})

describe('calculateTotal', () => {
  it('جمع نهایی = subtotal + tax - discount', () => {
    expect(calculateTotal(1000, 100, 50)).toBe(1050)
  })

  it('سناریوی کامل: چند اتاق + چند شب + مالیات + تخفیف', () => {
    const subtotal = calculateSubtotal(180, 5, 2) // ۱۸۰ × ۵ شب × ۲ اتاق = ۱۸۰۰
    const tax = calculateTaxes(subtotal) // ۱۸۰
    const discount = calculateDiscount(subtotal, 'STAYLY10') // ۱۸۰
    const total = calculateTotal(subtotal, tax, discount)

    expect(subtotal).toBe(1800)
    expect(tax).toBe(180)
    expect(discount).toBe(180)
    expect(total).toBe(1800)
  })
})
