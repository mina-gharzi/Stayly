// src/components/hotel/HotelCard.tsx
import { Link } from 'react-router-dom'
import { Star, MapPin } from 'lucide-react'
import type { Hotel } from '@/types'
import { cities } from '@/data/cities'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatToman } from '@/utils/currency'
import { FavoriteButton } from './FavoriteButton'

const propertyTypeLabels: Record<Hotel['propertyType'], string> = {
  hotel: 'هتل',
  resort: 'استراحتگاه',
  apartment: 'آپارتمان',
  villa: 'ویلا',
  hostel: 'هاستل',
  boutique: 'بوتیک',
}

export function HotelCard({ hotel }: { hotel: Hotel }) {
  const city = cities.find((c) => c.id === hotel.cityId)

  return (
    <Link to={`/hotels/${hotel.id}`}>
      <Card className="overflow-hidden transition hover:shadow-elevated">
        <div className="relative aspect-4/3 w-full overflow-hidden">
          <img
            src={hotel.images[0]?.url}
            alt={hotel.images[0]?.alt ?? hotel.name}
            loading="lazy"
            className="h-full w-full object-cover"
          />
          <Badge variant="primary" className="absolute top-3 inset-e-3 bg-white/90">
            {propertyTypeLabels[hotel.propertyType]}
          </Badge>
          <FavoriteButton hotelId={hotel.id} className="absolute top-3 start-3" />
        </div>
        <div className="flex flex-col gap-2 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-neutral-900">{hotel.name}</h3>
            <div className="flex shrink-0 items-center gap-1 rounded-sm bg-primary-50 px-1.5 py-0.5 text-xs font-medium text-primary-700">
              <Star className="h-3 w-3 fill-primary-700 text-primary-700" aria-hidden />
              {hotel.guestRating.toFixed(1)}
            </div>
          </div>
          <p className="flex items-center gap-1 text-sm text-neutral-600">
            <MapPin className="h-3.5 w-3.5" aria-hidden />
            {city?.name}, {city?.country}
          </p>
          <div className="mt-1 flex items-baseline justify-between">
            <div>
              <span className="text-xs text-neutral-600">شروع از </span>
              <span className="tabular-price text-lg font-semibold text-neutral-900">
                {formatToman(hotel.pricePerNightFrom)}
              </span>
            </div>
            <span className="text-xs text-neutral-600">هر شب</span>
          </div>
        </div>
      </Card>
    </Link>
  )
}