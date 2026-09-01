// src/pages/Checkout/index.tsx
import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreditCard, AlertCircle } from 'lucide-react'
import { useBookingStore } from '@/store/bookingStore'
import { useAuthStore } from '@/store/authStore'
import { mockProcessPayment } from '@/services/payment'
import { savePayment } from '@/services/payments'
import { createBooking } from '@/services/bookings'
import { paymentSchema, type PaymentFormValues } from '@/schemas/payment'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useToastStore } from '@/store/toastStore'
import { hotels } from '@/data/hotels'
import { roomTypes } from '@/data/rooms'
import { calculateNights, calculateSubtotal, calculateTaxes, calculateTotal } from '@/utils/pricing'
import { formatToman } from '@/utils/currency'
import { BookingSummaryCard } from '@/components/booking/BookingSummaryCard'
import { FadeIn } from '@/components/common/FadeIn'

export function Checkout() {
  const { hotelId } = useParams<{ hotelId: string }>()
  const [searchParams] = useSearchParams()
  const roomTypeId = searchParams.get('roomTypeId') ?? ''
  const navigate = useNavigate()
  const { draft, setDraft, reset } = useBookingStore()
  const user = useAuthStore((s) => s.user)
  const showToast = useToastStore((s) => s.show)
  const [paymentError, setPaymentError] = useState(false)

  // این فرم فقط اطلاعات کارت رو نگه می‌داره — به‌هیچ‌وجه با draft.guestInfo/Zustand قاطی نمی‌شه
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
  })

  const hotelQuery = useQuery({ queryKey: ['hotel', hotelId], queryFn: () => hotels.find((h) => h.id === hotelId) ?? null })
  const roomQuery = useQuery({ queryKey: ['room', roomTypeId], queryFn: () => roomTypes.find((r) => r.id === roomTypeId) ?? null })

  useEffect(() => {
    if (hotelId && roomTypeId && (draft.hotelId !== hotelId || draft.roomTypeId !== roomTypeId)) {
      const checkIn = draft.checkIn || new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10)
      const checkOut = draft.checkOut || new Date(Date.now() + 10 * 86400000).toISOString().slice(0, 10)
      setDraft({ hotelId, roomTypeId, checkIn, checkOut })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotelId, roomTypeId])

  const hotel = hotelQuery.data
  const room = roomQuery.data

  // اگه هنوز اطلاعات مسافر (مرحله قبل) کامل نشده، اصلاً نباید به این صفحه برسه
  if (!draft.hotelId || !draft.roomTypeId || !draft.guestInfo) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="font-medium text-neutral-900">اطلاعات رزرو ناقص است</p>
        <p className="mt-1 text-sm text-neutral-600">لطفاً ابتدا اطلاعات مسافر را تکمیل کنید.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/hotels')}>بازگشت به جستجو</Button>
      </div>
    )
  }

  if (hotelQuery.isLoading || roomQuery.isLoading) {
    return <div className="mx-auto max-w-5xl px-4 py-8"><div className="h-48 w-full rounded-2xl bg-neutral-200" /></div>
  }

  if (!hotel || !room) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <p className="font-medium text-neutral-900">اتاق یا هتل مورد نظر یافت نشد</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/hotels')}>بازگشت به جستجو</Button>
      </div>
    )
  }

  const nights = calculateNights(draft.checkIn, draft.checkOut)
  const subtotal = calculateSubtotal(room.pricePerNight, nights)
  const taxAmount = calculateTaxes(subtotal)
  const total = calculateTotal(subtotal, taxAmount, 0)

  async function onSubmit(values: PaymentFormValues) {
    setPaymentError(false)

    const result = await mockProcessPayment({
      cardNumber: values.cardNumber,
      cardHolder: values.cardHolder,
      expiry: values.expiry,
      cvv: values.cvv,
      amount: total,
    })

    // رکورد Payment همیشه ذخیره می‌شه (چه موفق چه ناموفق) — برای تاریخچه
    const payment = await savePayment({
      bookingId: '',
      status: result.status,
      cardLast4: result.cardLast4,
      amount: total,
      processedAt: new Date().toISOString(),
    })

    if (result.status === 'failed') {
      setPaymentError(true)
      showToast('پرداخت ناموفق بود. لطفاً اطلاعات کارت را بررسی و دوباره تلاش کنید.', 'error')
      return
    }

    const booking = await createBooking({
      userId: user?.id ?? 'guest',
      hotelId: draft.hotelId!,
      roomTypeId: draft.roomTypeId!,
      checkIn: draft.checkIn,
      checkOut: draft.checkOut,
      adults: draft.adults,
      children: draft.children,
      rooms: draft.rooms,
      guestInfo: draft.guestInfo!,
      priceBreakdown: {
        pricePerNight: room!.pricePerNight,
        nights,
        subtotal,
        taxRate: 0.1,
        taxAmount,
        discount: 0,
        total,
      },
      status: 'confirmed',
      paymentId: payment.id,
    })

    reset() // پاک کردن Draft بعد از تکمیل موفق رزرو — طبق قانون بخش ۱۰ اسپک
    navigate(`/confirmation/${booking.id}`)
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

            {paymentError && (
              <div className="flex items-center gap-2 rounded-md bg-error-100 p-3 text-sm text-error-500">
                <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
                پرداخت ناموفق بود. لطفاً اطلاعات کارت را بررسی و دوباره تلاش کنید.
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
            <div className="grid grid-cols-2 gap-4">
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