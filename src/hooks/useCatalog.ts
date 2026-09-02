// src/hooks/useCatalog.ts
// هوک‌های React Query برای داده‌های کاتالوگ که از طریق سرویس (not data/ مستقیم) می‌آن.
import { useQuery } from '@tanstack/react-query'
import { getHotels, getHotelsByIds, getHotelCountsByType } from '@/services/hotels'
import { getCatalogStats } from '@/services/catalog'

export function useFeaturedHotels() {
  return useQuery({
    queryKey: ['featured-hotels'],
    queryFn: () => getHotels({ sort: 'rating-desc', pageSize: 6 }),
  })
}

export function useHotelCountsByType() {
  return useQuery({
    queryKey: ['hotel-counts-by-type'],
    queryFn: () => getHotelCountsByType(),
  })
}

export function useCatalogStats() {
  return useQuery({
    queryKey: ['catalog-stats'],
    queryFn: () => getCatalogStats(),
  })
}

export function useHotelsByIds(ids: string[], enabled = true) {
  return useQuery({
    queryKey: ['hotels-by-ids', ids],
    queryFn: () => getHotelsByIds(ids),
    enabled: enabled && ids.length > 0,
  })
}
