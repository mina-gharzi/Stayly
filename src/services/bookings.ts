// src/services/bookings.ts
import type { Booking, BookingStatus } from '@/types'
import { bookings as demoBookings } from '../data/bookings'
import { getRoomByIdSync, reserveRoomAvailability, releaseRoomAvailability } from './rooms'
import { createCancellation } from './cancellations'
import { isValidDateRange, exceedsGuestCapacity, exceedsRoomAvailability, getGuestCapacity } from '@/utils/bookingRules'

const CREATED_KEY = 'stayly-created-bookings'
const OVERRIDES_KEY = 'stayly-booking-status-overrides'

// وضعیت‌هایی که رزرو در اون‌ها قابل لغو هست — قانون ۶
const CANCELLABLE_STATUSES: BookingStatus[] = ['pending', 'confirmed']

// خطای اعتبارسنجی رزرو — برای تشخیص از خطاهای غیرمنتظره در سمت مصرف‌کننده (مثلاً Checkout)
export class BookingValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'BookingValidationError'
  }
}

// خطای دسترسی — وقتی کاربری تلاش می‌کنه رزرو کاربر دیگه‌ای رو دستکاری کنه — قانون ۸
export class BookingAccessError extends Error {
  constructor(message: string = 'شما اجازه دسترسی به این رزرو را ندارید.') {
    super(message)
    this.name = 'BookingAccessError'
  }
}

function generateBookingId(): string {
  return `STY-${Math.floor(10000 + Math.random() * 90000)}`
}

function getCreated(): Booking[] {
  return JSON.parse(localStorage.getItem(CREATED_KEY) ?? '[]')
}

function getOverrides(): Record<string, Booking['status']> {
  return JSON.parse(localStorage.getItem(OVERRIDES_KEY) ?? '{}')
}

function applyOverride(booking: Booking): Booking {
  const status = getOverrides()[booking.id]
  return status ? { ...booking, status } : booking
}

// نسخه‌ی Sync پیدا کردن رزرو (با وضعیت به‌روز) — برای اعتبارسنجی‌های داخلی این ماژول
function getBookingSync(bookingId: string): Booking | undefined {
  const found = getCreated().find((b) => b.id === bookingId) ?? demoBookings.find((b) => b.id === bookingId)
  return found ? applyOverride(found) : undefined
}

// قوانین ۱، ۳/۴ و ۵: قبل از ثبت هر رزرو، تاریخ، موجودی اتاق و ظرفیت مهمانان باید در «سرویس»
// کنترل بشه — نه فقط در UI — چون UI به‌تنهایی قابل دور زدنه (مثلاً با رفتن مستقیم به /checkout)
function validateBookingRequest(booking: Omit<Booking, 'id' | 'createdAt'>): void {
  // قانون ۵: اعتبارسنجی تاریخ در Business Logic
  if (!booking.checkIn || !booking.checkOut) {
    throw new BookingValidationError('تاریخ ورود و خروج الزامی است.')
  }
  if (!isValidDateRange(booking.checkIn, booking.checkOut)) {
    throw new BookingValidationError('تاریخ خروج باید بعد از تاریخ ورود باشد.')
  }

  const room = getRoomByIdSync(booking.roomTypeId)
  if (!room) {
    throw new BookingValidationError('اتاق مورد نظر یافت نشد.')
  }

  // قانون ۱: موجودی اتاق باید کنترل بشه
  if (exceedsRoomAvailability(booking.rooms, room.availableRooms)) {
    throw new BookingValidationError(
      room.availableRooms > 0
        ? `فقط ${room.availableRooms} اتاق از این نوع موجود است.`
        : 'ظرفیت این نوع اتاق تکمیل شده است.'
    )
  }

  // قوانین ۳ و ۴: ظرفیت بر اساس تعداد مهمان *و* تعداد اتاق
  if (exceedsGuestCapacity(booking.adults, booking.children, room.maxGuests, booking.rooms)) {
    throw new BookingValidationError(
      `ظرفیت این تعداد اتاق حداکثر ${getGuestCapacity(room.maxGuests, booking.rooms)} مهمان است.`
    )
  }
}

export function createBooking(booking: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        validateBookingRequest(booking)
      } catch (err) {
        reject(err)
        return
      }

      const newBooking: Booking = { ...booking, id: generateBookingId(), createdAt: new Date().toISOString() }
      localStorage.setItem(CREATED_KEY, JSON.stringify([...getCreated(), newBooking]))
      // قانون ۲: بعد از رزرو موفق، موجودی اتاق در Mock API به‌روزرسانی می‌شه
      reserveRoomAvailability(booking.roomTypeId, booking.rooms)
      resolve(newBooking)
    }, 300)
  })
}

export function getBookingsByUser(userId: string): Promise<Booking[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const all = [...getCreated().filter((b) => b.userId === userId), ...demoBookings.filter((b) => b.userId === userId)]
      resolve(all.map(applyOverride).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    }, 300)
  })
}

// قانون ۸: کنترل مالکیت — اگه requestingUserId داده بشه و با صاحب رزرو یکی نباشه،
// چیزی برنمی‌گرده (انگار رزرو اصلاً وجود نداره) تا اطلاعات کاربر دیگه لو نره
export function getBookingById(id: string, requestingUserId?: string): Promise<Booking | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const found = getCreated().find((b) => b.id === id) ?? demoBookings.find((b) => b.id === id)
      if (!found) {
        resolve(undefined)
        return
      }
      if (requestingUserId !== undefined && found.userId !== requestingUserId) {
        resolve(undefined)
        return
      }
      resolve(applyOverride(found))
    }, 200)
  })
}

// قوانین ۶ و ۸: فقط رزروهای pending/confirmed قابل لغو هستن، و فقط توسط صاحب رزرو
export function cancelBooking(bookingId: string, requestingUserId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const booking = getBookingSync(bookingId)
      if (!booking) {
        reject(new BookingValidationError('رزرو مورد نظر یافت نشد.'))
        return
      }

      if (booking.userId !== requestingUserId) {
        reject(new BookingAccessError('شما اجازه لغو این رزرو را ندارید.'))
        return
      }

      if (!CANCELLABLE_STATUSES.includes(booking.status)) {
        const message =
          booking.status === 'cancelled'
            ? 'این رزرو قبلاً لغو شده است.'
            : booking.status === 'completed'
              ? 'رزروهای انجام‌شده قابل لغو نیستند.'
              : 'این رزرو قابل لغو نیست.'
        reject(new BookingValidationError(message))
        return
      }

      const overrides = getOverrides()
      overrides[bookingId] = 'cancelled'
      localStorage.setItem(OVERRIDES_KEY, JSON.stringify(overrides))

      // موجودی اتاقی که کنسل شده باید آزاد بشه تا بقیه بتونن رزروش کنن
      releaseRoomAvailability(booking.roomTypeId, booking.rooms)

      // قانون ۷: رکورد رسمی کنسلی/استرداد در Data Layer ذخیره می‌شه (نه فقط پیام UI)
      createCancellation(booking.id)

      resolve()
    }, 400)
  })
}
