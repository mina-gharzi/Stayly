// src/services/checkout.test.ts
// تست یکپارچه‌ی مستقیمِ «جریان کامل Checkout» روی orchestration سرویس —
// مستقل از UI. قانون ۱۲: submitBookingPayment کل مسیر
// «پرداخت → ذخیره Payment → ثبت Booking → اتصال paymentId» را یک‌جا اجرا می‌کنه؛
// این فایل همون مسیر را مستقیم (بدون UI) تست می‌کنه — شامل موجودی اتاق (rooms) هم.
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest'
import {
  submitBookingPayment,
  PaymentFailedError,
  BookingValidationError,
  type SubmitBookingPaymentInput,
} from './checkout'
import { getRoomByIdSync } from './rooms'
import type { PriceBreakdown, GuestInfo } from '@/types'

// معماری: سرویس‌ها به‌جای import مستقیم data، از طریق سرویس‌ها کار می‌کنن و localStorage
// رو با کلیدهای جداگانه (رزرو/پرداخت/موجودی) مدیریت می‌کنن. چون env ویژیت node هست و
// localStorage ندارد، یه استاب همگام می‌سازیم و برای هر تست تازه می‌کنیمش.

function flushAll() {
  // زمان‌های هر مرحله: پرداخت ۱۲۰۰ + ذخیره ۱۰۰ + رزرو ۳۰۰ + اتصال ۵۰ = ~۱۶۵۰ms
  // برای اینکه کل زنجیره‌ی await (setTimeout های تودرتوی سرویس‌ها) کامل بشه چندبار جلو می‌ریم.
  return Promise.all([
    vi.advanceTimersByTimeAsync(2000),
    vi.advanceTimersByTimeAsync(2000),
    vi.advanceTimersByTimeAsync(2000),
  ])
}

const guestInfo: GuestInfo = {
  firstName: 'علی',
  lastName: 'محمدی',
  email: 'ali@example.com',
  phone: '09121112233',
}

// بر اساس قانون واقعی Pricing (TAX_RATE=10%) برای baku-fairmont-deluxe (قیمت ۱۸۰، ۳ شب، ۱ اتاق):
// subtotal = 540 ، tax = 54 ، total = 594
const priceBreakdown: PriceBreakdown = {
  pricePerNight: 180,
  nights: 3,
  subtotal: 540,
  taxRate: 0.1,
  taxAmount: 54,
  discount: 0,
  total: 594,
}

