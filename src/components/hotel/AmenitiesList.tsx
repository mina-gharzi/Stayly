// src/components/hotel/AmenitiesList.tsx
import { amenities as allAmenities } from '@/data/amenities'
import { amenityIconMap } from '@/utils/amenityIcons'

export function AmenitiesList({ amenityIds }: { amenityIds: string[] }) {
  const items = allAmenities.filter((a) => amenityIds.includes(a.id))

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {items.map((amenity) => {
        const Icon = amenityIconMap[amenity.icon]
        return (
          <div key={amenity.id} className="flex items-center gap-2 text-sm text-neutral-800">
            {Icon && <Icon className="h-4 w-4 text-primary-700" aria-hidden />}
            {amenity.name}
          </div>
        )
      })}
    </div>
  )
}