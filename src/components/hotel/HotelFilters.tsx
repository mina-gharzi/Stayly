// src/components/hotel/HotelFilters.tsx
import { Star } from 'lucide-react'
import { cities } from '@/data/cities'
import { amenities } from '@/data/amenities'
import type { PropertyType } from '@/types'
import { formatToman } from '@/utils/currency'
import type { HotelSearchFilters } from '@/services/hotels'

const propertyTypeLabels: Record<PropertyType, string> = {
  hotel: 'هتل',
  resort: 'استراحتگاه',
  apartment: 'آپارتمان',
  villa: 'ویلا',
  hostel: 'هاستل',
  boutique: 'بوتیک',
}

const PRICE_MAX = 700 // واحد خام؛ معادل ۷۰,۰۰۰,۰۰۰ تومان

interface HotelFiltersProps {
  filters: HotelSearchFilters
  onChange: (updates: Record<string, string | null>) => void
}

export function HotelFilters({ filters, onChange }: HotelFiltersProps) {
  function toggleInCsv(current: string[], value: string, key: string) {
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
    onChange({ [key]: next.length ? next.join(',') : null })
  }

  return (
    <aside className="flex w-full flex-col gap-6 lg:w-72">
      {/* قیمت */}
      <div>
        <h3 className="mb-3 font-semibold text-neutral-900">محدوده قیمت</h3>
        <input
          type="range"
          min={0}
          max={PRICE_MAX}
          step={10}
          value={filters.priceMax ?? PRICE_MAX}
          onChange={(e) => onChange({ priceMax: e.target.value })}
          className="w-full accent-primary-700"
        />
        <p className="mt-1 text-sm text-neutral-600">
          تا سقف {formatToman(filters.priceMax ?? PRICE_MAX)}
        </p>
      </div>

      {/* رتبه ستاره */}
      <div>
        <h3 className="mb-3 font-semibold text-neutral-900">رتبه ستاره</h3>
        <div className="flex flex-col gap-2">
          {[5, 4, 3, 2, 1].map((star) => (
            <label key={star} className="flex items-center gap-2 text-sm text-neutral-800">
              <input
                type="checkbox"
                checked={filters.starRatings?.includes(star) ?? false}
                onChange={() => toggleInCsv((filters.starRatings ?? []).map(String), String(star), 'starRating')}
                className="h-4 w-4 accent-primary-700"
              />
              <span className="flex items-center gap-0.5">
                {Array.from({ length: star }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-warning-500 text-warning-500" aria-hidden />
                ))}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* امتیاز مهمانان */}
      <div>
        <h3 className="mb-3 font-semibold text-neutral-900">امتیاز مهمانان</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'همه', value: null },
            { label: '۷ به بالا', value: '7' },
            { label: '۸ به بالا', value: '8' },
            { label: '۹ به بالا', value: '9' },
          ].map((opt) => (
            <button
              key={opt.label}
              onClick={() => onChange({ minGuestRating: opt.value })}
              className={`rounded-full border px-3 py-1 text-xs ${
                (filters.minGuestRating ? String(filters.minGuestRating) : null) === opt.value
                  ? 'border-primary-700 bg-primary-50 text-primary-700'
                  : 'border-neutral-200 text-neutral-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* نوع اقامتگاه */}
      <div>
        <h3 className="mb-3 font-semibold text-neutral-900">نوع اقامتگاه</h3>
        <div className="flex flex-col gap-2">
          {(Object.keys(propertyTypeLabels) as PropertyType[]).map((type) => (
            <label key={type} className="flex items-center gap-2 text-sm text-neutral-800">
              <input
                type="checkbox"
                checked={filters.propertyTypes?.includes(type) ?? false}
                onChange={() => toggleInCsv(filters.propertyTypes ?? [], type, 'propertyType')}
                className="h-4 w-4 accent-primary-700"
              />
              {propertyTypeLabels[type]}
            </label>
          ))}
        </div>
      </div>

      {/* شهر */}
      <div>
        <h3 className="mb-3 font-semibold text-neutral-900">مقصد</h3>
        <div className="flex flex-col gap-2">
          {cities.map((city) => (
            <label key={city.id} className="flex items-center gap-2 text-sm text-neutral-800">
              <input
                type="checkbox"
                checked={filters.destination?.includes(city.id) ?? false}
                onChange={() => toggleInCsv(filters.destination ?? [], city.id, 'destination')}
                className="h-4 w-4 accent-primary-700"
              />
              {city.name}
            </label>
          ))}
        </div>
      </div>

      {/* امکانات */}
      <div>
        <h3 className="mb-3 font-semibold text-neutral-900">امکانات</h3>
        <div className="flex flex-col gap-2">
          {amenities.map((amenity) => (
            <label key={amenity.id} className="flex items-center gap-2 text-sm text-neutral-800">
              <input
                type="checkbox"
                checked={filters.amenityIds?.includes(amenity.id) ?? false}
                onChange={() => toggleInCsv(filters.amenityIds ?? [], amenity.id, 'amenities')}
                className="h-4 w-4 accent-primary-700"
              />
              {amenity.name}
            </label>
          ))}
        </div>
      </div>
    </aside>
  )
}