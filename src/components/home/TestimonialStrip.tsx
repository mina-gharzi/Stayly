// src/components/home/TestimonialStrip.tsx
import { Star, Quote } from "lucide-react";
import { FadeIn } from "@/components/common/FadeIn";

const testimonials = [
  {
    name: "Sophie Laurent",
    avatar: "https://i.pravatar.cc/150?img=3",
    location: "پاریس",
    text: "چشم‌انداز خیره‌کننده برج‌های شعله و سرویس‌دهی بی‌نقص. حتماً دوباره برمی‌گردم.",
    rating: 9.5,
  },
  {
    name: "Aylin Demir",
    avatar: "https://i.pravatar.cc/150?img=5",
    location: "استانبول",
    text: "تراس اسپا با چشم‌انداز بسفر فراموش‌نشدنی بود. کارکنان فراتر از انتظار عمل کردند.",
    rating: 9.3,
    featured: true,
  },
  {
    name: "Elena Rossi",
    avatar: "https://i.pravatar.cc/150?img=1",
    location: "دبی",
    text: "شبی جادویی زیر ستاره‌ها در ویلای استخردار. بهترین تجربه سفرم بود.",
    rating: 9.2,
  },
];

export function TestimonialStrip() {
  return (
    <section className="relative overflow-hidden bg-neutral-50">
      {/* ── الگوی نقطه‌ای ── */}
      <div
        className="pointer-events-none absolute inset-0 pattern-dots opacity-(--opacity-deco-light)"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:py-24">
        {/* ── هدر ── */}
        <FadeIn>
          <div className="text-center">
            <p className="font-mono text-[11px] font-medium uppercase tracking-(--tracking-wide) text-primary-600">
              Testimonials
            </p>
            <h2 className="mt-3 text-[20px] font-bold text-neutral-900 sm:text-[24px]">
              نظرات مسافران ما
            </h2>
            <p className="mx-auto mt-3 max-w-sm text-[14px] text-neutral-400">
              نظرات واقعی مسافران ما از سراسر دنیا
            </p>
          </div>
        </FadeIn>

        {/* ── کارت‌ها ── */}
        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-3 sm:gap-5">
          {testimonials.map((t, i) => (
            <FadeIn key={t.name} delay={120 + i * 100} direction="up">
              <div
                className={`group relative flex h-full flex-col rounded-[20px] border p-5 transition-all duration-300 ease-[cubic-bezier(.22,1,.36,1)] sm:p-6 ${
                  "featured" in t && t.featured
                    ? "border-primary-200 bg-white shadow-(--shadow-elevated)"
                    : "border-neutral-100 bg-white shadow-sm hover:-translate-y-1 hover:shadow-(--shadow-elevated)"
                }`}
              >
                {/* ── آیکون نقل‌قول (واترمارک) ── */}
                <Quote
                  className="absolute start-3 top-3 h-10 w-10 text-primary-100 transition-colors duration-300 group-hover:text-primary-200 sm:start-4 sm:top-4"
                  aria-hidden
                />

                {/* ── خط اکسنت بالای کارت featured ── */}
                {"featured" in t && t.featured && (
                  <div className="absolute inset-x-0 top-0 h-px rounded-full bg-linear-to-r from-transparent via-primary-400 to-transparent" />
                )}

                {/* ── متن نظر ── */}
                <p className="relative z-10 mb-5 text-[14px] leading-7 text-neutral-600">
                  «{t.text}»
                </p>

                {/* ── پروفایل ── */}
                <div className="mt-auto flex items-center gap-3 border-t border-neutral-100 pt-4">
                  {/* آواتار */}
                  <div className="relative shrink-0">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-primary-100 transition-all duration-300 group-hover:ring-primary-200"
                    />
                    {/* نقطه وضعیت */}
                    <span className="absolute -bottom-0.5 -left-0.5 h-3 w-3 rounded-full border-2 border-white bg-primary-500" />
                  </div>

                  {/* نام و موقعیت */}
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-bold text-neutral-900">
                      {t.name}
                    </p>
                    <p className="text-[11px] font-medium text-neutral-400">
                      {t.location}
                    </p>
                  </div>

                  {/* نمره */}
                  <span className="flex shrink-0 items-center gap-1 rounded-[10px] bg-primary-50 px-2.5 py-1 text-[11px] font-medium text-primary-700 transition-colors duration-300 group-hover:bg-primary-100">
                    <Star
                      className="h-3 w-3 fill-primary-700 text-primary-700"
                      aria-hidden
                    />
                    {t.rating}
                  </span>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
