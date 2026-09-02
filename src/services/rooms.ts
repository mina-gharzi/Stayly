// src/services/rooms.ts
import { roomTypes } from '@/data/rooms'
import { TAX_RATE, calculateNights, calculateSubtotal, calculateTaxes, calculateDiscount, calculateTotal } from '@/utils/pricing'
import type { RoomType, PriceBreakdown } from '@/types'

// کلید ذخیره‌سازی موجودی مصرف‌شده اتاق‌ها در Mock API (شبیه‌سازی به‌روزرسانی موجودی بعد از رزرو)
const AVAILABILITY_KEY = 'stayly-room-availability-overrides'

function getAvailabilityOverrides(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(AVAILABILITY_KEY) ?? '{}')
  } catch {
    return {}
  }
}

function setAvailabilityOverrides(overrides: Record<string, number>) {
  localStorage.setItem(AVAILABILITY_KEY, JSON.stringify(overrides))
}

// موجودی واقعیِ اتاق = موجودی پایه در data/rooms.ts منهای اتاق‌هایی که از طریق اپ رزرو شدن
function applyAvailabilityOverride(room: RoomType): RoomType {
  const consumed = getAvailabilityOverrides()[room.id] ?? 0
  return { ...room, availableRooms: Math.max(0, room.availableRooms - consumed) }
}

export function getRoomsByHotel(hotelId: string): Promise<RoomType[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(roomTypes.filter((r) => r.hotelId === hotelId).map(applyAvailabilityOverride))
    }, 300)
  })
}

export function getRoomById(roomId: string): Promise<RoomType | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const room = roomTypes.find((r) => r.id === roomId)
      resolve(room ? applyAvailabilityOverride(room) : undefined)
    }, 200)
  })
}

// نسخه Sync — برای اعتبارسنجی موجودی لحظه‌ی ساخت رزرو در services/bookings.ts
export function getRoomByIdSync(roomId: string): RoomType | undefined {
  const room = roomTypes.find((r) => r.id === roomId)
  return room ? applyAvailabilityOverride(room) : undefined
}

// مرجعیت قیمت‌گذاری — قانون: Service نباید به priceBreakdownِ ارسالیِ Client اعتماد کنه.
// این تابع قیمت واقعی رزرو رو مستقیم از منبع معتبر (قیمت اتاق + قوانین Pricing) دوباره
// محاسبه می‌کنه تا مبلغ پرداخت همیشه درست باشه — نه چیزی که فرم Checkout فرستاده.
export function calculateRoomBookingTotal(input: {
  roomTypeId: string
  checkIn: string
  checkOut: string
  rooms: number
}): PriceBreakdown {
  const room = getRoomByIdSync(input.roomTypeId)
  if (!room) {
    return {
      pricePerNight: 0,
      nights: 0,
      subtotal: 0,
      taxRate: 0,
      taxAmount: 0,
      discount: 0,
      total: 0,
    }
  }
  const nights = calculateNights(input.checkIn, input.checkOut)
  const subtotal = calculateSubtotal(room.pricePerNight, nights, input.rooms)
  const taxAmount = calculateTaxes(subtotal)
  const discount = calculateDiscount(subtotal)
  const taxRate = TAX_RATE
  const total = calculateTotal(subtotal, taxAmount, discount)

  return { pricePerNight: room.pricePerNight, nights, subtotal, taxRate, taxAmount, discount, total }
}

// کم‌کردن موجودی بعد از رزرو موفق (شبیه‌سازی به‌روزرسانی Mock API)
export function reserveRoomAvailability(roomId: string, rooms: number): void {
  const overrides = getAvailabilityOverrides()
  overrides[roomId] = (overrides[roomId] ?? 0) + rooms
  setAvailabilityOverrides(overrides)
}

// برگردوندن موجودی بعد از کنسل شدن رزرو
export function releaseRoomAvailability(roomId: string, rooms: number): void {
  const overrides = getAvailabilityOverrides()
  overrides[roomId] = Math.max(0, (overrides[roomId] ?? 0) - rooms)
  setAvailabilityOverrides(overrides)
}
