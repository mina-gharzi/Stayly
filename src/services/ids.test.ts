// src/services/ids.test.ts
// شناسه‌ها نباید برخورد کنند و داده‌ی خراب localStorage نباید پرداخت را از کار بیندازد.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { savePayment } from './payments'
import { createBooking } from './bookings'

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
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

function isoDaysFromToday(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

const payment = { bookingId: '', status: 'completed' as const, cardLast4: '4242', amount: 594, processedAt: '2026-01-01T00:00:00.000Z' }

describe('savePayment', () => {
  it('survives corrupted payment history in localStorage', async () => {
    localStorage.setItem('stayly-created-payments', '{not json')
    const p = savePayment(payment)
    await vi.advanceTimersByTimeAsync(200)
    await expect(p).resolves.toMatchObject({ cardLast4: '4242' })
  })

  it('gives every payment a distinct id', async () => {
    const [a, b] = [savePayment(payment), savePayment(payment)]
    await vi.advanceTimersByTimeAsync(200)
    expect((await a).id).not.toBe((await b).id)
  })
})

describe('createBooking', () => {
  it('never reuses a booking id, even if the random generator repeats', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    const input = {
      userId: 'user-1', hotelId: 'baku-fairmont', roomTypeId: 'baku-fairmont-deluxe',
      checkIn: isoDaysFromToday(30), checkOut: isoDaysFromToday(33),
      adults: 2, children: 0, rooms: 1,
      guestInfo: { firstName: 'a', lastName: 'b', email: 'a@b.co', phone: '09121112233' },
      priceBreakdown: { pricePerNight: 180, nights: 3, subtotal: 540, taxRate: 0.1, taxAmount: 54, discount: 0, total: 594 },
      status: 'confirmed' as const,
      paymentId: 'pay-1',
    }
    const first = createBooking(input as never)
    await vi.advanceTimersByTimeAsync(400)
    const second = createBooking(input as never)
    await vi.advanceTimersByTimeAsync(400)
    expect((await first).id).not.toBe((await second).id)
  })
})
