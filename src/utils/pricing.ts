// src/utils/pricing.ts
export const TAX_RATE = 0.1 // نرخ مالیات ثابت مرکزی

export function calculateNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime()
  return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)))
}

// قانون ۹: قیمت باید بر اساس تعداد شب *و* تعداد اتاق محاسبه بشه — نه فقط شب
export function calculateSubtotal(pricePerNight: number, nights: number, rooms: number = 1): number {
  return pricePerNight * nights * rooms
}

export function calculateTaxes(subtotal: number, taxRate: number = TAX_RATE): number {
  return Math.round(subtotal * taxRate * 100) / 100
}

export function calculateDiscount(subtotal: number, couponCode?: string): number {
  if (couponCode?.toUpperCase() === 'STAYLY10') {
    return Math.round(subtotal * 0.1 * 100) / 100
  }
  return 0
}

export function calculateTotal(subtotal: number, tax: number, discount: number): number {
  return Math.round((subtotal + tax - discount) * 100) / 100
}