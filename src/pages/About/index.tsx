// src/pages/About/index.tsx
import { Link } from "react-router-dom";
import { Globe2, ShieldCheck, HeartHandshake, ArrowLeft } from "lucide-react";
import { hotels } from "@/data/hotels";
import { cities } from "@/data/cities";
import { reviews } from "@/data/reviews";
import aboutHeroImg from "@/assets/about-us.webp";

const stats = [
  { label: "اقامتگاه", value: hotels.length },
  { label: "مقصد", value: cities.length },
  { label: "نظر ثبت‌شده", value: reviews.length },
];

const values = [
  {
    icon: Globe2,
    title: "مقصدهای منتخب",
    desc: "اقامتگاه‌هایی با دقت و بر اساس کیفیت واقعی انتخاب شده‌اند.",
  },
  {
    icon: ShieldCheck,
    title: "رزرو مطمئن",
    desc: "فرآیند شفاف رزرو و پرداخت، بدون هزینه‌های پنهان.",
  },
  {
    icon: HeartHandshake,
    title: "پشتیبانی همیشگی",
    desc: "تیم پشتیبانی برای کمک در هر مرحله از سفر.",
  },
];

export function About() {
  return (
    <div className="min-h-screen bg-neutral-100/60">
      {/* ═══ هیرو + آمار شناور ═══ */}
      <div className="overflow-hidden">
        {/* هیرو با عکس */}
        <section className="relative px-4 pt-24 pb-28 sm:pt-32 sm:pb-36">
          <div className="absolute inset-0">
            <img
              src={aboutHeroImg}
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-neutral-900/60" />
          </div>

          <div className="relative mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Stayly
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-white/80">
              پلتفرم رزرو هتل که سفر رو آسان، شفاف و لذت‌بخش می‌کنه.
            </p>
          </div>
        </section>

        {/* آمار شناور */}
        <div className="relative z-10 mx-auto -mt-12 max-w-3xl px-4">
          <div className="grid grid-cols-3 gap-3 rounded-lg bg-white p-6 shadow-elevated sm:p-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-mono text-2xl font-bold tabular-nums text-neutral-900 sm:text-3xl">
                  {stat.value}+
                </p>
                <p className="mt-1 text-xs text-neutral-600 sm:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ ماموریت ═══ */}
      <section className="mx-auto max-w-3xl px-4 pt-20">
        <h2 className="text-xl font-bold text-neutral-900">ماموریت ما</h2>
        <p className="mt-4 text-lg leading-loose text-neutral-600">
          ما بر این باوریم که هر سفری نیازمند آرامش است. Stayly با ارائه اطلاعات
          دقیق، قیمت شفاف و پشتیبانی واقعی، تجربه رزرو هتل رو برای شما
          لذت‌بخش‌تر می‌کنه.
        </p>
      </section>

      {/* ═══ ارزش‌ها ═══ */}
      <section className="mx-auto max-w-3xl px-4 pt-16">
        <h2 className="text-xl font-bold text-neutral-900">ارزش‌ها</h2>
        <div className="mt-6 flex flex-col gap-4">
          {values.map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-4 rounded-lg border border-neutral-200 bg-white p-5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary-50">
                <item.icon className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="font-bold text-neutral-900">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-neutral-600">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="mx-auto max-w-3xl px-4 pt-16">
        <div className="rounded-lg bg-primary-700 p-10 text-center sm:p-14">
          <h2 className="text-xl font-bold text-white">آماده سفر هستید؟</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-white">
            بهترین اقامتگاه‌ها رو از بین صدها گزینه پیدا کنید و با خیال راحت
            رزرو کنید.
          </p>
          <Link
            to="/hotels"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary-50 px-6 py-3 text-sm font-medium text-primary-900 shadow-card transition hover:shadow-elevated"
          >
            <span>مشاهده اقامتگاه‌ها</span>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <div className="h-24" />
    </div>
  );
}
