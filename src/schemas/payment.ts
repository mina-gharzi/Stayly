// src/schemas/payment.ts
import { z } from 'zod'

export const paymentSchema = z.object({
  cardNumber: z.string().min(12, 'شماره کارت معتبر نیست').max(19),
  cardHolder: z.string().min(1, 'نام دارنده کارت الزامی است'),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'فرمت باید MM/YY باشد'),
  cvv: z.string().regex(/^\d{3,4}$/, 'CVV معتبر نیست'),
})
export type PaymentFormValues = z.infer<typeof paymentSchema>