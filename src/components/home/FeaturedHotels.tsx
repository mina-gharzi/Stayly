// src/components/home/FeaturedHotels.tsx
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { hotels } from "@/data/hotels";
import { HotelCard } from "@/components/hotel/HotelCard";

export function FeaturedHotels() {
  const featured = [...hotels]
    .sort((a, b) => b.guestRating - a.guestRating)
    .slice(0, 6);

  return (
    <section className="bg-neutral-100/60">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <div className="rounded-2xl bg-white p-6 shadow-elevated sm:p-10">
          {/* هدر سکشن — وسطچین */}
          <div className="text-center">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-primary-600">
              Featured
            </p>
            <h2 className="mt-2 text-2xl font-bold text-primary-600 sm:text-3xl">
              هتل های ویژه
            </h2>
          </div>

          {/* گرید کارتها */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {featured.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}

            {/* کارت CTA — «مشاهده همه» (موبایل و تبلت) */}
            <Link
              to="/hotels"
              className="group relative flex aspect-4/3 flex-col items-center justify-center gap-2 overflow-hidden rounded-lg bg-linear-to-br from-primary-600 to-primary-700 p-4 text-center text-white shadow-card transition-shadow hover:shadow-elevated sm:col-span-2 sm:aspect-auto lg:hidden"
            >
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-white/70">
                Featured
              </span>
              <span className="text-lg font-bold">مشاهده همه</span>
              <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:scale-110">
                <ArrowLeft className="h-4 w-4" />
              </span>
            </Link>
          </div>

          {/* دکمه مشاهده همه — زیر کارتها، فقط دسکتاپ */}
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
