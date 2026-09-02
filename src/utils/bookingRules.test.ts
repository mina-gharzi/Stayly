// src/utils/bookingRules.test.ts
// قوانین رزرو: ظرفیت مهمان، تعداد اتاق، و اعتبارسنجی تاریخ.
import { describe, it, expect } from 'vitest'
import {
  isValidDateRange,
  getGuestCapacity,
  exceedsGuestCapacity,
  exceedsRoomAvailability,
} from './bookingRules'

describe('isValidDateRange', () => {
  it('بازه‌ی معتبر (خروج بعد از ورود) درست است', () => {
    expect(isValidDateRange('2026-09-01', '2026-09-04')).toBe(true)
  })

  it('خروج قبل یا مساوی ورود، نامعتبر است', () => {
    expect(isValidDateRange('2026-09-04', '2026-09-04')).toBe(false)
    expect(isValidDateRange('2026-09-04', '2026-09-01')).toBe(false)
  })

  it('تاریخ خالی یا ناقص نامعتبر است', () => {
    expect(isValidDateRange('', '2026-09-04')).toBe(false)
    expect(isValidDateRange('2026-09-01', '')).toBe(false)
    expect(isValidDateRange('', '')).toBe(false)
  })

  it('تاریخ نامعتبر (غیرواقعی یا فرمت اشتباه) نامعتبر است', () => {
    expect(isValidDateRange('not-a-date', '2026-09-04')).toBe(false)
  })
})

describe('getGuestCapacity — قانون ۴: maxGuests × rooms', () => {
  it('ظرفیت = حداکثر مهمان هر اتاق × تعداد اتاق', () => {
    expect(getGuestCapacity(2, 1)).toBe(2)
    expect(getGuestCapacity(2, 3)).toBe(6)
    expect(getGuestCapacity(4, 1)).toBe(4)
  })
})

describe('exceedsGuestCapacity — قوانین ۳ و ۴', () => {
  it('تعداد مهمان دقیقاً برابر ظرفیت، مجاز است', () => {
    expect(exceedsGuestCapacity(2, 0, 2, 1)).toBe(false) // 2 بزرگسال، 1 اتاق ۲نفره
  })

  it('تعداد مهمان کمتر از ظرفیت، مجاز است', () => {
    expect(exceedsGuestCapacity(2, 1, 2, 2)).toBe(false) // 3 مهمان، 2 اتاق ۲نفره = ظرفیت ۴
  })

  it('تعداد مهمان از ظرفیت بیشتر شود، غیرمجاز است', () => {
    expect(exceedsGuestCapacity(3, 0, 2, 1)).toBe(true) // 3 مهمان در اتاق ۲نفره
    expect(exceedsGuestCapacity(2, 2, 2, 1)).toBe(true) // 4 مهمان در اتاق ۲نفره
  })

  it('ظرفیت بر اساس تعداد اتاق زیاد می‌شود', () => {
    // 4 مهمان در 2 اتاق ۲نفره → مجاز
    expect(exceedsGuestCapacity(3, 1, 2, 2)).toBe(false)
    // 5 مهمان در 2 اتاق ۲نفره → غیرمجاز (ظرفیت ۴)
    expect(exceedsGuestCapacity(4, 1, 2, 2)).toBe(true)
  })
})

describe('exceedsRoomAvailability — قانون ۱', () => {
  it('تعداد اتاق درخواستی ≤ موجودی، مجاز است', () => {
    expect(exceedsRoomAvailability(1, 5)).toBe(false)
    expect(exceedsRoomAvailability(5, 5)).toBe(false)
  })

  it('تعداد اتاق درخواستی > موجودی، غیرمجاز است', () => {
    expect(exceedsRoomAvailability(6, 5)).toBe(true)
    expect(exceedsRoomAvailability(2, 0)).toBe(true)
  })
})
