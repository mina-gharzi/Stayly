// src/schemas/auth.ts
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().min(1, 'ایمیل الزامی است').email('ایمیل معتبر نیست'),
  password: z.string().min(1, 'رمز عبور الزامی است'),
})
export type LoginFormValues = z.infer<typeof loginSchema>

export const registerSchema = z
  .object({
    firstName: z.string().min(1, 'نام الزامی است'),
    lastName: z.string().min(1, 'نام خانوادگی الزامی است'),
    email: z.string().min(1, 'ایمیل الزامی است').email('ایمیل معتبر نیست'),
    phone: z.string().min(1, 'شماره تلفن الزامی است').regex(/^\+?[0-9\s-]{7,15}$/, 'شماره تلفن معتبر نیست'),
    password: z.string().min(6, 'رمز عبور باید حداقل ۶ کاراکتر باشد'),
    confirmPassword: z.string().min(1, 'تکرار رمز عبور الزامی است'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'رمز عبور و تکرار آن یکسان نیستند',
    path: ['confirmPassword'],
  })
export type RegisterFormValues = z.infer<typeof registerSchema>