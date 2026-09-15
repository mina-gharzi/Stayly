// src/components/home/PopularDestinations.tsx
import { Link } from "react-router-dom";
import { ArrowLeft, MapPin } from "lucide-react";
import { getCities } from "@/services/catalog";
import { useHotelCountsByCity } from "@/hooks/useCatalog";
import { FadeIn } from "@/components/common/FadeIn";

export function PopularDestinations() {
  const displayCities = getCities().slice(0, 5);
  const [featured, ...rest] = displayCities;
  const { data: counts } = useHotelCountsByCity();

  const hotelCount = (cityId: string) => counts?.[cityId] ?? 0;

  return (
    <section className="relative overflow-hidden bg-neutral-100/60">
      {/* المان دکوراتیو پس‌زمینه */}
      <div
        className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary-200/30 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-40 -right-24 h-80 w-80 rounded-full bg-primary-100/40 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:py-24">
        {/* ── هدر سکشن ── */}
        <FadeIn>
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex items-center gap-2 rounded-full border border-primary-200/70 bg-primary-50 px-4 py-1.5">
              <MapPin className="h-3.5 w-3.5 text-primary-600" aria-hidden />
              <span className="font-mono text-xs font-semibold uppercase tracking-wide text-primary-700">
                Destinations
              </span>
            </div>
            <h2 className="mt-1 text-2xl font-extrabold text-neutral-900 sm:text-3xl lg:text-4xl">
              مقصدهای محبوب
            </h2>
            <p className="max-w-md text-sm text-neutral-500 sm:text-base">
              از کوه‌های البرز تا سواحل خلیج فارس، جایی که دلت می‌خواد
            </p>
          </div>
        </FadeIn>

        {/* ── گرید نامتقارن: ۱ بزرگ + ۴ کوچک ── */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-4 lg:grid-cols-4 lg:grid-rows-2">
          {/* کارت بزرگ — اولین مقصد */}
          <FadeIn direction="up" className="col-span-2 lg:col-span-2 lg:row-span-2">
            <Link
              to={`/hotels?destination=${featured.id}`}
              className="group relative block h-full min-h-64 overflow-hidden rounded-2xl shadow-card transition-all duration-500 hover:-translate-y-0.5 hover:shadow-elevated sm:min-h-80 lg:min-h-[520px]"
            >
              <img
                src={featured.image}
                alt={featured.name}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-linear-to-t from-neutral-900/90 via-neutral-900/30 to-transparent transition-opacity duration-500 group-hover:from-neutral-900/95" />

              {/* شماره + تعداد اقامتگاه */}
              <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5 sm:p-7">
                <span className="font-mono text-sm font-semibold text-white/60 transition-colors duration-500 group-hover:text-white/90">
                  ۰۱
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-md transition-colors duration-500 group-hover:border-primary-400/40 group-hover:bg-primary-600/60">
                  <MapPin className="h-3 w-3" aria-hidden />
                  {hotelCount(featured.id)} اقامتگاه
                </span>
              </div>

              {/* متن */}
              <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end gap-3 p-5 text-white sm:p-7">
                <p className="font-mono text-xl font-bold uppercase tracking-widest transition-transform duration-500 sm:text-2xl lg:text-3xl">
                  {featured.name}
                </p>
                <p className="text-xs text-white/60 sm:text-sm">
                  {featured.country}
                </p>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/0 text-white opacity-0 ring-1 ring-white/30 transition-all duration-500 group-hover:translate-y-0 group-hover:bg-primary-600 group-hover:opacity-100 group-hover:ring-primary-600 sm:h-10 sm:w-10">
                  <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
              </div>
            </Link>
          </FadeIn>

          {/* کارت‌های کوچک */}
          {rest.map((city, index) => (
            <FadeIn
              key={city.id}
              delay={150 + index * 100}
              direction="up"
              className="col-span-1"
            >
              <Link
                to={`/hotels?destination=${city.id}`}
                className="group relative block h-full overflow-hidden rounded-xl shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elevated sm:rounded-2xl"
              >
                <div className="aspect-3/4 lg:aspect-auto lg:h-full">
                  <img
                    src={city.image}
                    alt={city.name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                <div className="absolute inset-0 bg-linear-to-t from-neutral-900/90 via-neutral-900/35 to-transparent transition-opacity duration-500 group-hover:opacity-90" />

                {/* شماره + تعداد */}
                <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3 sm:p-4">
                  <span className="font-mono text-[11px] font-semibold text-white/50 transition-colors duration-300 group-hover:text-white/80">
                    {String(index + 2).padStart(2, "0")}
                  </span>
                  <span className="flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/80 backdrop-blur-md transition-colors duration-300 group-hover:bg-primary-600/60 sm:text-[11px]">
                    <MapPin className="h-2.5 w-2.5" aria-hidden />
                    {hotelCount(city.id)}
                  </span>
                </div>

                {/* نام شهر + کشور */}
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 sm:p-4">
                  <div className="flex flex-col gap-0.5">
                    <p className="font-mono text-sm font-bold uppercase tracking-widest transition-transform duration-500 group-hover:-translate-y-0.5 sm:text-base">
                      {city.name}
                    </p>
                    <p className="text-[10px] text-white/60 group-hover:hidden sm:text-xs">
                      {city.country}
                    </p>
                  </div>
                  <span className="flex h-7 w-7 shrink-0 translate-x-3 items-center justify-center rounded-full bg-primary-600 text-white opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100 sm:h-8 sm:w-8">
                    <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </span>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>

        {/* ── لینک مشاهده همه — موبایل و تبلت ── */}
        <div className="mt-8 flex justify-center lg:hidden">
          <Link
            to="/hotels"
            className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-elevated"
          >
            مشاهده همه مقصدها
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>

        {/* ── لینک مشاهده همه — دسکتاپ ── */}
        <FadeIn delay={600}>
          <div className="mt-10 hidden justify-center lg:flex">
            <Link
              to="/hotels"
              className="group inline-flex items-center gap-2.5 rounded-full border border-neutral-200 bg-white px-6 py-2.5 text-sm font-semibold text-primary-700 shadow-card transition-all duration-300 hover:border-primary-300 hover:shadow-elevated"
            >
              مشاهده همه مقصدها
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}