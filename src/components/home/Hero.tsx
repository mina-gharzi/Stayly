// src/components/home/Hero.tsx
import heroImage from "@/assets/hero.webp";
import { SearchBox } from "./SearchBox";
import { FadeIn } from "@/components/common/FadeIn";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* ── پس‌زمینه + overlay ملایم ── */}
      <div className="absolute inset-0 -z-10">
        <img src={heroImage} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-neutral-900/50" />
        {/* گرادینت ملایم فقط برای خوانایی متن */}
        <div className="absolute inset-0 bg-linear-to-t from-neutral-900/80 via-neutral-900/20 to-neutral-900/40" />
      </div>

      {/* ── محتوا ── */}
      <div className="mx-auto flex min-h-[78vh] max-w-7xl flex-col items-center justify-center px-4 py-20 text-center text-white sm:min-h-[85vh] sm:py-24">
        <FadeIn>
          <div className="mx-auto max-w-3xl">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-medium text-white/80 backdrop-blur-md sm:text-sm">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success-500" />
              اقامتگاه‌های منتخب در ۵ مقصد محبوب
            </p>

            <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              هر جا بری،
              <span className="mt-1 block bg-linear-to-l from-primary-300 to-white bg-clip-text text-transparent">
                یه جای خوب برای موندن
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
              هتل و اقامتگاه‌های منتخب را در مقصد محبوبت پیدا کن و با بهترین
              قیمت رزرو کن
            </p>
          </div>
        </FadeIn>

        {/* ── نوار جستجو ── */}
        <FadeIn delay={150}>
          <div className="mx-auto mt-10 w-full max-w-4xl sm:mt-12">
            <SearchBox />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
