// src/services/payments.ts (ذخیره Payment ساخته‌شده — مجزا از payment.ts که فقط پردازش می‌کنه)
import type { Payment } from '@/types'

const STORAGE_KEY = 'stayly-created-payments'

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