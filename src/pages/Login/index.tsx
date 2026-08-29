// src/pages/Login/index.tsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { mockLogin } from '@/services/auth'
import { useAuthStore } from '@/store/authStore'
import { loginSchema, type LoginFormValues } from '@/schemas/auth'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const setSession = useAuthStore((s) => s.setSession)
  const [formError, setFormError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(values: LoginFormValues) {
    setFormError(null)
    try {
      const { user, token } = await mockLogin(values.email, values.password)
      setSession(user, token)
      const redirect = searchParams.get('redirect')
      navigate(redirect ? decodeURIComponent(redirect) : '/')
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'ورود ناموفق بود')
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-16">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">ورود به حساب کاربری</h1>
        <p className="mt-1 text-sm text-neutral-600">
          برای تست: هر ایمیلی از کاربران نمونه با رمز <span className="ltr-content font-medium">123456</span>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {formError && <p className="rounded-md bg-error-100 p-3 text-sm text-error-500">{formError}</p>}
        <Input label="ایمیل" type="email" className="ltr-content" {...register('email')} error={errors.email?.message} />
        <Input label="رمز عبور" type="password" className="ltr-content" {...register('password')} error={errors.password?.message} />
        <Button type="submit" isLoading={isSubmitting}>ورود</Button>
      </form>

      <p className="text-center text-sm text-neutral-600">
        حساب کاربری ندارید؟ <Link to="/register" className="font-medium text-primary-700">ثبت‌نام کنید</Link>
      </p>
    </div>
  )
}