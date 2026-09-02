// src/pages/Favorites/index.tsx
import { HeartOff } from 'lucide-react'
import { getHotelsByIdsSync } from '@/services/hotels'
import { useFavorites } from '@/hooks/useFavorites'
import { HotelCard } from '@/components/hotel/HotelCard'
import { FadeIn } from '@/components/common/FadeIn'

export function Favorites() {
  const { favoriteIds, isLoading } = useFavorites()
  const favoriteHotels = getHotelsByIdsSync(favoriteIds)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <FadeIn>
        <h1 className="text-2xl font-bold text-neutral-900">علاقه‌مندی‌های من</h1>
      </FadeIn>

      {isLoading && <p className="mt-6 text-sm text-neutral-600">در حال بارگذاری...</p>}

      {!isLoading && favoriteHotels.length === 0 && (
        <FadeIn delay={100}>
          <div className="mt-16 flex flex-col items-center gap-2 text-center">
            <HeartOff className="h-8 w-8 text-neutral-400" aria-hidden />
            <p className="font-medium text-neutral-900">هنوز هتلی به علاقه‌مندی‌ها اضافه نکرده‌اید</p>
            <p className="text-sm text-neutral-600">با کلیک روی آیکون قلب روی هر هتل، آن را اینجا ذخیره کنید.</p>
          </div>
        </FadeIn>
      )}

      {favoriteHotels.length > 0 && (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {favoriteHotels.map((hotel, index) => (
            <FadeIn key={hotel.id} delay={index * 80} direction="up">
              <HotelCard hotel={hotel} />
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  )
}