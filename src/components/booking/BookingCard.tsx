// src/components/booking/BookingCard.tsx
import { Link } from 'react-router-dom'
import type { Booking } from '@/types'
import { hotels } from '@/data/hotels'
import { roomTypes } from '@/data/rooms'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatToman } from '@/utils/currency'

const statusLabels: Record<Booking['status'], { label: string; variant: 'success' | 'warning' | 'error' | 'neutral' }> = {
  pending: { label: 'در انتظار پرداخت', variant: 'warning' },
  confirmed: { label: 'تأیید شده', variant: 'success' },
  completed: { label: 'انجام‌شده', variant: 'neutral' },
  cancelled: { label: 'لغو شده', variant: 'error' },
}

export function BookingCard({ booking }: { booking: Booking }) {
  const hotel = hotels.find((h) => h.id === booking.hotelId)
  const room = roomTypes.find((r) => r.id === booking.roomTypeId)
  const status = statusLabels[booking.status]

  return (
    <Card className="flex flex-col overflow-hidden sm:flex-row">
      <img src={hotel?.images[0]?.url} alt={hotel?.name} className="h-40 w-full object-cover sm:h-auto sm:w-48" />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-neutral-900">{hotel?.name}</p>
            <p className="text-sm text-neutral-600">{room?.name}</p>
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