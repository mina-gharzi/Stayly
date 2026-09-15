// src/components/home/WhyStayly.tsx
import { useState, useEffect } from "react";
import { Shield, Clock, CreditCard, Headphones } from "lucide-react";
import { useCatalogStats } from "@/hooks/useCatalog";
import { FadeIn } from "@/components/common/FadeIn";

/* ──────────────────────── شمارنده انیمیشنی ──────────────────────── */
function AnimatedCounter({ value }: { value: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!value) return;
    let start = 0;
    const duration = 1200;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setCount(Math.floor((1 - Math.pow(2, -10 * p)) * value));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value]);

  return <span className="tabular-nums">{count.toLocaleString("fa-IR")}</span>;
}

/* ──────────────────────── پیکربندی ویژگی‌ها ──────────────────────── */
const features = [
  {
    icon: Shield,
    title: "رزرو مطمئن",
    desc: "بدون هزینه پنهان، پرداخت امن و رمزنگاری‌شده",
  },
  {
    icon: Clock,
    title: "لغو رایگان",
    desc: "تا ۲۴ ساعت قبل از ورود بدون جریمه",
  },
  {
    icon: CreditCard,
    title: "بهترین قیمت",
    desc: "تضمین پایین‌ترین نرخ در بازار",
  },
  {
    icon: Headphones,
    title: "پشتیبانی ۲۴/۷",
    desc: "تیم مجرب همیشه در دسترس شما",
  },
];

/* ──────────────────────── آمار ──────────────────────── */
const statItems = [
  { label: "اقامتگاه", key: "hotels" as const },
  { label: "مقصد", key: "cities" as const },
  { label: "نظر ثبت‌شده", key: "reviews" as const },
];

/* ──────────────────────── کامپوننت اصلی ──────────────────────── */
export function WhyStayly() {
  const { data, isLoading } = useCatalogStats();

  return (
    <section className="relative overflow-hidden bg-white">
      {/* ── الگوی نقطه‌ای دکوراتیو ── */}
      <div
        className="pointer-events-none absolute inset-0 pattern-dots opacity-[var(--opacity-deco-light)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:py-20">
        {/* ── هدر سکشن ── */}
        <FadeIn>
          <div className="text-center">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[var(--tracking-wide)] text-primary-600">
              Why Stayly
            </p>
            <h2 className="mt-3 text-[20px] font-[700] text-neutral-900 sm:text-[24px]">
              چرا{" "}
              <span className="text-primary-700">پلتفرم ما</span> ؟
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-neutral-400">
              تجربه‌ای متفاوت از رزرو اقامتگاه با تضمین کیفیت و قیمت منصفانه
            </p>
          </div>
        </FadeIn>

        {/* ── پنل آمار ── */}
        <FadeIn delay={100}>
          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-[1px] overflow-hidden rounded-[20px] border border-neutral-200 bg-neutral-200 sm:mt-12">
            {statItems.map((stat, i) => (
              <div
                key={stat.key}
                className="flex flex-col items-center gap-1 bg-white px-4 py-5 sm:px-8 sm:py-6"
              >
                {isLoading ? (
                  <div className="h-6 w-16 animate-pulse rounded-md bg-neutral-100" />
                ) : (
                  <p className="text-[20px] font-[800] tabular-nums text-neutral-900 sm:text-[24px]">
                    <AnimatedCounter value={data?.[stat.key] ?? 0} />+
                  </p>
                )}
                <p className="text-[11px] font-medium text-neutral-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* ── کارت‌های ویژگی ── */}
        <div className="mx-auto mt-8 grid max-w-4xl grid-cols-2 gap-3 sm:mt-12 sm:grid-cols-4 sm:gap-4">
          {features.map((f, i) => (
            <FadeIn key={f.title} delay={150 + i * 80} direction="up">
              <div className="group relative flex flex-col items-center gap-3 rounded-[20px] border border-neutral-100 bg-white p-5 text-center shadow-[var(--shadow-card)] transition-all duration-[300ms] ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)] sm:p-6">
                {/* شماره ویژگی */}
                <span className="absolute left-3 top-3 text-[10px] font-medium text-neutral-200 transition-colors duration-[200ms] group-hover:text-primary-300">
                  0{i + 1}
                </span>

                {/* ظرف آیکن */}
                <div className="relative">
                  <span className="flex h-[48px] w-[48px] items-center justify-center rounded-[14px] bg-primary-50 transition-all duration-[300ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-105 group-hover:bg-primary-100">
                    <f.icon
                      className="h-5 w-5 text-primary-700"
                      strokeWidth={1.75}
                      aria-hidden
                    />
                  </span>
                </div>

                {/* متن */}
                <div className="space-y-1">
                  <p className="text-[14px] font-[700] text-neutral-900">
                    {f.title}
                  </p>
                  <p className="text-[11px] leading-relaxed text-neutral-400">
                    {f.desc}
                  </p>
                </div>

                {/* خط تزئینی پایین */}
                <div className="absolute inset-x-5 bottom-0 h-px sm:inset-x-6">
                  <div className="h-full origin-right scale-x-0 bg-primary-400 transition-transform duration-[500ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:origin-left group-hover:scale-x-100" />
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* ── خط جداکننده ── */}
        <FadeIn delay={500}>
          <div className="mx-auto mt-12 flex items-center gap-4 sm:mt-16">
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-neutral-200" />
            <span className="text-[11px] font-medium text-neutral-300">
              مورد اعتماد هزاران مسافر
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-neutral-200" />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
