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
import { cities } from "@/data/cities";
import { amenities } from "@/data/amenities";
import type { PropertyType } from "@/types";
import { formatToman } from "@/utils/currency";
import type { HotelSearchFilters } from "@/services/hotels";

const propertyTypeLabels: Record<PropertyType, string> = {
  hotel: "هتل",
  resort: "استراحتگاه",
  apartment: "آپارتمان",
  villa: "ویلا",
  hostel: "هاستل",
  boutique: "بوتیک",
};

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
        <span className="flex items-center gap-2 text-sm font-semibold text-primary-600">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary-50 text-primary-600">
            <Icon className="h-4 w-4" />
          </span>
          {title}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-neutral-400 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-toggle`}
        // وقتی بسته است، محتوا از ترتیب تب و درخت دسترس‌پذیری حذف می‌شود
        inert={!open}
        className={`grid transition-all duration-300 ease-in-out ${
          open
            ? "mt-3 grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

export function HotelFilters({ filters, onChange }: HotelFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

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
          <span className="flex items-center gap-2 text-sm font-semibold text-primary-600">
            فیلترها
          </span>
          <ChevronDown
            className={`h-4 w-4 text-neutral-400 transition-transform duration-300 ${
              mobileOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* کارت فیلترها — موبایل: تاشو / دسکتاپ: همیشه باز */}
      <div
        id="hotel-filters-panel"
        className={`mt-3 rounded-2xl border border-neutral-200 bg-white p-5 shadow-card lg:sticky lg:top-6 lg:mt-0 lg:block ${
          mobileOpen ? "block" : "hidden"
        }`}
      >
        {/* هدر فیلترها — راستچین */}
        <div className="mb-4">
          <h2 className="mt-1 text-lg font-bold text-primary-600">فیلترها</h2>
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
              className="w-full accent-primary-700"
            />
            <div className="mt-1.5 flex items-center justify-between text-xs text-neutral-500">
              <span>۰</span>
              <span className="font-medium text-neutral-800">
                تا سقف {formatToman(filters.priceMax ?? PRICE_MAX)}
              </span>
            </div>
          </FilterGroup>

          {/* رتبه ستاره */}
          <FilterGroup id="star" title="رتبه ستاره" icon={Star}>
            <div className="flex flex-col gap-1">
              {[5, 4, 3, 2, 1].map((star) => (
                <label
                  key={star}
                  className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-neutral-800 transition-colors hover:bg-neutral-50"
                >
                  <input
                    type="checkbox"
                    checked={filters.starRatings?.includes(star) ?? false}
                    onChange={() =>
                      toggleInCsv(
                        (filters.starRatings ?? []).map(String),
                        String(star),
                        "starRating",
                      )
                    }
                    className="h-4 w-4 accent-primary-700"
                  />
                  <span className="flex items-center gap-0.5">
                    {Array.from({ length: star }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-3.5 w-3.5 fill-warning-500 text-warning-500"
                        aria-hidden
                      />
                    ))}
                  </span>
                </label>
              ))}
            </div>
          </FilterGroup>

          {/* امتیاز مهمانان */}
          <FilterGroup id="guest-rating" title="امتیاز مهمانان" icon={Users}>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "همه", value: null },
                { label: "۷ به بالا", value: "7" },
                { label: "۸ به بالا", value: "8" },
                { label: "۹ به بالا", value: "9" },
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => onChange({ minGuestRating: opt.value })}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    (filters.minGuestRating
                      ? String(filters.minGuestRating)
                      : null) === opt.value
                      ? "border-primary-600 bg-primary-600 text-white"
                      : "border-neutral-200 text-neutral-700 hover:border-primary-300 hover:text-primary-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </FilterGroup>

          {/* نوع اقامتگاه */}
          <FilterGroup id="property-type" title="نوع اقامتگاه" icon={Building2}>
            <div className="flex flex-col gap-1">
              {(Object.keys(propertyTypeLabels) as PropertyType[]).map(
                (type) => (
                  <label
                    key={type}
                    className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-neutral-800 transition-colors hover:bg-neutral-50"
                  >
                    <input
                      type="checkbox"
                      checked={filters.propertyTypes?.includes(type) ?? false}
                      onChange={() =>
                        toggleInCsv(
                          filters.propertyTypes ?? [],
                          type,
                          "propertyType",
                        )
                      }
                      className="h-4 w-4 accent-primary-700"
                    />
                    {propertyTypeLabels[type]}
                  </label>
                ),
              )}
            </div>
          </FilterGroup>

          {/* مقصد */}
          <FilterGroup id="destination" title="مقصد" icon={MapPin}>
            <div className="flex flex-col gap-1">
              {cities.map((city) => (
                <label
                  key={city.id}
                  className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-neutral-800 transition-colors hover:bg-neutral-50"
                >
                  <input
                    type="checkbox"
                    checked={filters.destination?.includes(city.id) ?? false}
                    onChange={() =>
                      toggleInCsv(
                        filters.destination ?? [],
                        city.id,
                        "destination",
                      )
                    }
                    className="h-4 w-4 accent-primary-700"
                  />
                  {city.name}
                </label>
              ))}
            </div>
          </FilterGroup>

          {/* امکانات */}
          <FilterGroup id="amenities" title="امکانات" icon={Sparkles}>
            <div className="flex flex-col gap-1">
              {amenities.map((amenity) => (
                <label
                  key={amenity.id}
                  className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-neutral-800 transition-colors hover:bg-neutral-50"
                >
                  <input
                    type="checkbox"
                    checked={filters.amenityIds?.includes(amenity.id) ?? false}
                    onChange={() =>
                      toggleInCsv(
                        filters.amenityIds ?? [],
                        amenity.id,
                        "amenities",
                      )
                    }
                    className="h-4 w-4 accent-primary-700"
                  />
                  {amenity.name}
                </label>
              ))}
            </div>
          </FilterGroup>
        </div>

        {/* دکمه پاک کردن همه — زیر فیلترها */}
        <div className="mt-5 border-t border-neutral-100 pt-4">
          <button
            type="button"
            onClick={clearAll}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
          >
            <RotateCcw className="h-4 w-4" />
            پاک کردن همه
          </button>
        </div>
      </div>
    </aside>
  );
}
