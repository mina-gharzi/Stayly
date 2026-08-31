// src/components/ui/GuestSelector.tsx
import { useEffect, useRef, useState } from "react";
import { Users, Plus, Minus } from "lucide-react";
import { cn } from "@/utils/cn";

export interface GuestValue {
  adults: number;
  children: number;
  rooms: number;
}

interface GuestSelectorProps {
  value: GuestValue;
  onChange: (value: GuestValue) => void;
}

export function GuestSelector({ value, onChange }: GuestSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function update(key: keyof GuestValue, delta: number, min: number) {
    onChange({ ...value, [key]: Math.max(min, value[key] + delta) });
  }

  const rows: { key: keyof GuestValue; label: string; min: number }[] = [
    { key: "adults", label: "بزرگسال", min: 1 },
    { key: "children", label: "کودک", min: 0 },
    { key: "rooms", label: "اتاق", min: 1 },
  ];

  const summary = `${value.adults} بزرگسال · ${value.children} کودک · ${value.rooms} اتاق`;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-12 w-full items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50/50 pr-4 pl-4 text-sm text-neutral-900 transition-all duration-200 hover:border-neutral-300 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10"
      >
        <Users className="h-icon-sm w-icon-sm shrink-0 text-neutral-400" aria-hidden />
        <span className="flex-1 text-start">{summary}</span>
        <ChevronIcon
          className={cn(
            "h-4 w-4 text-neutral-400 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full z-50 mt-2 w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white p-4 shadow-elevated">
          {rows.map((row, i) => (
            <div
              key={row.key}
              className={cn(
                "flex items-center justify-between py-3",
                i < rows.length - 1 && "border-b border-neutral-100",
              )}
            >
              <span className="text-sm font-medium text-neutral-800">
                {row.label}
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => update(row.key, -1, row.min)}
                  disabled={value[row.key] <= row.min}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 text-neutral-600 transition-all duration-200 hover:bg-neutral-100 hover:text-neutral-900",
                    value[row.key] <= row.min &&
                      "cursor-not-allowed opacity-30 hover:bg-neutral-50 hover:text-neutral-600",
                  )}
                >
                  <Minus className="h-3.5 w-3.5" aria-hidden />
                </button>
                <span className="w-6 text-center text-sm font-semibold tabular-nums text-neutral-900">
                  {value[row.key]}
                </span>
                <button
                  type="button"
                  onClick={() => update(row.key, 1, row.min)}
                  aria-label={`افزایش ${row.label}`}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-primary-200 bg-primary-50 text-primary-600 transition-all duration-200 hover:bg-primary-100 hover:text-primary-700"
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
