// src/types/booking.ts
import type { BookingStatus, PaymentStatus } from './common'

export interface GuestInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  specialRequests?: string
}

export interface PriceBreakdown {
  pricePerNight: number
  nights: number
  subtotal: number
  taxRate: number
  taxAmount: number
  discount: number
  total: number
}

export interface Payment {
  id: string
  bookingId: string
  status: PaymentStatus
  cardLast4: string
  amount: number
  processedAt: string
}

export interface Cancellation {
  id: string
  bookingId: string
  cancelledAt: string
  refundStatus: 'initiated' | 'completed'
}

export interface Booking {
  id: string               // مثل 'STY-48291'
  userId: string
  hotelId: string
  roomTypeId: string
  checkIn: string           // ISO date
  checkOut: string
  adults: number
  children: number
  rooms: number
  guestInfo: GuestInfo
  priceBreakdown: PriceBreakdown
  status: BookingStatus
  paymentId: string
  createdAt: string
}