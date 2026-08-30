// src/components/home/PopularProperties.tsx
import { Link } from 'react-router-dom'
import { Building2, Palmtree, Home as HomeIcon, Warehouse, BedSingle, Sparkles } from 'lucide-react'
import { hotels } from '@/data/hotels'
import type { PropertyType } from '@/types'

const propertyTypeConfig: Record<PropertyType, { label: string; icon: typeof Building2 }> = {
  hotel: { label: 'هتل', icon: Building2 },
  resort: { label: 'استراحتگاه', icon: Palmtree },
  apartment: { label: 'آپارتمان', icon: HomeIcon },
  villa: { label: 'ویلا', icon: Warehouse },
  hostel: { label: 'هاستل', icon: BedSingle },
  boutique: { label: 'بوتیک', icon: Sparkles },
}

export function PopularProperties() {
  const types = Object.keys(propertyTypeConfig) as PropertyType[]

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="text-center">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-primary-600">Property Types</p>
        <h2 className="mt-2 text-2xl font-bold text-neutral-900 sm:text-3xl">جستجو بر اساس نوع اقامتگاه</h2>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {types.map((type) => {
          const config = propertyTypeConfig[type]
          const count = hotels.filter((h) => h.propertyType === type).length
          const Icon = config.icon
          return (
            <Link
              key={type}
              to={`/hotels?propertyType=${type}`}
              className="group flex flex-col items-center gap-3 rounded-lg border border-neutral-200 p-5 text-center transition hover:border-primary-300 hover:shadow-card"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-700 transition group-hover:bg-primary-700 group-hover:text-white">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-semibold text-neutral-900">{config.label}</p>
                <p className="text-xs text-neutral-500">{count} اقامتگاه</p>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}