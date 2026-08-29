// src/pages/Home/index.tsx
import { Hero } from '@/components/home/Hero'
import { PopularDestinations } from '@/components/home/PopularDestinations'
import { FeaturedHotels } from '@/components/home/FeaturedHotels'

export function Home() {
  return (
    <div>
      <Hero />
      <PopularDestinations />
      <FeaturedHotels />
    </div>
  )
}