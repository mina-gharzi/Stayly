// src/pages/Checkout/index.tsx
import { useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useBookingStore } from '@/store/bookingStore'
import { mockProcessPayment } from '@/services/payment'
import { createBooking } from '@/services/bookings'
import { guestInfoSchema, type GuestInfoFormValues } from '@/schemas/guestInfo'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useToastStore } from '@/store/toastStore'
import { hotels } from '@/data/hotels'
import { roomTypes } from '@/data/rooms'
import { calculateNights, calculateSubtotal, calculateTaxes, calculateTotal } from '@/utils/pricing'
import { BookingSummaryCard } from '@/components/booking/BookingSummaryCard'
import { FadeIn } from '@/components/common/FadeIn'

export function Checkout() {
  const { hotelId } = useParams<{ hotelId: string }>()
  const [searchParams] = useSearchParams()
  const roomTypeId = searchParams.get('roomTypeId') ?? ''
  const navigate = useNavigate()
  const { draft, setDraft } = useBookingStore()
  const showToast = useToastStore((s) => s.show)

  // useForm must be the first hook call — called unconditionally every render
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<GuestInfoFormValues>({
    resolver: zodResolver(guestInfoSchema),
    defaultValues: draft.guestInfo ?? { firstName: '', lastName: '', email: '', phone: '', specialRequests: '' },
  })

  const hotelQuery = useQuery({ queryKey: ['hotel', hotelId], queryFn: () => hotels.find((h) => h.id === hotelId) ?? null })
  const roomQuery = useQuery({ queryKey: ['room', roomTypeId], queryFn: () => roomTypes.find((r) => r.id === roomTypeId) ?? null })

  useEffect(() => {
    if (hotelId && roomTypeId && (draft.hotelId !== hotelId || draft.roomTypeId !== roomTypeId)) {
      const checkIn = draft.checkIn || new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10)
      const checkOut = draft.checkOut || new Date(Date.now() + 10 * 86400000).toISOString().slice(0, 10)
      setDraft?.({ hotelId, roomTypeId, checkIn, checkOut })
    }
  }, [hotelId, roomTypeId, draft])

  const hotel = hotelQuery.data
  const room = roomQuery.data

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

  function onSubmit(values: GuestInfoFormValues) {
    setDraft({ guestInfo: { ...values, specialRequests: values.specialRequests ?? '' } })

    // Process mock payment
    const paymentInput = {
      cardNumber: values.cardNumber?.replace(/\s/g, '') ?? '4242',
      cardHolder: `${values.firstName} ${values.lastName}`,
      expiry: values.expiry ?? '12/30',
      cvv: values.cvv ?? '123',
      amount: total,
    }

    mockProcessPayment(paymentInput).then((result) => {
      if (result.status === 'completed') {
        createBooking({
          hotelId: draft.hotelId,
          roomTypeId: draft.roomTypeId,
          checkIn: draft.checkIn,
          checkOut: draft.checkOut,
          adults: draft.adults,
          children: draft.children,
          rooms: draft.rooms,
          guestInfo: draft.guestInfo,
          priceBreakdown: {
            pricePerNight: room.pricePerNight,
            nights,
            subtotal,
            taxRate: 0.1,
            taxAmount,
            discount: 0,
            total,
          },
          status: 'confirmed',
        }).then((createdBooking) => {
          navigate(`/confirmation/${createdBooking.id}`)
        })
      } else {
        showToast('پرداخت ناموفق بود. لطفا اطلاعات کارت را بررسی کنید.', 'error')
      }
    })
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <FadeIn>
        <h1 className="text-2xl font-bold text-neutral-900">پرداخت وCheckout</h1>
      </FadeIn>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <FadeIn delay={100} className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 rounded-lg border border-neutral-200 p-6 sm:p-8">
            <h2 className="font-semibold text-neutral-900">اطلاعات مسافر</h2>
            <Input label="نام" type="text" {...register('firstName')} error={errors.firstName?.message} />
            <Input label="نام خانوادگی" type="text" {...register('lastName')} error={errors.lastName?.message} />
            <Input label="ایمیل" type="email" className="ltr-content" {...register('email')} error={errors.email?.message} />
            <Input label="شماره تلفن" className="ltr-content" {...register('phone')} error={errors.phone?.message} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="شماره کارت" type="text" placeholder="4242 1234 1234 1234" {...register('cardNumber')} />
              <Input label="تاریخ انقضا" type="text" placeholder="AA/AA" {...register('expiry')} />
            </div>
            <Input label="CVV" type="text" placeholder="123" {...register('cvv')} />
            <Input label="اسم possessor" type="text" {...register('cardHolder')} />
            <Button type="submit" disabled={isSubmitting} className="mt-6 w-full">تکمیل رزرو</Button>
            {nights <= 0 && <p className="text-sm text-error-500 mt-2">تاریخ خروج باید بعد از تاریخ ورود باشد.</p>}
          </form>
        </FadeIn>

        <FadeIn delay={200} className="lg:col-span-1 sticky top-20">
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
        </FadeIn>
      </div>
    </div>
  )
}