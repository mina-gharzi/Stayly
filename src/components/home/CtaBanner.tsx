// src/components/home/CtaBanner.tsx
import { Link } from "react-router-dom";
import { ArrowLeft, Plane } from "lucide-react";
import { FadeIn } from "@/components/common/FadeIn";

export function CtaBanner() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary-700 via-primary-600 to-primary-800 p-10 text-center shadow-elevated sm:p-16">
            {/* المان دکوراتیو */}
            <div
              className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/5 blur-2xl"
              aria-hidden
            />

            <div className="relative z-10">
              <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-sm">
                <Plane className="h-6 w-6 -rotate-45" aria-hidden />
              </span>
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
                سفرت رو همین الان شروع کن
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-white/70 sm:text-base">
                صدها اقامتگاه منتخب در بهترین مقصدها منتظر تو هستن
              </p>
              <Link
                to="/hotels"
                className="mt-7 inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-primary-700 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elevated"
              >
                مشاهده اقامتگاه‌ها
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
