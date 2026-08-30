// src/components/home/PopularProperties.tsx
import { Link } from "react-router-dom";
import {
  Building2,
  Palmtree,
  Home as HomeIcon,
  Warehouse,
  BedSingle,
  Sparkles,
} from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { hotels } from "@/data/hotels";
import type { PropertyType } from "@/types";
import type { LucideIcon } from "lucide-react";

const propertyTypeConfig: Record<
  PropertyType,
  { label: string; icon: LucideIcon }
> = {
  hotel: { label: "هتل", icon: Building2 },
  resort: { label: "استراحتگاه", icon: Palmtree },
  apartment: { label: "آپارتمان", icon: HomeIcon },
  villa: { label: "ویلا", icon: Warehouse },
  hostel: { label: "هاستل", icon: BedSingle },
  boutique: { label: "بوتیک", icon: Sparkles },
};

export function PopularProperties() {
  const types = Object.keys(propertyTypeConfig) as PropertyType[];

  return (
    <section className="bg-neutral-100/60">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <div className="rounded-2xl bg-white p-6 shadow-elevated sm:p-10">
          {/* هدر سکشن — وسطچین */}
          <div className="text-center">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-primary-600">
              Property Types
            </p>
            <h2 className="mt-2 text-2xl font-bold text-primary-600 sm:text-3xl">
              جستجو بر اساس نوع اقامتگاه
            </h2>
          </div>

          {/* گرید آیتمها */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:mt-10 sm:grid-cols-3 lg:grid-cols-6">
            {types.map((type) => {
              const config = propertyTypeConfig[type];
              const count = hotels.filter(
                (h) => h.propertyType === type,
              ).length;
              const Icon = config.icon;

              return (
                <Link
                  key={type}
                  to={`/hotels?propertyType=${type}`}
                  className="group relative flex flex-col items-center gap-4 overflow-hidden rounded-xl border border-neutral-100 bg-neutral-50/50 p-6 text-center transition-all duration-300 hover:border-primary-200 hover:bg-primary-50/50 hover:shadow-card"
                >
                  {/* آیکون */}
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100/80 text-primary-600 transition-all duration-300 group-hover:bg-primary-600 group-hover:text-white group-hover:shadow-card">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>

                  {/* متن */}
                  <div>
                    <p className="text-sm font-semibold text-neutral-900 transition-colors group-hover:text-primary-700">
                      {config.label}
                    </p>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      {count} اقامتگاه
                    </p>
                  </div>

                  {/* فلش — ظاهر میشه موقع هاور */}
                  <div className="absolute inset-x-0 bottom-0 flex justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="mb-3 flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-white">
                      <ArrowLeft className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* لینک مشاهده همه — فقط دسکتاپ */}
          <div className="mt-10 hidden justify-center lg:flex">
            <Link
              to="/hotels"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700"
            >
              مشاهده همه
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
