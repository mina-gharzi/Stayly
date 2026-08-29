// src/types/common.ts
export type PropertyType =
  | 'hotel'
  | 'resort'
  | 'apartment'
  | 'villa'
  | 'hostel'
  | 'boutique'

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'

export interface City {
  id: string
  name: string
  country: string
  image: string
}