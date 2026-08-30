// src/schemas/contact.ts
import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(1, 'نام الزامی است'),
  email: z.string().min(1, 'ایمیل الزامی است').email('ایمیل معتبر نیست'),
  message: z.string().min(10, 'پیام باید حداقل ۱۰ کاراکتر باشد'),
})
export type ContactFormValues = z.infer<typeof contactSchema>