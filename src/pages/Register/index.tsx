// src/pages/Register/index.tsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { mockRegister } from '@/services/auth'
import { useAuthStore } from '@/store/authStore'
import { registerSchema, type RegisterFormValues } from '@/schemas/auth'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export function Register() {
  const navigate = useNavigate()
  const setSession = useAuthStore((s) => s.setSession)
  const [formError, setFormError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  async function onSubmit(values: RegisterFormValues) {
    setFormError(null)
    try {
      const { user, token } = await mockRegister(values)
      setSession(user, token)
      navigate('/')
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'ثبت‌نام ناموفق بود')
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-16">
      <h1 className="text-2xl font-bold text-neutral-900">ساخت حساب کاربری</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {formError && <p className="rounded-md bg-error-100 p-3 text-sm text-error-500">{formError}</p>}
        <div className="grid grid-cols-2 gap-4">
          <Input label="نام" {...register('firstName')} error={errors.firstName?.message} />
          <Input label="نام خانوادگی" {...register('lastName')} error={errors.lastName?.message} />
        </div>
        <Input label="ایمیل" type="email" className="ltr-content" {...register('email')} error={errors.email?.message} />
        <Input label="شماره تلفن" className="ltr-content" {...register('phone')} error={errors.phone?.message} />
        <Input label="رمز عبور" type="password" className="ltr-content" {...register('password')} error={errors.password?.message} />
        <Input label="تکرار رمز عبور" type="password" className="ltr-content" {...register('confirmPassword')} error={errors.confirmPassword?.message} />
        <Button type="submit" isLoading={isSubmitting}>ثبت‌نام</Button>
      </form>

      <p className="text-center text-sm text-neutral-600">
        قبلاً ثبت‌نام کرده‌اید؟ <Link to="/login" className="font-medium text-primary-700">وارد شوید</Link>
      </p>
    </div>
  )
}