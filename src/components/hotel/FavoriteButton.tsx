// src/components/hotel/FavoriteButton.tsx
import type { MouseEvent } from 'react'
import { Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useFavorites } from '@/hooks/useFavorites'
import { cn } from '@/utils/cn'

export function FavoriteButton({ hotelId, className }: { hotelId: string; className?: string }) {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const { isFavorite, toggle } = useFavorites()
  const active = isFavorite(hotelId)

  function handleClick(e: MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      navigate('/login')
      return
    }
    toggle(hotelId)
  }

  return (
    <button
      onClick={handleClick}
      aria-label={active ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
      aria-pressed={active}
      className={cn('flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-card transition hover:bg-white', className)}
    >
      <Heart className={cn('h-4 w-4', active ? 'fill-error-500 text-error-500' : 'text-neutral-600')} aria-hidden />
    </button>
  )
}