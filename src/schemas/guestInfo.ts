// src/schemas/guestInfo.ts
import { z } from 'zod'

export const guestInfoSchema = z.object({
  firstName: z.string().min(1, 'نام الزامی است'),
  lastName: z.string().min(1, 'نام خانوادگی الزامی است'),
  email: z.string().min(1, 'ایمیل الزامی است').email('ایمیل معتبر نیست'),
  phone: z.string().min(1, 'شماره تلفن الزامی است').regex(/^\+?[0-9\s-]{7,15}$/, 'شماره تلفن معتبر نیست'),
  specialRequests: z.string().optional(),
  cardNumber: z.string().min(12, "شماره کارت معتبر نیست").max(19),
  cardHolder: z.string().min(1, "اسم دارنده کارت الزامی است"),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "فرمت باید MM/YY باشد"),
  cvv: z.string().regex(/^\d{3,4}$/, "CVV معتبر نیست"),
})
export type GuestInfoFormValues = z.infer<typeof guestInfoSchema>