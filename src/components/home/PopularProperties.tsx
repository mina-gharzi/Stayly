// src/components/home/PopularProperties.tsx
import { Link } from "react-router-dom";
import {
  Building2,
  Palmtree,
  Home as HomeIcon,
  Warehouse,
  BedSingle,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { useHotelCountsByType } from "@/hooks/useCatalog";
import { FadeIn } from "@/components/common/FadeIn";
import type { PropertyType } from "@/types";
import type { LucideIcon } from "lucide-react";

const propertyTypeConfig: Record<
  PropertyType,
  { label: string; icon: LucideIcon; iconBg: string; color: string; ringColor: string }
> = {
  hotel:     { label: "هتل",       icon: Building2,  color: "text-primary-600 group-hover:bg-primary-600 group-hover:text-white",   ringColor: "group-hover:ring-primary-300/40",   iconBg: "bg-primary-50" },
  resort:    { label: "استراحتگاه", icon: Palmtree,   color: "text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",  ringColor: "group-hover:ring-emerald-300/40",  iconBg: "bg-emerald-50" },
  apartment: { label: "آپارتمان",  icon: HomeIcon,   color: "text-amber-600 group-hover:bg-amber-600 group-hover:text-white",     ringColor: "group-hover:ring-amber-300/40",    iconBg: "bg-amber-50" },
  villa:     { label: "ویلا",      icon: Warehouse,  color: "text-sky-600 group-hover:bg-sky-600 group-hover:text-white",        ringColor: "group-hover:ring-sky-300/40",      iconBg: "bg-sky-50" },
  hostel:    { label: "هاستل",     icon: BedSingle,  color: "text-violet-600 group-hover:bg-violet-600 group-hover:text-white",   ringColor: "group-hover:ring-violet-300/40",   iconBg: "bg-violet-50" },
  boutique:  { label: "بوتیک",     icon: Sparkles,   color: "text-rose-600 group-hover:bg-rose-600 group-hover:text-white",      ringColor: "group-hover:ring-rose-300/40",     iconBg: "bg-rose-50" },
};

export function PopularProperties() {
  const { data: counts } = useHotelCountsByType();
  const types = Object.keys(propertyTypeConfig) as PropertyType[];

  return (
    <section className="relative overflow-hidden bg-neutral-100/60">
      {/* المان دکوراتیو */}
      <div
        className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary-200/30 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:py-24">
        {/* ── هدر سکشن ── */}
        <FadeIn>
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex items-center gap-2 rounded-full border border-primary-200/70 bg-primary-50 px-4 py-1.5">
              <Building2 className="h-3.5 w-3.5 text-primary-600" aria-hidden />
              <span className="font-mono text-xs font-semibold uppercase tracking-wide text-primary-700">
                Property Types
              </span>
            </div>
            <h2 className="mt-1 text-2xl font-extrabold text-neutral-900 sm:text-3xl lg:text-4xl">
              جستجو بر اساس نوع اقامتگاه
            </h2>
            <p className="max-w-md text-sm text-neutral-500 sm:text-base">
              هرجا می‌خوای بری، همه‌جوره برایت چیدیم
            </p>
          </div>
        </FadeIn>

        {/* ── گرید آیتم‌ها ── */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-14 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {types.map((type, index) => {
            const config = propertyTypeConfig[type];
            const count = counts?.[type] ?? 0;
            const Icon = config.icon;

            return (
              <FadeIn key={type} delay={index * 70} direction="up">
                <Link
                  to={`/hotels?propertyType=${type}`}
                  className="group relative flex flex-col items-center gap-4 overflow-hidden rounded-2xl border border-neutral-200/70 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-elevated"
                >
                  {/* حباب آیکون */}
                  <span className={`relative flex h-16 w-16 items-center justify-center rounded-2xl ${config.iconBg} transition-all duration-500 group-hover:scale-110 ${config.color} group-hover:shadow-float`}>
                    <Icon className="h-7 w-7 transition-transform duration-500 group-hover:rotate-6" aria-hidden />
                    {/* حلقه شعاع هنگام hover */}
                    <span
                      className={`pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-transparent transition-all duration-500 ${config.ringColor}`}
                      aria-hidden
                    />
                  </span>

                  {/* متن */}
                  <div className="text-center">
                    <p className="text-sm font-bold text-neutral-900 transition-colors duration-300 group-hover:text-neutral-800">
                      {config.label}
                    </p>
                    <p className="mt-1 text-xs text-neutral-500">
                      <span className="tabular-price font-semibold text-neutral-700">
                        {count}
                      </span>{" "}
                      اقامتگاه
                    </p>
                  </div>

                  {/* فلش */}
                  <div className="absolute inset-x-0 bottom-0 flex justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="mb-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-white shadow-card">
                      <ArrowLeft className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </FadeIn>
            );
          })}
        </div>

        {/* ── لینک مشاهده همه — دسکتاپ ── */}
        <FadeIn delay={500}>
          <div className="mt-10 hidden justify-center lg:flex">
            <Link
              to="/hotels"
              className="group inline-flex items-center gap-2.5 rounded-full border border-neutral-200 bg-white px-6 py-2.5 text-sm font-semibold text-primary-700 shadow-card transition-all duration-300 hover:border-primary-300 hover:shadow-elevated"
            >
              مشاهده همه اقامتگاه‌ها
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}