// src/hooks/useHotelSearch.ts
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getHotels, type HotelSearchFilters } from '@/services/hotels'
import type { PropertyType } from '@/types'

function parseCsv(value: string | null): string[] {
  return value ? value.split(',').filter(Boolean) : []
}

export function useHotelSearch() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters: HotelSearchFilters = {
    destination: parseCsv(searchParams.get('destination')),
    priceMin: searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : undefined,
    priceMax: searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : undefined,
    starRatings: parseCsv(searchParams.get('starRating')).map(Number),
    minGuestRating: searchParams.get('minGuestRating') ? Number(searchParams.get('minGuestRating')) : undefined,
    propertyTypes: parseCsv(searchParams.get('propertyType')) as PropertyType[],
    amenityIds: parseCsv(searchParams.get('amenities')),
    sort: (searchParams.get('sort') as HotelSearchFilters['sort']) ?? 'recommended',
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    pageSize: 6,
  }

  const query = useQuery({
    queryKey: ['hotels', searchParams.toString()],
    queryFn: () => getHotels(filters),
  })

  function updateParams(updates: Record<string, string | null>, resetPage = true) {
    const next = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') next.delete(key)
      else next.set(key, value)
    })
    if (resetPage) next.set('page', '1')
    setSearchParams(next)
  }

  return { searchParams, filters, updateParams, ...query }
}