// src/pages/BookingDetails/index.tsx
import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AlertTriangle } from 'lucide-react'
import { getBookingById, cancelBooking } from '@/services/bookings'
import { hotels } from '@/data/hotels'
import { roomTypes } from '@/data/rooms'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatToman } from '@/utils/currency'
import { useToastStore } from '@/store/toastStore'

const statusLabels: Record<string, { label: string; variant: 'success' | 'warning' | 'error' | 'neutral' }> = {
  pending: { label: 'در انتظار پرداخت', variant: 'warning' },
  confirmed: { label: 'تأیید شده', variant: 'success' },
  completed: { label: 'انجام‌شده', variant: 'neutral' },
  cancelled: { label: 'لغو شده', variant: 'error' },
}

export function BookingDetails() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const queryClient = useQueryClient()
  const showToast = useToastStore((s) => s.show)
  const [modalOpen, setModalOpen] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)

  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => getBookingById(bookingId!),
    enabled: !!bookingId,
  })

  if (isLoading) return <div className="mx-auto max-w-3xl px-4 py-8"><Skeleton className="h-64 w-full" /></div>

  if (!booking) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="font-medium text-neutral-900">رزرو یافت نشد</p>
        <Link to="/my-bookings" className="mt-4 inline-block text-sm font-medium text-primary-700">بازگشت به رزروهای من</Link>
      </div>
    )
  }

  const hotel = hotels.find((h) => h.id === booking.hotelId)
  const room = roomTypes.find((r) => r.id === booking.roomTypeId)
  const status = statusLabels[booking.status]
  const canCancel = booking.status === 'pending' || booking.status === 'confirmed'

  async function handleConfirmCancel() {
    setIsCancelling(true)
    await cancelBooking(booking!.id)
    await queryClient.invalidateQueries({ queryKey: ['booking', bookingId] })
    await queryClient.invalidateQueries({ queryKey: ['bookings'] })
    setIsCancelling(false)
    setModalOpen(false)
    showToast('استرداد وجه آغاز شد', 'success')
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="ltr-content text-sm text-neutral-600">{booking.id}</p>
          <h1 className="text-2xl font-bold text-neutral-900">{hotel?.name}</h1>
        </div>
        <Badge variant={status.variant}>{status.label}</Badge>
      </div>

      <div className="mt-6 rounded-lg border border-neutral-200 p-6">
        <h2 className="font-semibold text-neutral-900">اطلاعات اقامت</h2>
        <div className="mt-3 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
          <div><p className="text-neutral-600">اتاق</p><p className="font-medium text-neutral-900">{room?.name}</p></div>
          <div><p className="text-neutral-600">ورود</p><p className="ltr-content font-medium text-neutral-900">{booking.checkIn}</p></div>
          <div><p className="text-neutral-600">خروج</p><p className="ltr-content font-medium text-neutral-900">{booking.checkOut}</p></div>
          <div><p className="text-neutral-600">مهمانان</p><p className="font-medium text-neutral-900">{booking.adults} بزرگسال، {booking.children} کودک</p></div>
        </div>

        <h2 className="mt-6 font-semibold text-neutral-900">اطلاعات مسافر</h2>
        <div className="mt-3 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
          <div><p className="text-neutral-600">نام</p><p className="font-medium text-neutral-900">{booking.guestInfo.firstName} {booking.guestInfo.lastName}</p></div>
          <div><p className="text-neutral-600">ایمیل</p><p className="ltr-content font-medium text-neutral-900">{booking.guestInfo.email}</p></div>
          <div><p className="text-neutral-600">تلفن</p><p className="ltr-content font-medium text-neutral-900">{booking.guestInfo.phone}</p></div>
        </div>

        <h2 className="mt-6 font-semibold text-neutral-900">جزئیات پرداخت</h2>
        <div className="mt-3 flex flex-col gap-1 text-sm">
          <div className="flex justify-between"><span className="text-neutral-600">جمع اجاره</span><span className="tabular-price">{formatToman(booking.priceBreakdown.subtotal)}</span></div>
          <div className="flex justify-between"><span className="text-neutral-600">مالیات</span><span className="tabular-price">{formatToman(booking.priceBreakdown.taxAmount)}</span></div>
          <div className="mt-2 flex justify-between border-t border-neutral-100 pt-2 text-base font-bold text-neutral-900">
            <span>مبلغ نهایی</span><span className="tabular-price">{formatToman(booking.priceBreakdown.total)}</span>
          </div>
        </div>

        {canCancel && (
          <Button variant="outline" className="mt-6 border-error-500 text-error-500 hover:bg-error-100" onClick={() => setModalOpen(true)}>
            لغو رزرو
          </Button>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="لغو رزرو">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-warning-500" aria-hidden />
          <p className="text-sm text-neutral-700">آیا از لغو این رزرو مطمئن هستید؟ این عملیات قابل بازگشت نیست.</p>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setModalOpen(false)}>انصراف</Button>
          <Button onClick={handleConfirmCancel} isLoading={isCancelling} className="bg-error-500 hover:bg-error-500/90">
            بله، لغو کن
          </Button>
        </div>
      </Modal>
    </div>
  )
}