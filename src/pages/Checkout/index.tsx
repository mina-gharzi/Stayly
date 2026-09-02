// src/pages/Checkout/index.tsx
// قانون ۱۲: این صفحه دیگه مسئول Pricing/Payment/Booking Creation/Navigation نیست —
// همه‌ی اون منطق داخل useCheckout و services/checkout.ts متمرکز شده. اینجا فقط فرم و UI هست.
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreditCard, AlertCircle, Search } from 'lucide-react'
import { useCheckout } from '@/hooks/useCheckout'
import { paymentSchema, type PaymentFormValues } from '@/schemas/payment'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatToman } from '@/utils/currency'
import { BookingSummaryCard } from '@/components/booking/BookingSummaryCard'
import { FadeIn } from '@/components/common/FadeIn'

export function Checkout() {
  const [searchParams] = useSearchParams()
  const hotelId = searchParams.get('hotelId') ?? ''
  const roomTypeId = searchParams.get('roomTypeId') ?? ''
  const navigate = useNavigate()

  const {
    draft,
    hotel,
    room,
    isLoading,
    isError,
    notFound,
    draftIncomplete,
    refetch,
    nights,
    subtotal,
    taxAmount,
    total,
    submit,
    submitError,
    isSubmitting,
  } = useCheckout(hotelId, roomTypeId)

  const { register, handleSubmit, formState: { errors } } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
  })

  // اگه هنوز اطلاعات مسافر (مرحله قبل) کامل نشده، اصلاً نباید به این صفحه برسه
  if (draftIncomplete) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="font-medium text-neutral-900">اطلاعات رزرو ناقص است</p>
        <p className="mt-1 text-sm text-neutral-600">لطفاً ابتدا اطلاعات مسافر را تکمیل کنید.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/hotels')}>بازگشت به جستجو</Button>
      </div>
    )
  }

  // ── حالت لودینگ ──
  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <Skeleton className="h-96 w-full rounded-2xl lg:col-span-2" />
          <Skeleton className="h-80 w-full rounded-2xl lg:col-span-1" />
        </div>
      </div>
    )
  }

  // ── حالت خطا (مثلاً سرویس نتونست اطلاعات هتل/اتاق رو بگیره) ──
  if (isError) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16">
        <ErrorState
          description="لطفاً دوباره تلاش کنید."
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  // ── حالت خالی (هتل/اتاق پیدا نشد) ──
  if (notFound || !hotel || !room) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16">
        <EmptyState
          icon={Search}
          title="اتاق یا هتل مورد نظر یافت نشد"
          description="لطفاً از صفحه جستجو اقامتگاه دیگری را انتخاب کنید."
          action={
            <Button variant="outline" onClick={() => navigate('/hotels')}>
              بازگشت به جستجو
            </Button>
          }
        />
      </div>
    )
  }

  function onSubmit(values: PaymentFormValues) {
    return submit(values)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <FadeIn>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-50">
            <CreditCard className="h-5 w-5 text-primary-600" aria-hidden />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">پرداخت</h1>
            <p className="text-sm text-neutral-500">اطلاعات کارت را برای تکمیل رزرو وارد کنید</p>
          </div>
        </div>
      </FadeIn>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <FadeIn delay={100} className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-card sm:p-8">
            <h2 className="font-semibold text-neutral-900">اطلاعات کارت</h2>

            {submitError && (
              <div className="flex items-center gap-2 rounded-md bg-error-100 p-3 text-sm text-error-500">
                <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
                {submitError}
              </div>
            )}

            <Input
              label="شماره کارت"
              placeholder="4242 4242 4242 4242"
              className="ltr-content"
              {...register('cardNumber')}
              error={errors.cardNumber?.message}
            />
            <Input label="نام دارنده کارت" {...register('cardHolder')} error={errors.cardHolder?.message} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="تاریخ انقضا" placeholder="MM/YY" className="ltr-content" {...register('expiry')} error={errors.expiry?.message} />
              <Input label="CVV" className="ltr-content" {...register('cvv')} error={errors.cvv?.message} />
            </div>

            <p className="text-xs text-neutral-500">
              برای تست: کارت شروع‌شده با 4242 = موفق، شروع‌شده با 0000 = ناموفق.
            </p>

            <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
              پرداخت {formatToman(total)}
            </Button>
          </form>
        </FadeIn>

        <FadeIn delay={200} className="lg:col-span-1">
          <div className="sticky top-20">
            <BookingSummaryCard
              hotel={hotel}
              room={room}
              checkIn={draft.checkIn}
              checkOut={draft.checkOut}
              nights={nights}
              adults={draft.adults}
              children={draft.children}
              rooms={draft.rooms}
              subtotal={subtotal}
              taxAmount={taxAmount}
              discount={0}
              total={total}
            />
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
