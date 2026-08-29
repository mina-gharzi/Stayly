// src/pages/MyBookings/index.tsx
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CalendarX } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { getBookingsByUser } from '@/services/bookings'
import { BookingCard } from '@/components/booking/BookingCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/utils/cn'
import type { Booking } from '@/types'

const tabs: { key: string; label: string; statuses: Booking['status'][] }[] = [
  { key: 'upcoming', label: 'در پیش رو', statuses: ['pending', 'confirmed'] },
  { key: 'completed', label: 'انجام‌شده', statuses: ['completed'] },
  { key: 'cancelled', label: 'لغوشده', statuses: ['cancelled'] },
]

export function MyBookings() {
  const user = useAuthStore((s) => s.user)
  const [activeTab, setActiveTab] = useState('upcoming')

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings', user?.id],
    queryFn: () => getBookingsByUser(user!.id),
    enabled: !!user,
  })

  const currentTab = tabs.find((t) => t.key === activeTab)!
  const filtered = (bookings ?? []).filter((b) => currentTab.statuses.includes(b.status))

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold text-neutral-900">رزروهای من</h1>

      <div className="mt-6 flex gap-2 border-b border-neutral-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'border-b-2 px-4 py-2 text-sm font-medium transition',
              activeTab === tab.key ? 'border-primary-700 text-primary-700' : 'border-transparent text-neutral-600'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {isLoading && Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-lg" />)}

        {!isLoading && filtered.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <CalendarX className="h-8 w-8 text-neutral-400" aria-hidden />
            <p className="font-medium text-neutral-900">رزروی یافت نشد</p>
            <p className="text-sm text-neutral-600">شروع به کاوش هتل‌ها کنید.</p>
          </div>
        )}

        {!isLoading && filtered.map((booking) => <BookingCard key={booking.id} booking={booking} />)}
      </div>
    </div>
  )
}