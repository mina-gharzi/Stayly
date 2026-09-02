// src/services/payments.test.ts
import { afterEach, describe, it, expect, vi } from 'vitest'
import { processPayment } from './payments'

// processPayment یک Promise مبتنی بر setTimeout است؛ برای سرعت از fake timers استفاده می‌کنیم.
function flush() {
  return vi.advanceTimersByTimeAsync(1500)
}

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('processPayment — کارت 4242 همیشه موفق است', () => {
  it('شروع با 4242 → status = completed', async () => {
    vi.useFakeTimers()
    const p = processPayment({ cardNumber: '4242 4242 4242 4242', cardHolder: 'X', expiry: '12/28', cvv: '123', amount: 100 })
    await flush()
    const res = await p
    expect(res.status).toBe('completed')
    // چهار رقم آخر کارت بدون فاصله
    expect(res.cardLast4).toBe('4242')
  })

  it('رقم آخر کارت 4242 به درستی استخراج می‌شود', async () => {
    vi.useFakeTimers()
    const p = processPayment({ cardNumber: '4242 1111 2222 3333', cardHolder: 'X', expiry: '12/28', cvv: '123', amount: 50 })
    await flush()
    const res = await p
    expect(res.status).toBe('completed')
    expect(res.cardLast4).toBe('3333')
  })
})

describe('processPayment — کارت 0000 همیشه ناموفق است', () => {
  it('شروع با 0000 → status = failed، حتی با مبلغ معتبر', async () => {
    vi.useFakeTimers()
    const p = processPayment({ cardNumber: '0000 1111 2222 3333', cardHolder: 'X', expiry: '12/28', cvv: '123', amount: 200 })
    await flush()
    const res = await p
    expect(res.status).toBe('failed')
  })
})

describe('processPayment — سایر کارت‌ها شانس موفقیت دارند', () => {
  it('وقتی Math.random کم است (< 0.9) موفق می‌شود', async () => {
    vi.useFakeTimers()
    vi.spyOn(Math, 'random').mockReturnValue(0.1)
    const p = processPayment({ cardNumber: '5555 1111 2222 3333', cardHolder: 'X', expiry: '12/28', cvv: '123', amount: 100 })
    await flush()
    const res = await p
    expect(res.status).toBe('completed')
  })

  it('وقتی Math.random زیاد است (>= 0.9) ناموفق می‌شود', async () => {
    vi.useFakeTimers()
    vi.spyOn(Math, 'random').mockReturnValue(0.95)
    const p = processPayment({ cardNumber: '5555 1111 2222 3333', cardHolder: 'X', expiry: '12/28', cvv: '123', amount: 100 })
    await flush()
    const res = await p
    expect(res.status).toBe('failed')
  })

  it('کارت خالی ناموفق می‌ماند (بدون پیشوند 4242/0000، random تعیین می‌کند) — پیشوند تعیین‌کننده است', async () => {
    vi.useFakeTimers()
    // حتی با random خیلی کم، پیشوند 0000 رد می‌شود
    vi.spyOn(Math, 'random').mockReturnValue(0.05)
    const p = processPayment({ cardNumber: '0000', cardHolder: 'X', expiry: '12/28', cvv: '123', amount: 100 })
    await flush()
    const res = await p
    expect(res.status).toBe('failed')
  })
})
