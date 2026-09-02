// src/hooks/useCheckout.ts
import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getHotelById } from '@/services/hotels'
import { getRoomById } from '@/services/rooms'
import { mockProcessPayment } from '@/services/payment'
import { savePayment } from '@/services/payments'
import { createBooking, BookingValidationError } from '@/services/bookings'
import { useBookingStore } from '@/store/bookingStore'
import { useAuthStore } from '@/store/authStore'
import { calculateNights, calculateSubtotal, calculateTaxes, calculateTotal } from '@/utils/pricing'

interface PriceBreakdown {
  nights: number
  subtotal: number
  taxAmount: number
  total: number
}

interface CheckoutResult {
  success: boolean
  bookingId?: string
  error?: string
}

export function useCheckout(hotelId: string | undefined, roomTypeId: string | undefined) {
  const { draft, reset } = useBookingStore()
  const user = useAuthStore((s) => s.user)

  const hotelQuery = useQuery({
    queryKey: ['hotel', hotelId],
    queryFn: () => getHotelById(hotelId!),
    enabled: !!hotelId,
  })

  const roomQuery = useQuery({
    queryKey: ['room', roomTypeId],
    queryFn: () => getRoomById(roomTypeId!),
    enabled: !!roomTypeId,
  })

  const hotel = hotelQuery.data
  const room = roomQuery.data

  const priceBreakdown: PriceBreakdown | null = hotel && room && draft.checkIn && draft.checkOut
    ? (() => {
        const nights = calculateNights(draft.checkIn, draft.checkOut)
        const subtotal = calculateSubtotal(room.pricePerNight, nights, draft.rooms)
        const taxAmount = calculateTaxes(subtotal)
        const total = calculateTotal(subtotal, taxAmount, 0)
        return { nights, subtotal, taxAmount, total }
      })()
    : null

  const validateAvailability = useCallback(async (): Promise<string | null> => {
    if (!draft.roomTypeId || !draft.rooms || !draft.adults || !draft.children) {
      return 'اطلاعات رزرو ناقص است.'
    }

    const latestRoom = await getRoomById(draft.roomTypeId)
    if (!latestRoom) {
      return 'اتاق مورد نظر یافت نشد.'
    }
    if (draft.rooms > latestRoom.availableRooms) {
      return latestRoom.availableRooms > 0
        ? `فقط ${latestRoom.availableRooms} اتاق از این نوع موجود است.`
        : 'ظرفیت این نوع اتاق تکمیل شده است.'
    }
    const guestsCount = draft.adults + draft.children
    const capacity = latestRoom.maxGuests * draft.rooms
    if (guestsCount > capacity) {
      return `ظرفیت این تعداد اتاق حداکثر ${capacity} مهمان است.`
    }
    return null
  }, [draft.roomTypeId, draft.rooms, draft.adults, draft.children])

  const processPaymentAndCreateBooking = useCallback(async (values: {
    cardNumber: string
    cardHolder: string
    expiry: string
    cvv: string
  }): Promise<CheckoutResult> => {
    if (!priceBreakdown || !hotel || !room || !draft.guestInfo) {
      return { success: false, error: 'اطلاعات رزرو ناقص است.' }
    }

    const availabilityError = await validateAvailability()
    if (availabilityError) {
      return { success: false, error: availabilityError }
    }

    const result = await mockProcessPayment({
      cardNumber: values.cardNumber,
      cardHolder: values.cardHolder,
      expiry: values.expiry,
      cvv: values.cvv,
      amount: priceBreakdown.total,
    })

    const payment = await savePayment({
      bookingId: '',
      status: result.status,
      cardLast4: result.cardLast4,
      amount: priceBreakdown.total,
      processedAt: new Date().toISOString(),
    })

    if (result.status === 'failed') {
      return { success: false, error: 'پرداخت ناموفق بود. لطفاً اطلاعات کارت را بررسی و دوباره تلاش کنید.' }
    }

    try {
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
          pricePerNight: room.pricePerNight,
          nights: priceBreakdown.nights,
          subtotal: priceBreakdown.subtotal,
          taxRate: 0.1,
          taxAmount: priceBreakdown.taxAmount,
          discount: 0,
          total: priceBreakdown.total,
        },
        status: 'confirmed',
        paymentId: payment.id,
      })

      reset()
      return { success: true, bookingId: booking.id }
    } catch (err) {
      const message =
        err instanceof BookingValidationError
          ? err.message
          : 'ثبت رزرو با مشکل مواجه شد. لطفاً دوباره تلاش کنید.'
      return { success: false, error: message }
    }
  }, [priceBreakdown, hotel, room, draft, user, validateAvailability, reset])

  return {
    hotel,
    room,
    hotelQuery,
    roomQuery,
    priceBreakdown,
    draft,
    validateAvailability,
    processPaymentAndCreateBooking,
    isLoading: hotelQuery.isLoading || roomQuery.isLoading,
    isError: hotelQuery.isError || roomQuery.isError,
  }
}