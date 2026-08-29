// src/components/hotel/ImageGallery.tsx
import { useState } from 'react'
import { cn } from '@/utils/cn'
import type { HotelImage } from '@/types'

export function ImageGallery({ images }: { images: HotelImage[] }) {
  const [active, setActive] = useState(0)
  if (images.length === 0) return null

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-4 sm:grid-rows-2">
      <div className="sm:col-span-2 sm:row-span-2">
        <img
          src={images[active].url}
          alt={images[active].alt}
          className="h-64 w-full rounded-lg object-cover sm:h-full"
        />
      </div>
      {images.slice(0, 4).map((img, i) => (
        <button
          key={img.id}
          onClick={() => setActive(i)}
          className={cn(
            'hidden overflow-hidden rounded-lg sm:block',
            active === i && 'ring-2 ring-primary-700'
          )}
        >
          <img src={img.url} alt={img.alt} loading="lazy" className="h-full w-full object-cover" />
        </button>
      ))}
    </div>
  )
}