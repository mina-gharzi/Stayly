// src/services/payment.ts — طبق تصمیم قطعی بخش ۱۳ اسپک
export interface PaymentInput {
  cardNumber: string
  cardHolder: string
  expiry: string
  cvv: string
  amount: number
}
export interface PaymentResult {
  status: 'completed' | 'failed'
  cardLast4: string
}

export function mockProcessPayment(input: PaymentInput): Promise<PaymentResult> {
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