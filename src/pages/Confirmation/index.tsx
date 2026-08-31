// src/pages/Confirmation/index.tsx
import { useParams, Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { getCreatedBookingById } from '@/services/bookings'
import { hotels } from '@/data/hotels'
import { roomTypes } from '@/data/rooms'
import { formatToman } from '@/utils/currency'
import { FadeIn } from '@/components/common/FadeIn'

export function Confirmation() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const booking = bookingId ? getCreatedBookingById(bookingId) : undefined

  if (!booking) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="font-medium text-neutral-900">رزروی با این شناسه یافت نشد</p>
        <Link to="/" className="mt-4 inline-flex h-11 items-center justify-center rounded-md border border-neutral-200 px-4 text-sm font-medium text-neutral-800 hover:bg-neutral-50">
          بازگشت به صفحه اصلی
        </Link>
      </div>
    )
  }

  const hotel = hotels.find((h) => h.id === booking.hotelId)
  const room = roomTypes.find((r) => r.id === booking.roomTypeId)

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <FadeIn>
        <CheckCircle2 className="mx-auto h-16 w-16 text-success-500" aria-hidden />
        <h1 className="mt-4 text-2xl font-bold text-neutral-900">رزرو با موفقیت انجام شد</h1>
        <p className="ltr-content mt-1 text-lg font-semibold text-primary-700">{booking.id}</p>
      </FadeIn>

      <FadeIn delay={150}>
        <div className="mt-8 rounded-lg border border-neutral-200 p-6 text-start">
          <p className="font-semibold text-neutral-900">{hotel?.name} — {room?.name}</p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div><p className="text-neutral-600">ورود</p><p className="ltr-content font-medium text-neutral-900">{booking.checkIn}</p></div>
            <div><p className="text-neutral-600">خروج</p><p className="ltr-content font-medium text-neutral-900">{booking.checkOut}</p></div>
            <div><p className="text-neutral-600">مهمانان</p><p className="font-medium text-neutral-900">{booking.adults} بزرگسال، {booking.children} کودک</p></div>
            <div><p className="text-neutral-600">وضعیت پرداخت</p><p className="font-medium text-success-500">موفق</p></div>
          </div>
          <div className="mt-4 flex justify-between border-t border-neutral-100 pt-4 text-base font-bold text-neutral-900">
            <span>مبلغ نهایی</span>
            <span className="tabular-price">{formatToman(booking.priceBreakdown.total)}</span>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={300}>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/my-bookings" className="inline-flex h-11 items-center justify-center rounded-md bg-primary-700 px-4 text-sm font-medium text-white hover:bg-primary-900">
            مشاهده رزروهای من
          </Link>
          <Link to="/" className="inline-flex h-11 items-center justify-center rounded-md border border-neutral-200 px-4 text-sm font-medium text-neutral-800 hover:bg-neutral-50">
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </FadeIn>
    </div>
  )
}