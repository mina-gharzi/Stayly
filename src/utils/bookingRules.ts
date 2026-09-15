// src/utils/bookingRules.ts
// قوانین کسب‌وکار مربوط به رزرو که هم توسط UI (برای فیدبک فوری به کاربر) و هم توسط
// services/bookings.ts (به‌عنوان منبع حقیقتِ نهایی، غیرقابل‌دور‌زدن) استفاده می‌شن — قانون ۱۶:
// تمرکز Business Logic در یک جا، به‌جای پخش‌شدن و تکرار توی چند Page.

/** آیا بازه‌ی [checkIn, checkOut) یک بازه‌ی معتبره؟ (هر دو موجود، تاریخ سالم، خروج بعد از ورود) */
export function isValidDateRange(checkIn: string, checkOut: string): boolean {
  if (!checkIn || !checkOut) return false
  const inDate = new Date(checkIn)
  const outDate = new Date(checkOut)
  if (Number.isNaN(inDate.getTime()) || Number.isNaN(outDate.getTime())) return false
  return outDate.getTime() > inDate.getTime()
}

/** آیا تاریخ ورود در گذشته است؟ (رزرو فقط برای امروز یا آینده مجاز است) */
export function isDateInPast(date: string): boolean {
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return d.getTime() < today.getTime()
}

/** ظرفیت مجاز مهمان برای یک نوع اتاق با تعداد اتاق مشخص — قانون ۴: maxGuests × rooms */
export function getGuestCapacity(maxGuestsPerRoom: number, rooms: number): number {
  return maxGuestsPerRoom * rooms
}

/** آیا تعداد مهمانان از ظرفیت مجاز بیشتره؟ — قانون ۳ و ۴ */
export function exceedsGuestCapacity(
  adults: number,
  children: number,
  maxGuestsPerRoom: number,
  rooms: number
): boolean {
  return adults + children > getGuestCapacity(maxGuestsPerRoom, rooms)
}

/** آیا تعداد اتاق درخواستی از موجودی واقعی بیشتره؟ — قانون ۱ */
export function exceedsRoomAvailability(requestedRooms: number, availableRooms: number): boolean {
  return requestedRooms > availableRooms
}
