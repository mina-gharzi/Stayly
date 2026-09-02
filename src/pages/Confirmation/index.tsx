// src/pages/Confirmation/index.tsx
// قانون ۱۴: به‌جای وابستگی مستقیم به storage (getCreatedBookingById Sync)، رزرو از طریق
// useQuery(['booking', bookingId]) گرفته می‌شه — که هم Loading/Error state درست می‌ده،
// هم با بقیه‌ی صفحات (BookingDetails, MyBookings) همسان می‌شه.
// قانون ۱۰/۱۱: هتل و اتاق هم از services میان، نه از data مستقیم.
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { CheckCircle2, CalendarX } from 'lucide-react'
import { getBookingById } from '@/services/bookings'
import { getHotelById } from '@/services/hotels'
import { getRoomById } from '@/services/rooms'
import { useAuthStore } from '@/store/authStore'
import { formatToman } from '@/utils/currency'
import { usePageTitle } from '@/hooks/usePageTitle'
import { FadeIn } from '@/components/common/FadeIn'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { EmptyState } from '@/components/ui/EmptyState'

export function Confirmation() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const user = useAuthStore((s) => s.user)

  // اگه کاربر لاگین کرده، فقط رزرو خودش رو ببینه (قانون ۸)؛ برای checkout مهمان محدودیتی نیست
  const bookingQuery = useQuery({
    queryKey: ['booking', bookingId, user?.id],
    queryFn: () => getBookingById(bookingId!, user?.id),
    enabled: !!bookingId,
  })

  const booking = bookingQuery.data

  const hotelQuery = useQuery({
    queryKey: ['hotel', booking?.hotelId],
    queryFn: () => getHotelById(booking!.hotelId),
    enabled: !!booking,
  })
  const roomQuery = useQuery({
    queryKey: ['room', booking?.roomTypeId],
    queryFn: () => getRoomById(booking!.roomTypeId),
    enabled: !!booking,
  })

  usePageTitle(hotelQuery.data?.name ? `${hotelQuery.data.name} | تأیید رزرو` : undefined)

  if (bookingQuery.isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <Skeleton className="mx-auto h-16 w-16 rounded-full" />
        <Skeleton className="mx-auto mt-4 h-7 w-64 rounded-lg" />
        <Skeleton className="mt-8 h-48 w-full rounded-lg" />
      </div>
    )
  }

  if (bookingQuery.isError) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <ErrorState
          description="مشکلی در دریافت اطلاعات رزرو پیش آمد."
          onRetry={() => bookingQuery.refetch()}
        />
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <EmptyState
          icon={CalendarX}
          title="رزروی با این شناسه یافت نشد"
          action={
            <Link
              to="/"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-primary-700 px-5 text-sm font-medium text-white transition-colors hover:bg-primary-900"
            >
              بازگشت به صفحه اصلی
            </Link>
          }
        />
      </div>
    )
  }

  const hotel = hotelQuery.data
  const room = roomQuery.data

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <FadeIn>
        <CheckCircle2 className="mx-auto h-16 w-16 text-success-500" aria-hidden />
        <h1 className="mt-4 text-2xl font-bold text-neutral-900">رزرو با موفقیت انجام شد</h1>
        <p className="ltr-content mt-1 text-lg font-semibold text-primary-700">{booking.id}</p>
      </FadeIn>

      <FadeIn delay={150}>
        <div className="mt-8 rounded-lg border border-neutral-200 p-6 text-start">
          {hotelQuery.isLoading || roomQuery.isLoading ? (
            <Skeleton className="h-5 w-48" />
          ) : (
            <p className="font-semibold text-neutral-900">{hotel?.name} — {room?.name}</p>
          )}
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
