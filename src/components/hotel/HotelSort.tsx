// src/components/hotel/HotelSort.tsx
import type { HotelSearchFilters } from '@/services/hotels'

const options: { value: NonNullable<HotelSearchFilters['sort']>; label: string }[] = [
  { value: 'recommended', label: 'پیشنهادی' },
  { value: 'price-asc', label: 'قیمت: کم به زیاد' },
  { value: 'price-desc', label: 'قیمت: زیاد به کم' },
  { value: 'rating-desc', label: 'بیشترین امتیاز' },
]

interface HotelSortProps {
  value: string
  onChange: (updates: Record<string, string | null>) => void
}

export function HotelSort({ value, onChange }: HotelSortProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange({ sort: e.target.value })}
      className="h-10 rounded-md border border-neutral-200 px-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  )
}