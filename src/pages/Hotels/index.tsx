// src/pages/Hotels/index.tsx
import { SearchX, AlertTriangle } from 'lucide-react'
import { useHotelSearch } from '@/hooks/useHotelSearch'
import { HotelFilters } from '@/components/hotel/HotelFilters'
import { HotelSort } from '@/components/hotel/HotelSort'
import { HotelCard } from '@/components/hotel/HotelCard'
import { HotelCardSkeleton } from '@/components/hotel/HotelCardSkeleton'
import { Pagination } from '@/components/ui/Pagination'
import { Button } from '@/components/ui/Button'
import { cities } from '@/data/cities'

export function Hotels() {
  const { filters, updateParams, data, isLoading, isError, refetch } = useHotelSearch()

  const destinationLabel =
    filters.destination?.length === 1
      ? cities.find((c) => c.id === filters.destination![0])?.name
      : filters.destination?.length
        ? `${filters.destination.length} مقصد`
        : 'همه مقصدها'

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">جستجوی هتل در {destinationLabel}</h1>
        {!isLoading && !isError && (
          <p className="mt-1 text-sm text-neutral-600">{data?.total ?? 0} اقامتگاه پیدا شد</p>
        )}
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <HotelFilters filters={filters} onChange={updateParams} />

        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-neutral-600">مرتب‌سازی بر اساس</span>
            <HotelSort value={filters.sort ?? 'recommended'} onChange={updateParams} />
          </div>

          {isLoading && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <HotelCardSkeleton key={i} />
              ))}
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center gap-3 rounded-lg border border-neutral-200 py-16 text-center">
              <AlertTriangle className="h-8 w-8 text-error-500" aria-hidden />
              <p className="font-medium text-neutral-900">مشکلی پیش آمد</p>
              <p className="text-sm text-neutral-600">بارگذاری هتل‌ها با خطا مواجه شد.</p>
              <Button variant="outline" onClick={() => refetch()}>تلاش مجدد</Button>
            </div>
          )}

          {!isLoading && !isError && data?.data.length === 0 && (
            <div className="flex flex-col items-center gap-2 rounded-lg border border-neutral-200 py-16 text-center">
              <SearchX className="h-8 w-8 text-neutral-400" aria-hidden />
              <p className="font-medium text-neutral-900">هتلی یافت نشد</p>
              <p className="text-sm text-neutral-600">جستجو یا فیلترهای خود را تغییر دهید.</p>
            </div>
          )}

          {!isLoading && !isError && data && data.data.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {data.data.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
              </div>
              <div className="mt-8">
                <Pagination
                  page={data.page}
                  totalPages={data.totalPages}
                  onChange={(p) => updateParams({ page: String(p) }, false)}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}