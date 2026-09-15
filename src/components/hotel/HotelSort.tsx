// src/components/hotel/HotelSort.tsx
import { useRef, useState, useEffect } from "react";
import { ArrowUpDown, ChevronDown, Check } from "lucide-react";
import { cn } from "@/utils/cn";
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
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const current = options.find((o) => o.value === value) ?? options[0];

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="hotel-sort-panel"
        className="flex h-11 items-center gap-2.5 rounded-full border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-800 shadow-card transition-colors hover:border-primary-300 hover:text-primary-700"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-50 text-neutral-500">
          <ArrowUpDown className="h-3.5 w-3.5" aria-hidden />
        </span>
        <span className="hidden sm:inline">{current.label}</span>
        <span className="sm:hidden">مرتب‌سازی</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-neutral-400 transition-transform duration-300",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      {open && (
        <div
          id="hotel-sort-panel"
          role="listbox"
          className="absolute end-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-neutral-200 bg-white p-2 shadow-elevated"
        >
          {options.map((opt) => {
            const active = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  onChange({ sort: opt.value });
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-primary-50 font-semibold text-primary-700"
                    : "text-neutral-700 hover:bg-neutral-50",
                )}
              >
                {opt.label}
                {active && <Check className="h-4 w-4 text-primary-600" aria-hidden />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}