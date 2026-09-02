// src/hooks/useCheckout.ts
// قانون ۱۲: منطق فرم/پرداخت/قیمت‌گذاری/ثبت‌رزرو/ناوبری که قبلاً همه توی pages/Checkout
// روی هم انباشته شده بود، اینجا متمرکز شده. صفحه فقط UI رو رندر می‌کنه و از این Hook استفاده می‌کنه.
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getHotelById } from '@/services/hotels'
import { getRoomById } from '@/services/rooms'
import { submitBookingPayment, PaymentFailedError, BookingValidationError, type CardDetails } from '@/services/checkout'
import { useBookingStore } from '@/store/bookingStore'
import { useAuthStore } from '@/store/authStore'
import { useToastStore } from '@/store/toastStore'
import { calculateNights, calculateSubtotal, calculateTaxes, calculateTotal } from '@/utils/pricing'
import { exceedsRoomAvailability, exceedsGuestCapacity, getGuestCapacity } from '@/utils/bookingRules'

export function useCheckout(hotelId: string | undefined, roomTypeId: string) {
  const navigate = useNavigate()
  const { draft, setDraft, reset } = useBookingStore()
  const user = useAuthStore((s) => s.user)
  const showToast = useToastStore((s) => s.show)

  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // قانون ۱۰: مثل بقیه‌ی صفحات، از services استفاده می‌کنیم — نه ایمپورت مستقیم از data
  const hotelQuery = useQuery({
    queryKey: ['hotel', hotelId],
    queryFn: () => getHotelById(hotelId!),
    enabled: !!hotelId,
  })
  const roomQuery = useQuery({
    queryKey: ['room', roomTypeId],
    queryFn: () => getRoomById(roomTypeId),
    enabled: !!roomTypeId,
  })

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

  const nights = calculateNights(draft.checkIn, draft.checkOut)
  const subtotal = room ? calculateSubtotal(room.pricePerNight, nights, draft.rooms) : 0
  const taxAmount = calculateTaxes(subtotal)
  const total = calculateTotal(subtotal, taxAmount, 0)

  const isLoading = hotelQuery.isLoading || roomQuery.isLoading
  const isError = hotelQuery.isError || roomQuery.isError
  const notFound = !isLoading && !isError && (!hotel || !room)

  const refetch = () => {
    hotelQuery.refetch()
    roomQuery.refetch()
  }

  const draftIncomplete = !draft.hotelId || !draft.roomTypeId || !draft.guestInfo

  async function submit(card: CardDetails) {
    setSubmitError(null)

    if (!room || !draft.hotelId || !draft.roomTypeId || !draft.guestInfo) {
      setSubmitError('اطلاعات رزرو ناقص است.')
      return
    }

    // اعتبارسنجی فوری سمت کلاینت قبل از پرداخت — تا کسی بابت رزروی که ممکنه رد بشه پول
    // پرداخت نکنه. لایه‌ی نهایی و غیرقابل‌دور‌زدن همچنان داخل submitBookingPayment است.
    if (exceedsRoomAvailability(draft.rooms, room.availableRooms)) {
      setSubmitError(
        room.availableRooms > 0
          ? `فقط ${room.availableRooms} اتاق از این نوع موجود است.`
          : 'ظرفیت این نوع اتاق تکمیل شده است.'
      )
      return
    }
    if (exceedsGuestCapacity(draft.adults, draft.children, room.maxGuests, draft.rooms)) {
      setSubmitError(`ظرفیت این تعداد اتاق حداکثر ${getGuestCapacity(room.maxGuests, draft.rooms)} مهمان است.`)
      return
    }

    setIsSubmitting(true)
    try {
      const { booking } = await submitBookingPayment({
        userId: user?.id ?? 'guest',
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
        card,
      })

      reset() // پاک کردن Draft بعد از تکمیل موفق رزرو
      navigate(`/confirmation/${booking.id}`)
    } catch (err) {
      const message =
        err instanceof PaymentFailedError || err instanceof BookingValidationError
          ? err.message
          : 'ثبت رزرو با مشکل مواجه شد. لطفاً دوباره تلاش کنید.'
      setSubmitError(message)
      showToast(message, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
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
  }
}
