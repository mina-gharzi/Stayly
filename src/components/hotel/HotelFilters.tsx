// src/components/hotel/HotelFilters.tsx
import { useState, type ReactNode } from "react";
import {
  Star,
  Wallet,
  Users,
  Building2,
  MapPin,
  Sparkles,
  ChevronDown,
  RotateCcw,
  type LucideIcon,
} from "lucide-react";
import { getCities, getAmenities } from "@/services/catalog";
import { useHotelCountsByCity } from "@/hooks/useCatalog";
import { propertyTypeMeta } from "@/utils/propertyTypes";
import { cn } from "@/utils/cn";
import type { PropertyType } from "@/types";
import { formatToman } from "@/utils/currency";
import type { HotelSearchFilters } from "@/services/hotels";

const PRICE_MAX = 700; // واحد خام؛ معادل ۷۰,۰۰۰,۰۰۰ تومان

interface HotelFiltersProps {
  filters: HotelSearchFilters;
  onChange: (updates: Record<string, string | null>) => void;
}

/* گروه فیلتر — تاشو */
function FilterGroup({
  id,
  title,
  icon: Icon,
  defaultOpen = false,
  children,
}: {
  id: string;
  title: string;
  icon: LucideIcon;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="py-4 first:pt-0 last:pb-0">
      <button
        type="button"
        id={`${id}-toggle`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        className="flex w-full items-center justify-between text-start"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-50 text-neutral-500 ring-1 ring-neutral-100">
            <Icon className="h-4 w-4" />
          </span>
          {title}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-neutral-400 transition-transform duration-300",
            open && "rotate-180",
          )}
        />
      </button>
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-toggle`}
        inert={!open}
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          open ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

export function HotelFilters({ filters, onChange }: HotelFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const allCities = getCities();
  const allAmenities = getAmenities();
  const { data: cityCounts } = useHotelCountsByCity();

  const activeCount =
    (filters.destination?.length ?? 0) +
    (filters.starRatings?.length ?? 0) +
    (filters.propertyTypes?.length ?? 0) +
    (filters.amenityIds?.length ?? 0) +
    (filters.minGuestRating ? 1 : 0) +
    (filters.priceMax != null ? 1 : 0);

  function toggleInCsv(current: string[], value: string, key: string) {
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onChange({ [key]: next.length ? next.join(",") : null });
  }

  function clearAll() {
    onChange({
      priceMax: null,
      starRating: null,
      minGuestRating: null,
      propertyType: null,
      destination: null,
      amenities: null,
    });
  }

  const checkRowClass = (active: boolean) =>
    cn(
      "flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors",
      active ? "bg-primary-50/70 text-primary-800" : "text-neutral-800 hover:bg-neutral-50",
    );

  return (
    <aside className="w-full lg:w-72">
      {/* دکمه فیلترها — فقط موبایل */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          aria-expanded={mobileOpen}
          aria-controls="hotel-filters-panel"
          className="flex w-full items-center justify-between rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 shadow-card transition-colors hover:border-primary-300"
        >
          <span className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
              <Building2 className="h-4 w-4" aria-hidden />
            </span>
            <span className="text-sm font-bold text-neutral-900">فیلترها</span>
          </span>
          <span className="flex items-center gap-2">
            {activeCount > 0 && (
              <span className="rounded-full bg-primary-600 px-2 py-0.5 text-xs font-bold text-white">
                {activeCount}
              </span>
            )}
            <ChevronDown
              className={cn(
                "h-4 w-4 text-neutral-400 transition-transform duration-300",
                mobileOpen && "rotate-180",
              )}
            />
          </span>
        </button>
      </div>

      {/* کارت فیلترها — موبایل: تاشو / دسکتاپ: همیشه باز */}
      <div
        id="hotel-filters-panel"
        className={cn(
          "mt-3 rounded-2xl border border-neutral-200 bg-white p-5 shadow-card lg:sticky lg:top-6 lg:mt-0 lg:block",
          mobileOpen ? "block" : "hidden",
        )}
      >
        {/* هدر فیلترها */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-neutral-900">فیلترها</h2>
          {activeCount > 0 && (
            <span className="rounded-full bg-primary-600 px-2.5 py-0.5 text-xs font-bold text-white">
              {activeCount} فعال
            </span>
          )}
        </div>

        <div className="divide-y divide-neutral-100">
          {/* محدوده قیمت */}
          <FilterGroup id="price" title="محدوده قیمت" icon={Wallet} defaultOpen>
            <input
              type="range"
              min={0}
              max={PRICE_MAX}
              step={10}
              value={filters.priceMax ?? PRICE_MAX}
              onChange={(e) => onChange({ priceMax: e.target.value })}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-neutral-200 accent-primary-700"
            />
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-neutral-500">۰</span>
              <span className="rounded-full bg-primary-50 px-2.5 py-1 font-semibold text-primary-700">
                تا سقف {formatToman(filters.priceMax ?? PRICE_MAX)}
              </span>
            </div>
          </FilterGroup>

          {/* رتبه ستاره */}
          <FilterGroup id="star" title="رتبه ستاره" icon={Star}>
            <div className="flex flex-col gap-1">
              {[5, 4, 3, 2, 1].map((star) => {
                const active = filters.starRatings?.includes(star) ?? false;
                return (
                  <label key={star} className={checkRowClass(active)}>
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() =>
                        toggleInCsv(
                          (filters.starRatings ?? []).map(String),
                          String(star),
                          "starRating",
                        )
                      }
                      className="h-4 w-4 rounded accent-primary-700"
                    />
                    <span className="flex items-center gap-0.5">
                      {Array.from({ length: star }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-3.5 w-3.5",
                            active
                              ? "fill-warning-500 text-warning-500"
                              : "fill-neutral-200 text-neutral-200",
                          )}
                          aria-hidden
                        />
                      ))}
                    </span>
                  </label>
                );
              })}
            </div>
          </FilterGroup>

          {/* امتیاز مهمانان */}
          <FilterGroup id="guest-rating" title="امتیاز مهمانان" icon={Users}>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "همه", value: null },
                { label: "۷+", value: "7" },
                { label: "۸+", value: "8" },
                { label: "۹+", value: "9" },
              ].map((opt) => {
                const active =
                  (filters.minGuestRating
                    ? String(filters.minGuestRating)
                    : null) === opt.value;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => onChange({ minGuestRating: opt.value })}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                      active
                        ? "border-primary-600 bg-primary-600 text-white shadow-card"
                        : "border-neutral-200 text-neutral-700 hover:border-primary-300 hover:text-primary-700",
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </FilterGroup>

          {/* نوع اقامتگاه — چیپ رنگی */}
          <FilterGroup id="property-type" title="نوع اقامتگاه" icon={Building2}>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(propertyTypeMeta) as PropertyType[]).map((type) => {
                const config = propertyTypeMeta[type];
                const Icon = config.icon;
                const active = filters.propertyTypes?.includes(type) ?? false;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() =>
                      toggleInCsv(filters.propertyTypes ?? [], type, "propertyType")
                    }
                    aria-pressed={active}
                    className={cn(
                      "flex items-center justify-center gap-1.5 rounded-xl border px-2 py-2 text-xs font-semibold transition-all duration-200",
                      active
                        ? cn(config.chipActive, "shadow-card")
                        : cn("border-neutral-200 bg-white text-neutral-700", config.chipIdle),
                    )}
                  >
                    <Icon
                      className={cn("h-3.5 w-3.5", active ? "text-white" : config.text)}
                      aria-hidden
                    />
                    {config.label}
                  </button>
                );
              })}
            </div>
          </FilterGroup>

          {/* مقصد */}
          <FilterGroup id="destination" title="مقصد" icon={MapPin}>
            <div className="flex flex-col gap-1">
              {allCities.map((city) => {
                const active = filters.destination?.includes(city.id) ?? false;
                return (
                  <label key={city.id} className={checkRowClass(active)}>
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() =>
                        toggleInCsv(filters.destination ?? [], city.id, "destination")
                      }
                      className="h-4 w-4 rounded accent-primary-700"
                    />
                    {city.name}
                    <span className="ms-auto text-[11px] font-medium text-neutral-400">
                      {cityCounts?.[city.id] ?? 0} hotel
                    </span>
                  </label>
                );
              })}
            </div>
          </FilterGroup>

          {/* امکانات */}
          <FilterGroup id="amenities" title="امکانات" icon={Sparkles}>
            <div className="grid grid-cols-2 gap-1">
              {allAmenities.map((amenity) => {
                const active = filters.amenityIds?.includes(amenity.id) ?? false;
                return (
                  <label key={amenity.id} className={cn(checkRowClass(active), "text-xs")}>
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() =>
                        toggleInCsv(filters.amenityIds ?? [], amenity.id, "amenities")
                      }
                      className="h-3.5 w-3.5 rounded accent-primary-700"
                    />
                    <span className="truncate">{amenity.name}</span>
                  </label>
                );
              })}
            </div>
          </FilterGroup>
        </div>

        {/* دکمه پاک کردن همه — زیر فیلترها */}
        <div className="mt-5 border-t border-neutral-100 pt-4">
          <button
            type="button"
            onClick={clearAll}
            disabled={activeCount === 0}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-neutral-200 disabled:hover:bg-transparent disabled:hover:text-neutral-600"
          >
            <RotateCcw className="h-4 w-4" />
            پاک کردن همه
          </button>
        </div>
      </div>
    </aside>
  );
}