// src/pages/Hotels/index.tsx
import { SearchX } from "lucide-react";
import { useHotelSearch } from "@/hooks/useHotelSearch";
import { HotelFilters } from "@/components/hotel/HotelFilters";
import { HotelSort } from "@/components/hotel/HotelSort";
import { HotelCard } from "@/components/hotel/HotelCard";
import { HotelCardSkeleton } from "@/components/hotel/HotelCardSkeleton";
import { Pagination } from "@/components/ui/Pagination";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { FadeIn } from "@/components/common/FadeIn";
import { getCityById } from "@/services/catalog";

export function Hotels() {
  const { filters, updateParams, data, isLoading, isError, refetch } =
    useHotelSearch();

  const destinationLabel =
    filters.destination?.length === 1
      ? getCityById(filters.destination![0])?.name
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
                <h1 className="mt-1 text-2xl font-bold text-primary-600">
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
              <ErrorState
                description="بارگذاری هتلها با خطا مواجه شد."
                onRetry={() => refetch()}
              />
            )}

            {!isLoading && !isError && data?.data.length === 0 && (
              <EmptyState
                icon={SearchX}
                title="هتلی یافت نشد"
                description="جستجو یا فیلترهای خود را تغییر دهید."
              />
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
