// src/pages/Favorites/index.tsx
import { HeartOff } from 'lucide-react'
import { hotels } from '@/data/hotels'
import { useFavorites } from '@/hooks/useFavorites'
import { HotelCard } from '@/components/hotel/HotelCard'
import { FadeIn } from '@/components/common/FadeIn'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Link } from 'react-router-dom'

export function Favorites() {
  const { favoriteIds, isLoading, isError, refetch } = useFavorites()
  const favoriteHotels = hotels.filter((h) => favoriteIds.includes(h.id))

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <FadeIn>
        <h1 className="text-2xl font-bold text-neutral-900">علاقه‌مندی‌های من</h1>
      </FadeIn>

      {isLoading && <p className="mt-6 text-sm text-neutral-600">در حال بارگذاری...</p>}

      {isError && !isLoading && (
        <div className="mt-6">
          <ErrorState
            description="در دریافت علاقه‌مندی‌ها خطایی رخ داد."
            onRetry={() => refetch()}
          />
        </div>
      )}

      {!isLoading && !isError && favoriteHotels.length === 0 && (
        <FadeIn delay={100}>
          <div className="mt-6">
            <EmptyState
              icon={HeartOff}
              title="هنوز هتلی به علاقه‌مندی‌ها اضافه نکرده‌اید"
              description="با کلیک روی آیکون قلب روی هر هتل، آن را اینجا ذخیره کنید."
              action={
                <Link
                  to="/hotels"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-primary-700 px-5 text-sm font-medium text-white transition-colors hover:bg-primary-900"
                >
                  جستجوی اقامتگاه
                </Link>
              }
            />
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