function validInput(overrides: Partial<SubmitBookingPaymentInput> = {}): SubmitBookingPaymentInput {
  return {
    userId: 'user-1',
    hotelId: 'baku-fairmont',
    roomTypeId: 'baku-fairmont-deluxe',
    checkIn: '2026-10-10',
    checkOut: '2026-10-13',
    adults: 2,
    children: 0,
    rooms: 1,
    guestInfo,
    priceBreakdown,
    card: { cardNumber: '4242 4242 4242 4242', cardHolder: 'ALI MOHAMMADI', expiry: '12/28', cvv: '123' },
    ...overrides,
  }
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.stubGlobal('localStorage', (() => {
    const store = new Map<string, string>()
    return {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => { store.set(k, String(v)) },
      removeItem: (k: string) => { store.delete(k) },
      clear: () => { store.clear() },
      key: (i: number) => Array.from(store.keys())[i] ?? null,
      get length() { return store.size },
    } as Storage
  })())
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('submitBookingPayment — کارت 4242 (موفق)', () => {
  it('کل مسیر را کامل می‌کند و رزرو + پرداخت معتبر برمی‌گرداند', async () => {
    const p = submitBookingPayment(validInput())
    await flushAll()
    const { booking, payment } = await p

    // پرداخت موفق و به‌درستی ذخیره/ثبت شده — مبلغ ۵۹۴ (مالیات واقعی ۱۰٪)
    expect(payment.status).toBe('completed')
    expect(payment.amount).toBe(594)
    expect(payment.cardLast4).toBe('4242')

    // رزرو با وضعیت confirmed ساخته شده و به پرداخت وصل است
    expect(booking.status).toBe('confirmed')
    expect(booking.hotelId).toBe('baku-fairmont')
    expect(booking.roomTypeId).toBe('baku-fairmont-deluxe')
    expect(booking.paymentId).toBe(payment.id)

    // قیمت‌گذاری ذخیره‌شده در رزرو باید نسخه‌ی «قانون واقعی ۱۰٪» باشد
    expect(booking.priceBreakdown.taxRate).toBe(0.1)
    expect(booking.priceBreakdown.taxAmount).toBe(54)
    expect(booking.priceBreakdown.total).toBe(594)
  })

  it('موجودی اتاق را بعد از رزرو موفق کاهش می‌دهد (rooms/availability)', async () => {
    const before = getRoomByIdSync('baku-fairmont-deluxe')!.availableRooms

    const p = submitBookingPayment(validInput({ rooms: 2 }))
    await flushAll()
    await p

    const after = getRoomByIdSync('baku-fairmont-deluxe')!.availableRooms
    expect(after).toBe(before - 2)
  })

  it('به priceBreakdownِ دستکاری‌شده‌ی Client اعتماد نمی‌کند و مبلغ واقعی را محاسبه می‌کند (P1)', async () => {
    // مبلغ کل که Client فرستاده غیرواقعی/دستکاری‌شده است — Service باید صرف‌نظر کرده و خودش محاسبه کنه
    const p = submitBookingPayment(
      validInput({
        priceBreakdown: { ...priceBreakdown, pricePerNight: 1, subtotal: 1, taxAmount: 0.1, total: 1.1 },
      })
    )
    await flushAll()
    const { booking, payment } = await p

    // مبلغ پرداخت و قیمت رزرو باید از منبع معتبر (قیمت اتاق + TAX_RATE=10%) آمده باشد، نه از فرم
    expect(payment.amount).toBe(594)
    expect(booking.priceBreakdown.pricePerNight).toBe(180)
    expect(booking.priceBreakdown.total).toBe(594)
  })
})

describe('submitBookingPayment — کارت 0000 (ناموفق)', () => {
  it('خطای PaymentFailedError می‌دهد و هیچ رزروی ساخته نمی‌شود', async () => {
    const p = submitBookingPayment(validInput({ card: { cardNumber: '0000 1111 2222 3333', cardHolder: 'X', expiry: '12/28', cvv: '123' } }))
    const assertion = expect(p).rejects.toBeInstanceOf(PaymentFailedError)
    await flushAll()
    await assertion

    // پرداختِ ناموفق ذخیره شده ولی هیچ رزروی ثبت نشده
    const savedPayments = JSON.parse((localStorage.getItem('stayly-created-payments') ?? '[]'))
    expect(savedPayments[0]?.status).toBe('failed')
    expect(localStorage.getItem('stayly-created-bookings')).toBeNull()
  })
})

describe('submitBookingPayment — رد شدن اعتبارسنجی رزرو', () => {
  it('خطای BookingValidationError می‌دهد وقتی تاریخ خروج قبل از ورود است', async () => {
    const p = submitBookingPayment(validInput({ checkOut: '2026-10-01' }))
    const assertion = expect(p).rejects.toBeInstanceOf(BookingValidationError)
    await flushAll()
    await assertion
  })

  it('خطای BookingValidationError می‌دهد وقتی ظرفیت مهمان بیشتر از حد مجاز اتاق است', async () => {
    // baku-fairmont-deluxe: maxGuests=2، تعداد مهمان ۵ از ظرفیت ۲×۱ بیشتر است
    const p = submitBookingPayment(validInput({ adults: 5, children: 0 }))
    const assertion = expect(p).rejects.toBeInstanceOf(BookingValidationError)
    await flushAll()
    await assertion
  })
})
