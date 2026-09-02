// src/components/home/SearchBox.tsx
import { useState, useRef, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, ChevronDown, ChevronLeft } from "lucide-react";
import { getCities } from "@/services/catalog";
import { Button } from "@/components/ui/Button";

export function SearchBox() {
  const navigate = useNavigate();
  const allCities = getCities();
  const [destination, setDestination] = useState(allCities[0]?.id ?? "");
  const cityRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  function selectCity(id: string) {
    setDestination(id);
    // اسکرول ملایم به شهر انتخابشده (موبایل)
    cityRefs.current[id]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination) params.set("destination", destination);
    params.set("page", "1");
    navigate(`/hotels?${params.toString()}`);
  }

  const popularCities = allCities.slice(0, 5);
  const selectedCity = allCities.find((c) => c.id === destination);

  return (
    <div className="relative flex w-full max-w-8xl items-center justify-center">
      {/* لیست عمودی شهرها — دسکتاپ */}
      <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 flex-col gap-3.5 pr-2 lg:flex xl:right-8">
        {popularCities.map((city) => {
          const isSelected = destination === city.id;
          return (
            <button
              key={city.id}
              type="button"
              ref={(el) => {
                cityRefs.current[city.id] = el;
              }}
              onClick={() => selectCity(city.id)}
              className={`group flex items-center gap-3 text-right transition-colors duration-300 ${
                isSelected ? "text-white" : "text-white/50 hover:text-white/80"
              }`}
            >
              {isSelected && (
                <span className="flex items-center">
                  <span className="h-px w-6 bg-white" />
                  <ChevronLeft className="h-4 w-4" />
                </span>
              )}
              <span
                className={`font-mono uppercase tracking-widest transition-all duration-300 ${
                  isSelected ? "text-lg font-bold" : "text-sm font-medium"
                }`}
              >
                {city.name}
              </span>
            </button>
          );
        })}
        <button
          type="button"
          className="mt-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-white shadow-elevated transition-transform hover:scale-105"
        >
          <ChevronDown className="h-5 w-5" />
        </button>
      </div>

      {/* نوار جستجو + چیپهای موبایل + فیلترها */}
      <div className="mx-auto flex w-full max-w-xl flex-col items-center">
        {/* چیپهای افقی شهرها — موبایل */}
        <div className="mb-4 flex w-full gap-5 overflow-x-auto pb-1 pt-1 lg:hidden scrollbar-none [&::-webkit-scrollbar]:hidden">
          {popularCities.map((city) => {
            const isSelected = destination === city.id;
            return (
              <button
                key={city.id}
                type="button"
                ref={(el) => {
                  cityRefs.current[city.id] = el;
                }}
                onClick={() => selectCity(city.id)}
                className="group flex shrink-0 flex-col items-center gap-1.5 transition-all duration-300"
              >
                <span
                  className={`font-mono uppercase tracking-widest transition-all duration-300 ${
                    isSelected
                      ? "text-base font-bold text-white"
                      : "text-sm font-medium text-white/50 group-hover:text-white/80"
                  }`}
                >
                  {city.name}
                </span>
                <span
                  className={`h-0.5 rounded-full bg-primary-500 transition-all duration-300 ${
                    isSelected ? "w-8 opacity-100" : "w-0 opacity-0"
                  }`}
                />
              </button>
            );
          })}
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex w-full items-center gap-2 rounded-full bg-white p-2 shadow-elevated"
        >
          <div className="flex flex-1 items-center gap-3 rounded-full bg-neutral-100 px-5 py-3">
            <Search className="h-4 w-4 shrink-0 text-neutral-400" />
            <span className="font-mono text-sm font-semibold uppercase tracking-wide text-neutral-900">
              {selectedCity?.name ?? "انتخاب شهر"}
            </span>
          </div>
          <Button
            type="submit"
            className="rounded-full bg-primary-600 px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-primary-700"
          >
            جستجو
          </Button>
        </form>

        {/* فیلترها */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium text-white backdrop-blur-md transition-colors hover:bg-white/20"
          >
            <MapPin className="h-3.5 w-3.5" />
            کشف مقصدها
          </button>
          <button
            type="button"
            className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium text-white backdrop-blur-md transition-colors hover:bg-white/20"
          >
            هتل
          </button>
          <button
            type="button"
            className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium text-white backdrop-blur-md transition-colors hover:bg-white/20"
          >
            استراحتگاه
          </button>
          <button
            type="button"
            className="flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium text-white backdrop-blur-md transition-colors hover:bg-white/20"
          >
            بیشتر
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
