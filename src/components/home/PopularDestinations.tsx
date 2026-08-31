// src/components/home/PopularDestinations.tsx
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { cities } from "@/data/cities";
import { FadeIn } from "@/components/common/FadeIn";

export function PopularDestinations() {
  const displayCities = cities.slice(0, 5);

  return (
    <section className="bg-neutral-100/60">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <FadeIn>
          <div className="rounded-2xl bg-white p-6 shadow-elevated sm:p-10">
            {/* هدر سکشن — وسطچین */}
            <div className="text-center">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-primary-600">
                Destinations
              </p>
              <h2 className="mt-2 text-2xl font-bold text-primary-600 sm:text-3xl">
                مقصدهای محبوب
              </h2>
            </div>

            {/* گرید کارتها */}
            <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5 lg:gap-6">
              {displayCities.map((city, index) => (
                <FadeIn key={city.id} delay={index * 100} direction="up">
                  <Link
                    to={`/hotels?destination=${city.id}`}
                    className="group relative block aspect-4/3 overflow-hidden rounded-lg shadow-card transition-shadow hover:shadow-elevated sm:aspect-3/4"
                  >
                    <img
                      src={city.image}
                      alt={city.name}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-linear-to-t from-neutral-900/90 via-neutral-900/30 to-black/10 transition-opacity duration-500 group-hover:opacity-90" />

                    <span className="absolute right-3 top-3 font-mono text-xs font-medium text-white/80 sm:right-4 sm:top-4 sm:text-sm">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-3 text-white sm:p-4 lg:p-5">
                      <p className="font-mono text-base font-bold uppercase tracking-widest transition-transform duration-500 group-hover:-translate-y-1 sm:text-lg xl:text-xl">
                        {city.name}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] text-white/70 transition-transform duration-500 group-hover:-translate-y-1 sm:text-sm">
                          {city.country}
                        </p>
                        <div className="flex h-7 w-7 translate-x-4 items-center justify-center rounded-full bg-primary-600 text-white opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100 sm:h-8 sm:w-8">
                          <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </FadeIn>
              ))}

              {/* کارت CTA — «مشاهده همه» (موبایل و تبلت) */}
              <FadeIn delay={500} direction="up">
                <Link
                  to="/hotels"
                  className="group relative flex aspect-4/3 flex-col items-center justify-center gap-2 overflow-hidden rounded-lg bg-linear-to-br from-primary-600 to-primary-700 p-4 text-center text-white shadow-card transition-shadow hover:shadow-elevated sm:aspect-3/4 lg:hidden"
                >
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-white/70">
                    Destinations
                  </span>
                  <span className="text-lg font-bold">مشاهده همه</span>
                  <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:scale-110">
                    <ArrowLeft className="h-4 w-4" />
                  </span>
                </Link>
              </FadeIn>
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
        </FadeIn>
      </div>
      <div className="mx-auto max-w-7xl px-4" aria-hidden>
        <div className="h-px w-full bg-neutral-200" />
      </div>
    </section>
  );
}
