// src/components/home/FeaturedHotels.tsx
import { hotels } from '@/data/hotels'
import { HotelCard } from '@/components/hotel/HotelCard'

export function FeaturedHotels() {
  const featured = [...hotels].sort((a, b) => b.guestRating - a.guestRating).slice(0, 6)

  return (
    <section className="mx-auto max-w-7xl px-4 pb-16">
      <h2 className="text-2xl font-bold text-neutral-900">هتل‌های ویژه</h2>
      <p className="mt-1 text-neutral-600">برترین اقامتگاه‌ها بر اساس امتیاز مهمانان</p>
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((hotel) => (
          <HotelCard key={hotel.id} hotel={hotel} />
        ))}
      </div>
    </section>
  )
}