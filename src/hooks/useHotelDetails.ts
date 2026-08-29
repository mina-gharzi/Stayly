// src/hooks/useHotelDetails.ts
import { useQuery } from '@tanstack/react-query'
import { getHotelById } from '@/services/hotels'
import { getRoomsByHotel } from '../services/rooms'
import { getReviewsByHotel } from '@/services/reviews'

export function useHotelDetails(hotelId: string) {
  const hotelQuery = useQuery({ queryKey: ['hotel', hotelId], queryFn: () => getHotelById(hotelId) })
  const roomsQuery = useQuery({ queryKey: ['rooms', hotelId], queryFn: () => getRoomsByHotel(hotelId) })
  const reviewsQuery = useQuery({ queryKey: ['reviews', hotelId], queryFn: () => getReviewsByHotel(hotelId) })

  return {
    hotel: hotelQuery.data,
    rooms: roomsQuery.data ?? [],
    reviews: reviewsQuery.data ?? [],
    isLoading: hotelQuery.isLoading || roomsQuery.isLoading || reviewsQuery.isLoading,
    isError: hotelQuery.isError || roomsQuery.isError || reviewsQuery.isError,
    refetch: () => {
      hotelQuery.refetch()
      roomsQuery.refetch()
      reviewsQuery.refetch()
    },
  }
}