// src/components/home/SearchBox.tsx
import { useState, useRef, useEffect, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, ChevronDown, Calendar, Check } from "lucide-react";
import { getCities } from "@/services/catalog";
import { useBookingStore } from "@/store/bookingStore";
import { GuestSelector, type GuestValue } from "@/components/ui/GuestSelector";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function todayPlus(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

function addDays(value: string, days: number) {
  if (!value) return todayPlus(days);
  const d = new Date(`${value}T00:00:00`);
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

function formatDate(value: string) {
  if (!value) return "—";
  const d = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat("fa-IR", {
    month: "short",
    day: "numeric",
  }).format(d);
}

function DestinationSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const cities = getCities();
  const selected = cities.find((c) => c.id === value);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
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

  const panelId = "destination-panel";

  return (
    <div ref={ref} className="relative flex-1">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={panelId}
        className="flex h-12 w-full items-center gap-2.5 px-1 text-start focus:outline-none sm:px-4"
      >
        <MapPin className="h-4 w-4 shrink-0 text-neutral-400" aria-hidden />
        <span className="flex min-w-0 flex-col text-start">
          <span className="text-[10px] font-medium text-neutral-500">
            مقصد
          </span>
          <span className="truncate font-mono text-sm font-semibold text-neutral-900">
            {selected?.name ?? "انتخاب شهر"}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "ms-auto h-4 w-4 shrink-0 text-neutral-400 transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      {open && (
        <div
          id={panelId}
          role="listbox"
          className="absolute start-0 top-full z-50 mt-2 w-72 max-w-[85vw] overflow-hidden rounded-2xl border border-neutral-200 bg-white p-2 shadow-elevated"
        >
          <p className="px-3 pb-1.5 pt-1 text-xs font-medium text-neutral-500">
            انتخاب مقصد
          </p>
          {cities.map((city) => (
            <button
              key={city.id}
              type="button"
              role="option"
              aria-selected={city.id === value}
              onClick={() => {
                onChange(city.id);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-neutral-50",
                city.id === value && "bg-primary-50",
              )}
            >
              <span className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-lg",
                    city.id === value
                      ? "bg-primary-100 text-primary-700"
                      : "bg-neutral-100 text-neutral-400",
                  )}
                >
                  <MapPin className="h-3.5 w-3.5" aria-hidden />
                </span>
                <span
                  className={cn(
                    "font-semibold",
                    city.id === value ? "text-primary-700" : "text-neutral-800",
                  )}
                >
                  {city.name}
                </span>
              </span>
              {city.id === value && (
                <Check className="h-4 w-4 text-primary-600" aria-hidden />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function DateField({
  label,
  value,
  min,
  onValueChange,
}: {
  label: string;
  value: string;
  min: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <div className="relative flex h-12 items-center gap-2.5 px-1 sm:flex-1 sm:px-4">
      <Calendar className="hidden h-4 w-4 shrink-0 text-neutral-400 sm:block" aria-hidden />
      <div className="flex flex-col text-start">
        <span className="text-[10px] font-medium text-neutral-500">
          {label}
        </span>
        <span className="font-mono text-xs font-semibold text-neutral-900 sm:text-sm">
          {formatDate(value)}
        </span>
      </div>
      <input
        type="date"
        value={value}
        min={min}
        onChange={(e) => onValueChange(e.target.value)}
        aria-label={label}
        className="absolute inset-0 h-full w-full cursor-pointer bg-transparent text-transparent opacity-0 focus:outline-none [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
      />
    </div>
  );
}

export function SearchBox() {
  const navigate = useNavigate();
  const { draft, setDraft } = useBookingStore();

  const [destination, setDestination] = useState(
    () => getCities()[0]?.id ?? "",
  );
  const [checkIn, setCheckIn] = useState(() => draft.checkIn || todayPlus(1));
  const [checkOut, setCheckOut] = useState(() => draft.checkOut || todayPlus(4));
  const [guests, setGuests] = useState<GuestValue>(() => ({
    adults: draft.adults || 2,
    children: draft.children || 0,
    rooms: draft.rooms || 1,
  }));

  function handleCheckInChange(value: string) {
    setCheckIn(value);
    if (value && checkOut && value >= checkOut) {
      setCheckOut(addDays(value, 1));
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setDraft({
      checkIn,
      checkOut,
      adults: guests.adults,
      children: guests.children,
      rooms: guests.rooms,
    });
    const params = new URLSearchParams();
    if (destination) params.set("destination", destination);
    params.set("page", "1");
    navigate(`/hotels?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-2xl bg-white p-2 shadow-float sm:rounded-3xl sm:p-2.5"
    >
      {/* ── موبایل: کارت ستونی مینیمال ── */}
      <div className="divide-y divide-neutral-100 sm:hidden">
        <DestinationSelect value={destination} onChange={setDestination} />

        <div className="grid grid-cols-2 divide-x divide-neutral-100">
          <DateField
            label="ورود"
            value={checkIn}
            min={todayPlus(0)}
            onValueChange={handleCheckInChange}
          />
          <DateField
            label="خروج"
            value={checkOut}
            min={addDays(checkIn, 1)}
            onValueChange={setCheckOut}
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <GuestSelector bare value={guests} onChange={setGuests} />
          </div>
          <Button
            type="submit"
            className="h-12 shrink-0 rounded-full bg-primary-600 font-bold text-white transition-all duration-300 hover:bg-primary-700 active:scale-95"
          >
            <Search className="h-4 w-4" aria-hidden />
            <span className="text-sm">جستجو</span>
          </Button>
        </div>
      </div>

      {/* ── دسکتاپ: نوار تفکیک‌شده ── */}
      <div className="hidden sm:flex sm:flex-row sm:items-center sm:gap-0">
        <DestinationSelect value={destination} onChange={setDestination} />

        <div className="hidden h-8 w-px shrink-0 bg-neutral-100 sm:block" />
        <DateField
          label="ورود"
          value={checkIn}
          min={todayPlus(0)}
          onValueChange={handleCheckInChange}
        />

        <div className="hidden h-8 w-px shrink-0 bg-neutral-100 sm:block" />
        <DateField
          label="خروج"
          value={checkOut}
          min={addDays(checkIn, 1)}
          onValueChange={setCheckOut}
        />

        <div className="hidden h-8 w-px shrink-0 bg-neutral-100 sm:block" />
        <div className="sm:flex-1">
          <GuestSelector bare value={guests} onChange={setGuests} />
        </div>

        <Button
          type="submit"
          size="lg"
          className="mt-1 w-full shrink-0 rounded-xl bg-primary-600 font-bold text-white transition-all duration-300 hover:bg-primary-700 sm:mt-0 sm:w-36 sm:rounded-full sm:text-sm"
        >
          <span className="hidden sm:inline">جستجو</span>
          <Search className="h-4 w-4 sm:hidden" aria-hidden />
        </Button>
      </div>
    </form>
  );
}