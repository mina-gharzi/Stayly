// src/hooks/useFavorites.ts
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { getFavoriteHotelIds, toggleFavorite } from '@/services/favorites'

export function useFavorites() {
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()
  const queryKey = ['favorite-ids', user?.id]

  const query = useQuery({
    queryKey,
    queryFn: () => getFavoriteHotelIds(user!.id),
    enabled: !!user,
  })

  async function toggle(hotelId: string) {
    if (!user) return
    const next = await toggleFavorite(user.id, hotelId)
    queryClient.setQueryData(queryKey, next)
  }

  const favoriteIds = query.data ?? []

  return {
    favoriteIds,
    isFavorite: (hotelId: string) => favoriteIds.includes(hotelId),
    toggle,
    isLoading: query.isLoading,
  }
}