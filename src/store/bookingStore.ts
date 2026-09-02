// src/store/bookingStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { GuestInfo } from '@/types'

interface BookingDraft {
  hotelId: string | null
  roomTypeId: string | null
  checkIn: string
  checkOut: string
  adults: number
  children: number
  rooms: number
  guestInfo: GuestInfo | null
}

interface BookingStoreState {
  draft: BookingDraft
  setDraft: (updates: Partial<BookingDraft>) => void
  reset: () => void
}

const initialDraft: BookingDraft = {
  hotelId: null,
  roomTypeId: null,
  checkIn: '',
  checkOut: '',
  adults: 2,
  children: 0,
  rooms: 1,
  guestInfo: null,
}

export const useBookingStore = create<BookingStoreState>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (updates) => set((state) => ({ draft: { ...state.draft, ...updates } })),
      reset: () => set({ draft: initialDraft }),
    }),
    { name: 'stayly-booking-draft', storage: createJSONStorage(() => sessionStorage) }
  )
)