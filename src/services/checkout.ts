// src/services/checkout.ts
// قانون ۱۲: ارکستریشن «پرداخت → ذخیره Payment → ثبت Booking» که قبلاً مستقیم و به‌صورت
// تکه‌تکه داخل pages/Checkout نوشته شده بود، الان یک‌جا و قابل‌تست‌شدن مستقل از UI هست.
// قانون ۱۶: این نمونه‌ای از تمرکز Business Logic در Service به‌جای پخش‌شدن در Page هاست.
import type { Booking, GuestInfo, Payment, PriceBreakdown } from '@/types'
import { processPayment, savePayment, updatePaymentBookingId } from './payments'
import { createBooking, BookingValidationError } from './bookings'

export class PaymentFailedError extends Error {
  constructor(message: string = 'پرداخت ناموفق بود. لطفاً اطلاعات کارت را بررسی و دوباره تلاش کنید.') {
    super(message)
    this.name = 'PaymentFailedError'
  }
}

// اطلاعات کارت به‌تنهایی (بدون amount) — amount از priceBreakdown.total محاسبه می‌شه،
// نه از ورودی UI، تا مبلغ همیشه از منبع درست (Pricing) بیاد نه از فرم
export interface CardDetails {
  cardNumber: string
  cardHolder: string
  expiry: string
  cvv: string
}

export interface SubmitBookingPaymentInput {
  userId: string
  hotelId: string
  roomTypeId: string
  checkIn: string
  checkOut: string
  adults: number
  children: number
  rooms: number
  guestInfo: GuestInfo
  priceBreakdown: PriceBreakdown
  card: CardDetails
}

export interface SubmitBookingPaymentResult {
  booking: Booking
  payment: Payment
}

// مرحله‌ی نهایی Checkout — تنها نقطه‌ی ورودی برای «پرداخت کن و رزرو رو ثبت کن».
// دوباره پرتاب می‌کنه: PaymentFailedError (پرداخت رد شد) یا BookingValidationError
// (سرویس createBooking یه چیزی رو رد کرد — مثلاً موجودی هم‌زمان تموم شده بود)
export async function submitBookingPayment(
  input: SubmitBookingPaymentInput
): Promise<SubmitBookingPaymentResult> {
  const result = await processPayment({
    cardNumber: input.card.cardNumber,
    cardHolder: input.card.cardHolder,
    expiry: input.card.expiry,
    cvv: input.card.cvv,
    amount: input.priceBreakdown.total,
  })

  // رکورد Payment همیشه ذخیره می‌شه (چه موفق چه ناموفق) — برای تاریخچه‌ی پرداخت
  const payment = await savePayment({
    bookingId: '',
    status: result.status,
    cardLast4: result.cardLast4,
    amount: input.priceBreakdown.total,
    processedAt: new Date().toISOString(),
  })

  if (result.status === 'failed') {
    throw new PaymentFailedError()
  }

  const booking = await createBooking({
    userId: input.userId,
    hotelId: input.hotelId,
    roomTypeId: input.roomTypeId,
    checkIn: input.checkIn,
    checkOut: input.checkOut,
    adults: input.adults,
    children: input.children,
    rooms: input.rooms,
    guestInfo: input.guestInfo,
    priceBreakdown: input.priceBreakdown,
    status: 'confirmed',
    paymentId: payment.id,
  })

  // حالا که booking.id مشخصه، رکورد Payment رو بهش وصل می‌کنیم
  await updatePaymentBookingId(payment.id, booking.id)

  return { booking, payment }
}

export { BookingValidationError }
