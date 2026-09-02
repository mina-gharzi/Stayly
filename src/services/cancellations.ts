// src/services/cancellations.ts
// قانون ۷: وضعیت واقعی استرداد وجه باید به‌طور کامل در Data Layer ذخیره بشه —
// نه فقط یک پیام موفقیت گذرا در UI. این سرویس رکورد Cancellation/Refund رو
// طبق تایپ `Cancellation` (src/types/booking.ts) نگه‌داری می‌کنه.
import type { Cancellation } from '@/types'

const STORAGE_KEY = 'stayly-cancellations'

// شبیه‌سازی زمانی که طول می‌کشه تا استرداد واقعاً توسط درگاه پرداخت تکمیل بشه
const MOCK_REFUND_COMPLETION_DELAY_MS = 4000

function getAll(): Cancellation[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

function saveAll(list: Cancellation[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

function generateCancellationId(): string {
  return `CNL-${Math.floor(10000 + Math.random() * 90000)}`
}

// یک رکورد کنسلی با وضعیت استرداد 'initiated' ایجاد می‌کنه (فراخوانی‌شده از createBooking/cancelBooking)
export function createCancellation(bookingId: string): Cancellation {
  const cancellation: Cancellation = {
    id: generateCancellationId(),
    bookingId,
    cancelledAt: new Date().toISOString(),
    refundStatus: 'initiated',
  }
  saveAll([...getAll(), cancellation])

  // Mock: بعد از یک تاخیر، استرداد به‌صورت خودکار «تکمیل‌شده» علامت‌گذاری می‌شه —
  // شبیه وبهوکِ درگاه پرداخت در دنیای واقعی
  setTimeout(() => {
    markRefundCompleted(bookingId)
  }, MOCK_REFUND_COMPLETION_DELAY_MS)

  return cancellation
}

export function getCancellationByBookingId(bookingId: string): Cancellation | undefined {
  return getAll().find((c) => c.bookingId === bookingId)
}

function markRefundCompleted(bookingId: string): Cancellation | undefined {
  const all = getAll()
  const index = all.findIndex((c) => c.bookingId === bookingId)
  if (index === -1) return undefined
  if (all[index].refundStatus === 'completed') return all[index]

  const updated: Cancellation = { ...all[index], refundStatus: 'completed' }
  all[index] = updated
  saveAll(all)
  return updated
}
