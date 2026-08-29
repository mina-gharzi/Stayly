// src/pages/Profile/index.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthStore } from '@/store/authStore'
import { profileSchema, type ProfileFormValues } from '@/schemas/profile'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useToastStore } from '@/store/toastStore'

export function Profile() {
  const { user, updateUser } = useAuthStore()
  const showToast = useToastStore((s) => s.show)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      country: user?.country ?? '',
    },
  })

  async function onSubmit(values: ProfileFormValues) {
    await new Promise((resolve) => setTimeout(resolve, 400))
    updateUser(values)
    showToast('پروفایل با موفقیت به‌روزرسانی شد', 'success')
  }

  if (!user) return null

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold text-neutral-900">پروفایل من</h1>

      <div className="mt-6 flex items-center gap-4">
        <img src={user.avatar} alt={user.firstName} className="h-16 w-16 rounded-full object-cover" />
        <div>
          <p className="font-medium text-neutral-900">{user.firstName} {user.lastName}</p>
          <p className="text-sm text-neutral-600">{user.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="نام" {...register('firstName')} error={errors.firstName?.message} />
          <Input label="نام خانوادگی" {...register('lastName')} error={errors.lastName?.message} />
        </div>
        <Input label="ایمیل" type="email" className="ltr-content" {...register('email')} error={errors.email?.message} />
        <Input label="شماره تلفن" className="ltr-content" {...register('phone')} error={errors.phone?.message} />
        <Input label="کشور" {...register('country')} error={errors.country?.message} />
        <Button type="submit" isLoading={isSubmitting} className="w-fit">ذخیره تغییرات</Button>
      </form>
    </div>
  )
}