// src/components/booking/BookingCard.tsx
// قانون ۱۰/۱۱: قبلاً مستقیم از data/hotels و data/rooms می‌خوند — الان مثل بقیه‌ی
// جاهای پروژه از services استفاده می‌کنه تا این Component به منبع داده وابسته نباشه.
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import type { Booking } from '@/types'
import { getHotelById } from '@/services/hotels'
import { getRoomById } from '@/services/rooms'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatToman } from '@/utils/currency'

const statusLabels: Record<Booking['status'], { label: string; variant: 'success' | 'warning' | 'error' | 'neutral' }> = {
  pending: { label: 'در انتظار پرداخت', variant: 'warning' },
  confirmed: { label: 'تأیید شده', variant: 'success' },
  completed: { label: 'انجام‌شده', variant: 'neutral' },
  cancelled: { label: 'لغو شده', variant: 'error' },
}

export function BookingCard({ booking }: { booking: Booking }) {
  // TanStack Query خودش کوئری‌های تکراری با کلید یکسان (مثلاً چند کارت با یک هتل) رو دیدوپ می‌کنه
  const hotelQuery = useQuery({ queryKey: ['hotel', booking.hotelId], queryFn: () => getHotelById(booking.hotelId) })
  const roomQuery = useQuery({ queryKey: ['room', booking.roomTypeId], queryFn: () => getRoomById(booking.roomTypeId) })

  const hotel = hotelQuery.data
  const room = roomQuery.data
  const status = statusLabels[booking.status]
  const isLoading = hotelQuery.isLoading || roomQuery.isLoading

  return (
    <Card className="flex flex-col overflow-hidden sm:flex-row">
      {isLoading ? (
        <Skeleton className="h-40 w-full sm:h-auto sm:w-48" />
      ) : (
        <img src={hotel?.images[0]?.url} alt={hotel?.name} className="h-40 w-full object-cover sm:h-auto sm:w-48" />
      )}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            {isLoading ? (
              <>
                <Skeleton className="h-5 w-32" />
                <Skeleton className="mt-2 h-4 w-24" />
              </>
            ) : (
              <>
                <p className="font-semibold text-neutral-900">{hotel?.name ?? 'هتل نامشخص'}</p>
                <p className="text-sm text-neutral-600">{room?.name ?? '—'}</p>
              </>
            )}
          </div>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>
        <p className="ltr-content text-sm text-neutral-700">{booking.checkIn} → {booking.checkOut}</p>
        <p className="text-sm text-neutral-600">{booking.adults} بزرگسال، {booking.children} کودک</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="tabular-price font-semibold text-neutral-900">{formatToman(booking.priceBreakdown.total)}</span>
          <Link to={`/my-bookings/${booking.id}`} className="text-sm font-medium text-primary-700 hover:underline">
            مشاهده جزئیات
          </Link>
        </div>
      </div>
    </Card>
  )
}
