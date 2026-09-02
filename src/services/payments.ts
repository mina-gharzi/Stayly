// src/services/payments.ts
// قانون ۱۵: این فایل حالا مسئول کامل «پرداخت» است — هم پردازش (Gateway) و هم ذخیره‌سازی —
// به‌جای پخش‌شدن بین دو فایل هم‌نام و مبهم (payment.ts / payments.ts)
import type { Payment, PaymentStatus } from '@/types'

const STORAGE_KEY = 'stayly-created-payments'

export interface PaymentInput {
  cardNumber: string
  cardHolder: string
  expiry: string
  cvv: string
  amount: number
}

export interface PaymentProcessingResult {
  status: Extract<PaymentStatus, 'completed' | 'failed'>
  cardLast4: string
}

// شبیه‌سازی درگاه پرداخت (Payment Gateway) — فقط پردازش می‌کنه، چیزی ذخیره نمی‌کنه
export function processPayment(input: PaymentInput): Promise<PaymentProcessingResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const digits = input.cardNumber.replace(/\s/g, '')
      const last4 = digits.slice(-4)
      let success: boolean
      if (digits.startsWith('4242')) success = true
      else if (digits.startsWith('0000')) success = false
      else success = Math.random() < 0.9
      resolve({ status: success ? 'completed' : 'failed', cardLast4: last4 })
    }, 1200)
  })
}

// ذخیره‌ی رکورد Payment (چه موفق چه ناموفق) — برای تاریخچه‌ی پرداخت
export function savePayment(payment: Omit<Payment, 'id'>): Promise<Payment> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newPayment: Payment = { ...payment, id: `pay-${Math.floor(Math.random() * 1_000_000)}` }
      const existing: Payment[] = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, newPayment]))
      resolve(newPayment)
    }, 100)
  })
}

// بعد از ساخته‌شدن رزرو، رکورد Payment (که قبل از وجود booking.id ذخیره شده بود) رو بهش وصل می‌کنیم
export function updatePaymentBookingId(paymentId: string, bookingId: string): Promise<Payment | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const existing: Payment[] = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
      const index = existing.findIndex((p) => p.id === paymentId)
      if (index === -1) {
        resolve(undefined)
        return
      }
      existing[index] = { ...existing[index], bookingId }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
      resolve(existing[index])
    }, 50)
  })
}
