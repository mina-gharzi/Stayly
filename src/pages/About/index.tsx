// src/pages/About/index.tsx
import { Globe2, ShieldCheck, HeartHandshake } from 'lucide-react'
import { hotels } from '@/data/hotels'
import { cities } from '@/data/cities'
import { reviews } from '@/data/reviews'

export function About() {
  const stats = [
    { label: 'اقامتگاه', value: hotels.length },
    { label: 'مقصد', value: cities.length },
    { label: 'نظر ثبت‌شده', value: reviews.length },
  ]

  const values = [
    { icon: Globe2, title: 'مقصدهای منتخب', desc: 'اقامتگاه‌هایی که با دقت و بر اساس کیفیت واقعی انتخاب شده‌اند.' },
    { icon: ShieldCheck, title: 'رزرو مطمئن', desc: 'فرآیند شفاف رزرو و پرداخت، بدون هزینه‌های پنهان.' },
    { icon: HeartHandshake, title: 'پشتیبانی همیشگی', desc: 'تیم پشتیبانی برای کمک به شما در هر مرحله از سفر.' },
  ]

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-neutral-900">درباره Stayly</h1>
        <p className="mx-auto mt-3 max-w-2xl text-neutral-600">
          Stayly یک پلتفرم رزرو هتل است که به شما کمک می‌کند بهترین اقامتگاه‌ها را در مقصدهای محبوب پیدا کنید،
          مقایسه کنید و با اطمینان رزرو کنید.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-3 gap-4 rounded-lg border border-neutral-200 p-6 text-center">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="tabular-nums text-3xl font-bold text-primary-700">{stat.value}+</p>
            <p className="mt-1 text-sm text-neutral-600">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {values.map((item) => (
          <div key={item.title} className="rounded-lg border border-neutral-200 p-6 text-center">
            <item.icon className="mx-auto h-8 w-8 text-primary-700" aria-hidden />
            <p className="mt-3 font-semibold text-neutral-900">{item.title}</p>
            <p className="mt-1 text-sm text-neutral-600">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}