// src/components/layout/Footer.tsx
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  ArrowLeft,
  Send,
  Shield,
  CreditCard,
  Globe,
} from "lucide-react";
import { getCities } from "@/services/catalog";

/* ──────────────────────── لینکها ──────────────────────── */
const exploreLinks = [
  { label: "جستجوی هتل‌ها", to: "/hotels" },
  { label: "درباره ما", to: "/about" },
  { label: "تماس با ما", to: "/contact" },
];

const accountLinks = [
  { label: "ورود", to: "/login" },
  { label: "ثبت‌نام", to: "/register" },
  { label: "رزروهای من", to: "/my-bookings" },
  { label: "علاقه‌مندی‌ها", to: "/favorites" },
];

/* ──────────────────────── سوشال ──────────────────────── */
function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="7" cy="7" r="0.6" fill="currentColor" />
      <path d="M11 17v-4a2 2 0 0 1 4 0v4" />
      <line x1="11" y1="10" x2="11" y2="17" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path d="M15 3h-2a4 4 0 0 0-4 4v3H6v4h3v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function TwitterXIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
      <path d="M4 4l6.5 8L4 20h2l5.2-6.4L15 20h5l-6.8-8.4L19.5 4h-2l-4.8 5.9L8 4H4z" />
    </svg>
  );
}

const socialLinks = [
  { label: "اینستاگرام", Icon: InstagramIcon, href: "#" },
  { label: "لینکدین", Icon: LinkedinIcon, href: "#" },
  { label: "فیسبوک", Icon: FacebookIcon, href: "#" },
  { label: "X", Icon: TwitterXIcon, href: "#" },
];

