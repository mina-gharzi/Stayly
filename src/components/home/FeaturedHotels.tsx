// src/components/home/FeaturedHotels.tsx
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useFeaturedHotels } from "@/hooks/useCatalog";
import { HotelCard } from "@/components/hotel/HotelCard";
import { HotelCardSkeleton } from "@/components/hotel/HotelCardSkeleton";
import { FadeIn } from "@/components/common/FadeIn";

export function FeaturedHotels() {
  const { data, isLoading } = useFeaturedHotels();
  const featured = data?.data ?? [];

  return (
    <section className="bg-neutral-100/60">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <FadeIn>
          <div className="rounded-2xl bg-white p-6 shadow-elevated sm:p-10">
            {/* هدر سکشن — وسطچین */}
            <div className="text-center">
              <p className="font-mono text-xs font-semibold uppercase tracking-wide text-primary-600">
                Featured
              </p>
              <h2 className="mt-2 text-2xl font-bold text-primary-600 sm:text-3xl">
                هتلهای ویژه
              </h2>
            </div>

            {/* گرید کارتها — موبایل ۳ تا، از sm به بالا ۶ تا */}
            <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
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

            {/* دکمه مشاهده همه — موبایل و تبلت */}
            <div className="mt-8 flex justify-center lg:hidden">
              <Link
                to="/hotels"
                className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-card transition-colors hover:bg-primary-700"
              >
                مشاهده همه هتلها
                <ArrowLeft className="h-4 w-4" />
              </Link>
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
        </FadeIn>
      </div>
    </section>
  );
}
