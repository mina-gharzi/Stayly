// src/services/bookings.ts
import type { Booking } from '@/types'
import { bookings as demoBookings } from '../data/bookings'

const CREATED_KEY = 'stayly-created-bookings'
const OVERRIDES_KEY = 'stayly-booking-status-overrides'

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

export function createBooking(booking: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newBooking: Booking = { ...booking, id: generateBookingId(), createdAt: new Date().toISOString() }
      localStorage.setItem(CREATED_KEY, JSON.stringify([...getCreated(), newBooking]))
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

export function getBookingById(id: string): Promise<Booking | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const found = getCreated().find((b) => b.id === id) ?? demoBookings.find((b) => b.id === id)
      resolve(found ? applyOverride(found) : undefined)
    }, 200)
  })
}

// این تابع همچنان Sync هست چون صفحه Confirmation مستقیم بعد از ساخت بدون تاخیر بهش نیاز داره
export function getCreatedBookingById(id: string): Booking | undefined {
  return getCreated().find((b) => b.id === id)
}

export function cancelBooking(bookingId: string): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const overrides = getOverrides()
      overrides[bookingId] = 'cancelled'
      localStorage.setItem(OVERRIDES_KEY, JSON.stringify(overrides))
      resolve()
    }, 400)
  })
}