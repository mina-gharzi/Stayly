// src/pages/Booking/index.tsx
import { useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getHotelById } from '@/services/hotels'
import { getRoomById } from '@/services/rooms'
import { useBookingStore } from '@/store/bookingStore'
import { guestInfoSchema, type GuestInfoFormValues } from '@/schemas/guestInfo'
import { calculateNights, calculateSubtotal, calculateTaxes, calculateTotal } from '@/utils/pricing'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { GuestSelector } from '@/components/ui/GuestSelector'
import { BookingSummaryCard } from '@/components/booking/BookingSummaryCard'
import { Skeleton } from '@/components/ui/Skeleton'

function todayPlus(days: number) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export function Booking() {
  const { hotelId } = useParams<{ hotelId: string }>()
  const [searchParams] = useSearchParams()
  const roomTypeId = searchParams.get('roomTypeId') ?? ''
  const navigate = useNavigate()
  const { draft, setDraft } = useBookingStore()

  const hotelQuery = useQuery({ queryKey: ['hotel', hotelId], queryFn: () => getHotelById(hotelId!) })
  const roomQuery = useQuery({ queryKey: ['room', roomTypeId], queryFn: () => getRoomById(roomTypeId) })

  useEffect(() => {
    if (hotelId && roomTypeId && (draft.hotelId !== hotelId || draft.roomTypeId !== roomTypeId)) {
      setDraft({
        hotelId,
        roomTypeId,
        checkIn: draft.checkIn || todayPlus(7),
        checkOut: draft.checkOut || todayPlus(10),
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotelId, roomTypeId])

  const { register, handleSubmit, formState: { errors } } = useForm<GuestInfoFormValues>({
    resolver: zodResolver(guestInfoSchema),
    defaultValues: draft.guestInfo ?? undefined,
  })

  if (hotelQuery.isLoading || roomQuery.isLoading) {
    return <div className="mx-auto max-w-5xl px-4 py-8"><Skeleton className="h-48 w-full" /></div>
  }

  const hotel = hotelQuery.data
  const room = roomQuery.data

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
    navigate('/checkout')
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold text-neutral-900">تکمیل اطلاعات رزرو</h1>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="grid grid-cols-1 gap-3 rounded-lg border border-neutral-200 p-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-800">ورود</label>
              <input type="date" value={draft.checkIn} onChange={(e) => setDraft({ checkIn: e.target.value })}
                className="ltr-content h-11 rounded-md border border-neutral-200 px-3 text-sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-800">خروج</label>
              <input type="date" value={draft.checkOut} onChange={(e) => setDraft({ checkOut: e.target.value })}
                className="ltr-content h-11 rounded-md border border-neutral-200 px-3 text-sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-neutral-800">مهمانان</span>
              <GuestSelector
                value={{ adults: draft.adults, children: draft.children, rooms: draft.rooms }}
                onChange={(v) => setDraft(v)}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 rounded-lg border border-neutral-200 p-4">
            <h2 className="font-semibold text-neutral-900">اطلاعات مسافر</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="نام" {...register('firstName')} error={errors.firstName?.message} />
              <Input label="نام خانوادگی" {...register('lastName')} error={errors.lastName?.message} />
            </div>
            <Input label="ایمیل" type="email" className="ltr-content" {...register('email')} error={errors.email?.message} />
            <Input label="شماره تلفن" className="ltr-content" {...register('phone')} error={errors.phone?.message} />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-800">درخواست ویژه (اختیاری)</label>
              <textarea {...register('specialRequests')} rows={3}
                className="rounded-md border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <Button type="submit" disabled={nights <= 0}>ادامه به پرداخت</Button>
            {nights <= 0 && <p className="text-sm text-error-500">تاریخ خروج باید بعد از تاریخ ورود باشد.</p>}
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <BookingSummaryCard hotel={hotel} room={room} checkIn={draft.checkIn} checkOut={draft.checkOut}
              nights={nights} adults={draft.adults} children={draft.children}
              subtotal={subtotal} taxAmount={taxAmount} discount={0} total={total} />
          </div>
        </div>
      </div>
    </div>
  )
}