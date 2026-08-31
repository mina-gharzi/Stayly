// src/pages/Hotels/index.tsx
import { SearchX, AlertTriangle } from "lucide-react";
import { useHotelSearch } from "@/hooks/useHotelSearch";
import { HotelFilters } from "@/components/hotel/HotelFilters";
import { HotelSort } from "@/components/hotel/HotelSort";
import { HotelCard } from "@/components/hotel/HotelCard";
import { HotelCardSkeleton } from "@/components/hotel/HotelCardSkeleton";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/common/FadeIn";
import { cities } from "@/data/cities";

export function Hotels() {
  const { filters, updateParams, data, isLoading, isError, refetch } =
    useHotelSearch();

  const destinationLabel =
    filters.destination?.length === 1
      ? cities.find((c) => c.id === filters.destination![0])?.name
      : filters.destination?.length
        ? `${filters.destination.length} مقصد`
        : "همه مقصدها";

  return (
    <div className="min-h-screen bg-neutral-100/60">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <HotelFilters filters={filters} onChange={updateParams} />

          <div className="flex-1">
            {/* هدر نتایج — مثل Tripster */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm text-neutral-600">
                  {isLoading
                    ? "در حال جستجو..."
                    : `${data?.total ?? 0} اقامتگاه پیدا شد`}
                </p>
                <h1 className="mt-1 text-xl font-bold text-primary-600 sm:text-2xl">
                  هتلها در{" "}
                  <span className="text-primary-600">{destinationLabel}</span>
                </h1>
              </div>
              <HotelSort
                value={filters.sort ?? "recommended"}
                onChange={updateParams}
              />
            </div>

            {isLoading && (
              <div className="flex flex-col gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <HotelCardSkeleton key={i} />
                ))}
              </div>
            )}

            {isError && (
              <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-neutral-200 bg-white px-6 py-20 text-center shadow-card">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-error-100">
                  <AlertTriangle
                    className="h-6 w-6 text-error-500"
                    aria-hidden
                  />
                </span>
                <div>
                  <p className="font-semibold text-neutral-900">
                    مشکلی پیش آمد
                  </p>
                  <p className="mt-1 text-sm text-neutral-600">
                    بارگذاری هتلها با خطا مواجه شد.
                  </p>
                </div>
                <Button variant="outline" onClick={() => refetch()}>
                  تلاش مجدد
                </Button>
              </div>
            )}

            {!isLoading && !isError && data?.data.length === 0 && (
              <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-neutral-200 bg-white px-6 py-20 text-center shadow-card">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
                  <SearchX className="h-6 w-6 text-neutral-400" aria-hidden />
                </span>
                <div>
                  <p className="font-semibold text-neutral-900">
                    هتلی یافت نشد
                  </p>
                  <p className="mt-1 text-sm text-neutral-600">
                    جستجو یا فیلترهای خود را تغییر دهید.
                  </p>
                </div>
              </div>
            )}

            {!isLoading && !isError && data && data.data.length > 0 && (
              <>
                <div className="flex flex-col gap-4">
                  {data.data.map((hotel) => (
                    <FadeIn key={hotel.id} direction="up">
                      <HotelCard hotel={hotel} layout="list" />
                    </FadeIn>
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
    </div>
  );
}
