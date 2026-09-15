// src/pages/Hotels/index.tsx
import { Link } from "react-router-dom";
import { SearchX, ChevronLeft, Home, X, SlidersHorizontal } from "lucide-react";
import { useHotelSearch } from "@/hooks/useHotelSearch";
import { HotelFilters } from "@/components/hotel/HotelFilters";
import { HotelSort } from "@/components/hotel/HotelSort";
import { HotelCard } from "@/components/hotel/HotelCard";
import { HotelCardSkeleton } from "@/components/hotel/HotelCardSkeleton";
import { Pagination } from "@/components/ui/Pagination";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { FadeIn } from "@/components/common/FadeIn";
import { getCities, getCityById, getAmenities } from "@/services/catalog";
import { propertyTypeMeta } from "@/utils/propertyTypes";
import { formatToman } from "@/utils/currency";
import { usePageTitle } from "@/hooks/usePageTitle";

export function Hotels() {
  const { filters, updateParams, data, isLoading, isError, refetch } =
    useHotelSearch();

  const destinationLabel =
    filters.destination?.length === 1
      ? getCityById(filters.destination![0])?.name
      : filters.destination?.length
        ? `${filters.destination.length} مقصد`
        : "همه مقصدها";

  usePageTitle(
    filters.destination?.length ? `${destinationLabel} | هتلها` : undefined
  );

  /* ── چیپ‌های فیلترهای فعال ── */
  const chips: { key: string; label: string; remove: () => void }[] = [];

  for (const id of filters.destination ?? []) {
    const city = getCities().find((c) => c.id === id);
    const rest = (filters.destination ?? []).filter((x) => x !== id);
    chips.push({
      key: `dest-${id}`,
      label: city?.name ?? id,
      remove: () =>
        updateParams({ destination: rest.length ? rest.join(",") : null }),
    });
  }

  for (const star of filters.starRatings ?? []) {
    const rest = (filters.starRatings ?? []).filter((x) => x !== star);
    chips.push({
      key: `star-${star}`,
      label: `${star} ستاره`,
      remove: () =>
        updateParams({ starRating: rest.length ? rest.join(",") : null }),
    });
  }

  if (filters.minGuestRating) {
    chips.push({
      key: "grate",
      label: `امتیاز ${filters.minGuestRating}+`,
      remove: () => updateParams({ minGuestRating: null }),
    });
  }

  if (filters.priceMax != null) {
    chips.push({
      key: "price",
      label: `تا ${formatToman(filters.priceMax)}`,
      remove: () => updateParams({ priceMax: null }),
    });
  }

  for (const type of filters.propertyTypes ?? []) {
    const rest = (filters.propertyTypes ?? []).filter((x) => x !== type);
    chips.push({
      key: `type-${type}`,
      label: propertyTypeMeta[type]?.label ?? type,
      remove: () =>
        updateParams({ propertyType: rest.length ? rest.join(",") : null }),
    });
  }

  for (const am of filters.amenityIds ?? []) {
    const rest = (filters.amenityIds ?? []).filter((x) => x !== am);
    const name = getAmenities().find((a) => a.id === am)?.name ?? am;
    chips.push({
      key: `am-${am}`,
      label: name,
      remove: () =>
        updateParams({ amenities: rest.length ? rest.join(",") : null }),
    });
  }

  function clearAll() {
    updateParams({
      priceMax: null,
      starRating: null,
      minGuestRating: null,
      propertyType: null,
      destination: null,
      amenities: null,
    });
  }

  return (
    <div className="min-h-screen bg-neutral-100/60">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
        {/* ═══ هدر نتایج ═══ */}
        <div className="relative overflow-hidden rounded-3xl border border-neutral-200/70 bg-white px-5 py-6 shadow-card sm:px-8 sm:py-8">
          {/* المان‌های دکوراتیو */}
          <div
            className="pointer-events-none absolute -top-24 -inset-e-24 h-60 w-60 rounded-full bg-primary-100/60 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-28 -inset-s-20 h-48 w-48 rounded-full bg-primary-50/70 blur-3xl"
            aria-hidden
          />

          <div className="relative">
            {/* Breadcrumb */}
            <nav
              className="flex items-center gap-1.5 text-xs text-neutral-400"
              aria-label="مسیر"
            >
              <Link
                to="/"
                className="flex items-center gap-1 transition-colors hover:text-primary-600"
              >
                <Home className="h-3.5 w-3.5" aria-hidden />
                خانه
              </Link>
              <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
              <span className="font-medium text-neutral-600">هتل‌ها</span>
              <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
              <span className="font-medium text-neutral-600">
                {destinationLabel}
              </span>
            </nav>

            {/* عنوان + مرتب‌سازی */}
            <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-2xl font-extrabold text-neutral-900 sm:text-3xl lg:text-4xl">
                  اقامتگاه‌ها در{" "}
                  <span className="bg-linear-to-l from-primary-600 to-primary-400 bg-clip-text text-transparent">
                    {destinationLabel}
                  </span>
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-600 px-3 py-1 text-xs font-bold text-white shadow-card">
                    <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden />
                    {isLoading ? "..." : (data?.total ?? 0).toLocaleString("fa-IR")}
                  </span>
                  <span className="text-sm text-neutral-500">
                    اقامتگاه پیدا شد — انتخابی متنوع در بهترین قیمت
                  </span>
                </div>
              </div>

              <HotelSort
                value={filters.sort ?? "recommended"}
                onChange={updateParams}
              />
            </div>

            {/* چیپ‌های فیلتر فعال */}
            {chips.length > 0 && (
              <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-neutral-100 pt-4">
                <span className="text-xs font-medium text-neutral-500">
                  فیلترهای فعال:
                </span>
                {chips.map((chip) => (
                  <button
                    key={chip.key}
                    type="button"
                    onClick={chip.remove}
                    className="group flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 transition-all duration-200 hover:border-primary-300 hover:bg-primary-100"
                  >
                    {chip.label}
                    <X
                      className="h-3 w-3 text-primary-400 transition-colors group-hover:text-primary-700"
                      aria-hidden
                    />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-xs font-semibold text-neutral-500 underline-offset-2 transition-colors hover:text-neutral-800 hover:underline"
                >
                  پاک کردن همه
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ═══ ستون فیلترها + نتایج ═══ */}
        <div className="mt-8 flex flex-col gap-8 lg:flex-row">
          <HotelFilters filters={filters} onChange={updateParams} />

          <div className="flex-1">
            {isLoading && (
              <div className="flex flex-col gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <HotelCardSkeleton key={i} layout="list" />
                ))}
              </div>
            )}

            {isError && (
              <ErrorState
                description="بارگذاری هتل‌ها با خطا مواجه شد."
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
                  {data.data.map((hotel, index) => (
                    <FadeIn key={hotel.id} delay={index * 60} direction="up">
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