/* ──────────────────────── کامپوننت اصلی ──────────────────────── */
export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const topCities = getCities().slice(0, 4);

  function handleSubscribe(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  }

  return (
    <footer className="relative overflow-hidden bg-neutral-900 text-neutral-400">
      {/* ── الگوی نقطه‌ای دکوراتیو ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] pattern-dots"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary-600/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-primary-800/10 blur-3xl"
        aria-hidden
      />

      <div className="relative">
        {/* ════════════════ نوار خبرنامه ════════════════ */}
        <div className="border-b border-neutral-800/60">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-10 sm:flex-row sm:justify-between sm:px-8 lg:py-14">
            <div>
              <h3 className="text-base font-bold text-white sm:text-lg">
                از تخفیف‌ها و اقامتگاه‌های جدید باخبر شو
              </h3>
              <p className="mt-1 text-sm text-neutral-500">
                هر هفته پیشنهادات ویژه و اقامتگاه‌های جدید رو ایمیل بگیر
              </p>
            </div>
            <form
              onSubmit={handleSubscribe}
              className="flex w-full max-w-sm items-center gap-2 sm:w-auto"
            >
              <div className="relative flex-1 sm:flex-1">
                <Mail className="pointer-events-none absolute inset-s-3 h-4 w-4 text-neutral-500" aria-hidden />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ایمیلت رو بنویس..."
                  required
                  className="h-11 w-full rounded-xl border border-neutral-700 bg-neutral-800/80 ps-9 pe-4 text-sm text-white placeholder-neutral-500 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
              <button
                type="submit"
                className="flex h-11 shrink-0 items-center gap-2 rounded-xl bg-primary-600 px-5 text-sm font-semibold text-white transition-all duration-300 hover:bg-primary-500 hover:shadow-[0_0_20px_rgba(168,132,132,0.25)] active:scale-95"
              >
                {subscribed ? (
                  <>
                    <span className="text-xs">ارسال شد ✓</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" aria-hidden />
                    <span className="hidden sm:inline">عضویت</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* ════════════════ بخش اصلی ════════════════ */}
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8 lg:py-16">
          <div className="grid grid-cols-2 gap-x-6 gap-y-9 sm:gap-x-10 lg:grid-cols-12 lg:gap-y-0">
            {/* ── برند + توضیحات ── */}
            <div className="col-span-2 lg:col-span-4">
              <Link to="/" className="group inline-flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-base font-bold text-white shadow-lg shadow-primary-900/30 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
                  S
                </span>
                <span className="font-display text-2xl font-bold tracking-tight text-white">
                  Stay<span className="text-primary-400">ly</span>
                </span>
              </Link>
              <p className="mt-4 max-w-xs text-sm leading-6 text-neutral-500">
                پلتفرم هوشمند رزرو اقامتگاه؛ مقایسه قیمت، مشاهده نظرات واقعی و رزرو
                آنلاین با بهترین قیمت در مقصدهای محبوب ایران و جهان.
              </p>

              {/* دکمه شروع جستجو */}
              <Link
                to="/hotels"
                className="group mt-5 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-900/40"
              >
                شروع جستجو
                <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              </Link>

              {/* شبکه‌های اجتماعی */}
              <div className="mt-6 flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="group flex h-10 w-10 items-center justify-center rounded-full border border-neutral-700 bg-neutral-800/50 text-neutral-500 transition-all duration-300 hover:-translate-y-1 hover:border-primary-500 hover:bg-primary-600 hover:text-white hover:shadow-[0_0_16px_rgba(168,132,132,0.2)]"
                  >
                    <social.Icon />
                  </a>
                ))}
              </div>
            </div>

            {/* ── مقصدهای محبوب ── */}
            <div className="lg:col-span-2">
              <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-800 text-primary-400">
                  <MapPin className="h-3.5 w-3.5" />
                </span>
                مقصدهای محبوب
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {topCities.map((city) => (
                  <li key={city.id}>
                    <Link
                      to={`/hotels?destination=${city.id}`}
                      className="group flex items-center gap-2.5 text-sm text-neutral-500 transition-colors duration-300 hover:text-primary-400"
                    >
                      <span className="h-1 w-1 shrink-0 rounded-full bg-neutral-700 transition-colors duration-300 group-hover:bg-primary-400" />
                      <span className="truncate">{city.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── کاوش ── */}
            <div className="lg:col-span-2">
              <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-800 text-primary-400">
                  <Globe className="h-3.5 w-3.5" />
                </span>
                کاوش
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {exploreLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="group flex items-center gap-2.5 text-sm text-neutral-500 transition-colors duration-300 hover:text-primary-400"
                    >
                      <span className="h-1 w-1 shrink-0 rounded-full bg-neutral-700 transition-colors duration-300 group-hover:bg-primary-400" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── حساب کاربری ── */}
            <div className="lg:col-span-2">
              <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-800 text-primary-400">
                  <CreditCard className="h-3.5 w-3.5" />
                </span>
                حساب کاربری
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {accountLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="group flex items-center gap-2.5 text-sm text-neutral-500 transition-colors duration-300 hover:text-primary-400"
                    >
                      <span className="h-1 w-1 shrink-0 rounded-full bg-neutral-700 transition-colors duration-300 group-hover:bg-primary-400" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── تماس با ما ── */}
            <div className="lg:col-span-2">
              <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-800 text-primary-400">
                  <Phone className="h-3.5 w-3.5" />
                </span>
                تماس با ما
              </h3>
              <ul className="mt-4 flex flex-col gap-4">
                <li>
                  <a
                    href="mailto:support@stayly.com"
                    className="group flex items-start gap-3 text-sm text-neutral-500 transition-colors duration-300 hover:text-primary-400"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-800 text-neutral-600 transition-colors duration-300 group-hover:bg-primary-600/20 group-hover:text-primary-400">
                      <Mail className="h-3.5 w-3.5" />
                    </span>
                    <span className="mt-0.5 ltr-content">support@stayly.com</span>
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+982112345678"
                    className="group flex items-start gap-3 text-sm text-neutral-500 transition-colors duration-300 hover:text-primary-400"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-800 text-neutral-600 transition-colors duration-300 group-hover:bg-primary-600/20 group-hover:text-primary-400">
                      <Phone className="h-3.5 w-3.5" />
                    </span>
                    <span className="mt-0.5 ltr-content">+98 21 1234 5678</span>
                  </a>
                </li>
                <li className="flex items-start gap-3 text-sm text-neutral-500">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-800 text-neutral-600">
                    <MapPin className="h-3.5 w-3.5" />
                  </span>
                  <span className="mt-0.5 leading-6">
                    تهران، خیابان ولیعصر
                  </span>
                </li>
              </ul>

              {/* نشانه‌های اعتماد — فقط دسکتاپ */}
              <div className="mt-7 hidden items-center gap-3 lg:flex">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-800/50 text-neutral-600" title="امنیت پرداخت">
                  <Shield className="h-5 w-5" />
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-800/50 text-neutral-600" title="پرداخت امن">
                  <CreditCard className="h-5 w-5" />
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-800/50 text-neutral-600" title="پشتیبانی ۲۴/۷">
                  <Phone className="h-5 w-5" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════ بار پایینی ════════════════ */}
        <div className="border-t border-neutral-800/60">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 sm:flex-row sm:px-8">
            <p className="text-center text-xs text-neutral-600 sm:text-start">
              © {new Date().getFullYear()} Stayly — تمامی حقوق محفوظ است
            </p>
            <div className="flex items-center gap-4 text-xs text-neutral-600">
              <Link to="/about" className="transition-colors hover:text-primary-400">
                حریم خصوصی
              </Link>
              <span className="text-neutral-800">|</span>
              <Link to="/about" className="transition-colors hover:text-primary-400">
                شرایط استفاده
              </Link>
              <span className="text-neutral-800">|</span>
              <Link to="/contact" className="transition-colors hover:text-primary-400">
                نقشه سایت
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}