// src/services/rooms.ts
import { roomTypes } from '@/data/rooms'
import type { RoomType } from '@/types'

export function getRoomsByHotel(hotelId: string): Promise<RoomType[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(roomTypes.filter((r) => r.hotelId === hotelId)), 300)
  })
}
export function getRoomById(roomId: string): Promise<RoomType | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(roomTypes.find((r) => r.id === roomId)), 200)
  })
}