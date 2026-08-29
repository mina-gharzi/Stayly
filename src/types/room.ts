// src/types/room.ts
export interface RoomType {
  id: string
  hotelId: string
  name: string           // 'Deluxe Room'
  description: string
  maxGuests: number
  bedType: string        // 'King', 'Twin', 'Queen'
  bedCount: number
  size: number            // متر مربع
  view: string            // 'Sea View', 'City View'
  pricePerNight: number
  amenityIds: string[]
  images: string[]
  totalRooms: number
  availableRooms: number
}