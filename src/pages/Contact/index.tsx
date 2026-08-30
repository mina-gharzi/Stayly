// src/pages/Contact/index.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Phone, MapPin } from 'lucide-react'
import { contactSchema, type ContactFormValues } from '@/schemas/contact'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useToastStore } from '@/store/toastStore'

export function Contact() {
  const showToast = useToastStore((s) => s.show)
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  })

  async function onSubmit(values: ContactFormValues) {
    await new Promise((resolve) => setTimeout(resolve, 600)) // شبیه‌سازی ارسال
    showToast('پیام شما با موفقیت ارسال شد', 'success')
    reset()
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-neutral-900">تماس با ما</h1>
        <p className="mt-2 text-neutral-600">سوالی دارید؟ خوشحال می‌شویم کمکتان کنیم.</p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 rounded-lg border border-neutral-200 p-6 lg:col-span-2">
          <Input label="نام" {...register('name')} error={errors.name?.message} />
          <Input label="ایمیل" type="email" className="ltr-content" {...register('email')} error={errors.email?.message} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-800">پیام</label>
            <textarea
              {...register('message')}
              rows={5}
              className="rounded-md border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {errors.message && <p className="text-xs text-error-500">{errors.message.message}</p>}
          </div>
          <Button type="submit" isLoading={isSubmitting} className="w-fit">ارسال پیام</Button>
        </form>

        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3 rounded-lg border border-neutral-200 p-4">
            <Mail className="h-5 w-5 shrink-0 text-primary-700" aria-hidden />
            <div>
              <p className="text-sm font-medium text-neutral-900">ایمیل</p>
              <p className="ltr-content text-sm text-neutral-600">support@stayly.com</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-neutral-200 p-4">
            <Phone className="h-5 w-5 shrink-0 text-primary-700" aria-hidden />
            <div>
              <p className="text-sm font-medium text-neutral-900">تلفن</p>
              <p className="ltr-content text-sm text-neutral-600">+98 21 1234 5678</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-neutral-200 p-4">
            <MapPin className="h-5 w-5 shrink-0 text-primary-700" aria-hidden />
            <div>
              <p className="text-sm font-medium text-neutral-900">آدرس</p>
              <p className="text-sm text-neutral-600">تهران، ایران</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}