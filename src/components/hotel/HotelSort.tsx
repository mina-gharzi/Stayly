// src/components/hotel/HotelSort.tsx
import { ArrowUpDown, ChevronDown } from "lucide-react";
import type { HotelSearchFilters } from "@/services/hotels";

const options: {
  value: NonNullable<HotelSearchFilters["sort"]>;
  label: string;
}[] = [
  { value: "recommended", label: "پیشنهادی" },
  { value: "price-asc", label: "قیمت: کم به زیاد" },
  { value: "price-desc", label: "قیمت: زیاد به کم" },
  { value: "rating-desc", label: "بیشترین امتیاز" },
];

interface HotelSortProps {
  value: string;
  onChange: (updates: Record<string, string | null>) => void;
}

export function HotelSort({ value, onChange }: HotelSortProps) {
  return (
    <div className="relative flex items-center">
      {/* آیکون مرتبسازی — سمت شروع (راست در RTL) */}
      <ArrowUpDown
        className="pointer-events-none absolute inset-s-3 h-4 w-4 text-neutral-400"
        aria-hidden
      />

      <select
        value={value}
        onChange={(e) => onChange({ sort: e.target.value })}
        aria-label="مرتب‌سازی نتایج"
        className="h-10 w-full cursor-pointer appearance-none rounded-xl border border-neutral-200 bg-white ps-9 pe-9 text-sm font-medium text-neutral-900 shadow-card transition-colors hover:border-primary-300 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 sm:w-auto"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* فلش پایین — سمت انتها (چپ در RTL) */}
      <ChevronDown
        className="pointer-events-none absolute inset-e-3 h-4 w-4 text-neutral-400"
        aria-hidden
      />
    </div>
  );
}
