// src/components/home/FeaturedHotels.tsx
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useFeaturedHotels } from "@/hooks/useCatalog";
import { HotelCard } from "@/components/hotel/HotelCard";
import { HotelCardSkeleton } from "@/components/hotel/HotelCardSkeleton";
import { FadeIn } from "@/components/common/FadeIn";

export function FeaturedHotels() {
  const { data, isLoading } = useFeaturedHotels();
  const featured = data?.data ?? [];

  return (
    <section className="relative overflow-hidden bg-neutral-50">
      {/* الگوی نقطه‌ای پس‌زمینه */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40 pattern-dots-lg"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:py-24">
        {/* ── هدر سکشن: سردبیری — کنار هم در دسکتاپ ── */}
        <FadeIn>
          <div className="flex flex-col items-center gap-3 text-center lg:flex-row lg:justify-between lg:items-end lg:text-start">
            <div className="flex flex-col items-center gap-3 lg:items-start">
              <div className="flex items-center gap-2 rounded-full border border-primary-200/70 bg-primary-50/80 px-4 py-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary-600" aria-hidden />
                <span className="font-mono text-xs font-semibold uppercase tracking-wide text-primary-700">
                  Featured
                </span>
              </div>
              <h2 className="mt-1 text-2xl font-extrabold text-neutral-900 sm:text-3xl lg:text-4xl">
                هتل‌های ویژه
              </h2>
              <p className="max-w-md text-sm text-neutral-500 sm:text-base">
                منتخبی از محبوب‌ترین و باکیفیت‌ترین اقامتگاه‌های Stayly
              </p>
            </div>

            {/* لینک مشاهده همه — فقط دسکتاپ */}
            <Link
              to="/hotels"
              className="group hidden shrink-0 items-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-primary-700 shadow-card transition-all duration-300 hover:border-primary-300 hover:shadow-elevated lg:inline-flex"
            >
              مشاهده همه
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            </Link>
          </div>
        </FadeIn>

        {/* ── گرید کارت‌ها ── */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:mt-14 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {isLoading &&
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-full">
                <HotelCardSkeleton />
              </div>
            ))}
          {featured.map((hotel, index) => (
            <FadeIn
              key={hotel.id}
              delay={index * 80}
              direction="up"
              className={`h-full ${index >= 3 ? "hidden sm:block" : ""}`}
            >
              <HotelCard hotel={hotel} />
            </FadeIn>
          ))}
        </div>

        {/* ── دکمه مشاهده همه — موبایل و تبلت ── */}
        <div className="mt-8 flex justify-center lg:hidden">
          <Link
            to="/hotels"
            className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-elevated"
          >
            مشاهده همه هتل‌ها
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}