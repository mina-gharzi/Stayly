// src/components/layout/Footer.tsx
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, ArrowLeft } from "lucide-react";
import { cities } from "@/data/cities";

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

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="7" y1="10" x2="7" y2="17" />
      <circle cx="7" cy="7" r="0.6" fill="currentColor" />
      <path d="M11 17v-4a2 2 0 0 1 4 0v4" />
      <line x1="11" y1="10" x2="11" y2="17" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <path d="M15 3h-2a4 4 0 0 0-4 4v3H6v4h3v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

const socialLinks = [
  { label: "اینستاگرام", Icon: InstagramIcon, href: "#" },
  { label: "لینکدین", Icon: LinkedinIcon, href: "#" },
  { label: "فیسبوک", Icon: FacebookIcon, href: "#" },
];

function FooterLink({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-2 text-sm text-neutral-600"
    >
      <span className="h-1 w-1 shrink-0 rounded-full bg-neutral-300 transition-colors duration-300 group-hover:bg-primary-600" />
      <span className="relative">
        <span className="transition-colors duration-300 group-hover:text-primary-700">
          {children}
        </span>
        <span className="absolute inset-x-0 -bottom-0.5 h-px origin-right scale-x-0 bg-primary-600 transition-transform duration-300 ease-out group-hover:scale-x-100" />
      </span>
    </Link>
  );
}

export function Footer() {
  const topCities = cities.slice(0, 5);

  return (
    <footer className="relative border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 pt-8 pb-5 sm:pt-10 sm:pb-6 lg:pt-16 lg:pb-8">
        {/* موبایل: ۲ ستون فشرده | دسکتاپ: ۱۲ ستون اصلی */}
        <div className="grid grid-cols-2 gap-x-5 gap-y-7 sm:gap-x-8 sm:gap-y-8 lg:grid-cols-12 lg:gap-y-10">
          {/* ── برند + توضیحات — همیشه عرض کامل ── */}
          <div className="col-span-2 lg:col-span-4">
            <Link
              to="/"
              className="group inline-flex items-center gap-2 sm:gap-2.5"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-primary-500 to-primary-700 font-display text-sm font-bold text-white shadow-card transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3 sm:h-9 sm:w-9 sm:rounded-xl sm:text-lg">
                S
              </span>
              <span className="font-display text-xl font-bold tracking-tight text-primary-600 sm:text-2xl">
                Stay<span className="text-primary-600">ly</span>
              </span>
            </Link>
            <p className="mt-2 max-w-72 whitespace-normal text-xs leading-5 text-neutral-500 sm:mt-3 sm:max-w-65 sm:text-sm sm:leading-6">
              پیدا کردن، مقایسه و رزرو بهترین اقامتگاه‌ها در مقصدهای محبوب.
            </p>

            <div className="mt-3 flex items-center gap-2 sm:mt-4 sm:gap-2.5">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-500 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary-300 hover:text-primary-700 sm:h-9 sm:w-9 sm:rounded-xl"
                >
                  <social.Icon />
                </a>
              ))}
            </div>

            <Link
              to="/hotels"
              className="group mt-3 inline-flex items-center gap-1.5 rounded-lg bg-primary-700 px-3 py-1.5 text-xs font-semibold text-white shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-900 sm:mt-5 sm:gap-2 sm:rounded-xl sm:px-4 sm:py-2 sm:text-sm"
            >
              شروع جستجو
              <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1 sm:h-4 sm:w-4" />
            </Link>
          </div>

          {/* ── مقصدهای محبوب ── */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h3 className="text-xs font-semibold text-neutral-900 sm:text-sm">
              مقصدهای محبوب
            </h3>

            <ul className="mt-2.5 flex flex-col gap-2 sm:mt-4 sm:gap-2.5">
              {topCities.map((city) => (
                <li key={city.id}>
                  <Link
                    to={`/hotels?destination=${city.id}`}
                    className="group flex items-center gap-1.5 text-xs text-neutral-600 transition-colors duration-300 sm:gap-2 sm:text-sm"
                  >
                    <MapPin className="h-3 w-3 shrink-0 text-neutral-400 transition-all duration-300 group-hover:-translate-x-0.5 group-hover:text-primary-600 sm:h-3.5 sm:w-3.5" />
                    <span className="transition-colors duration-300 group-hover:text-primary-700">
                      {city.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── کاوش ── */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold text-neutral-900 sm:text-sm">
              کاوش
            </h3>

            <ul className="mt-2.5 flex flex-col gap-2 sm:mt-4 sm:gap-2.5">
              {exploreLinks.map((link) => (
                <li key={link.to}>
                  <FooterLink to={link.to}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* ── حساب کاربری ── */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold text-neutral-900 sm:text-sm">
              حساب کاربری
            </h3>

            <ul className="mt-2.5 flex flex-col gap-2 sm:mt-4 sm:gap-2.5">
              {accountLinks.map((link) => (
                <li key={link.to}>
                  <FooterLink to={link.to}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* ── تماس با ما ── */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold text-neutral-900 sm:text-sm">
              تماس با ما
            </h3>

            <ul className="mt-2.5 flex flex-col gap-2 sm:mt-4 sm:gap-2.5">
              <li>
                <a
                  href="mailto:support@stayly.com"
                  className="group flex items-center gap-1.5 text-xs text-neutral-600 transition-colors duration-300 sm:gap-2 sm:text-sm"
                >
                  <Mail
                    className="h-3 w-3 shrink-0 text-neutral-400 transition-colors duration-300 group-hover:text-primary-600 sm:h-3.5 sm:w-3.5"
                    aria-hidden
                  />
                  <span className="ltr-content transition-colors duration-300 group-hover:text-primary-700">
                    support@stayly.com
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+982112345678"
                  className="group flex items-center gap-1.5 text-xs text-neutral-600 transition-colors duration-300 sm:gap-2 sm:text-sm"
                >
                  <Phone
                    className="h-3 w-3 shrink-0 text-neutral-400 transition-colors duration-300 group-hover:text-primary-600 sm:h-3.5 sm:w-3.5"
                    aria-hidden
                  />
                  <span className="ltr-content transition-colors duration-300 group-hover:text-primary-700">
                    +98 21 1234 5678
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── بار پایینی ── */}
      <div className="border-t border-neutral-200">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-3 text-center sm:flex-row sm:gap-4 sm:py-5 sm:text-start">
          <p className="text-[10px] text-neutral-400 sm:text-xs">
            © {new Date().getFullYear()} Stayly — ساخته‌شده به‌عنوان پروژه
            نمونه‌کار (Portfolio)
          </p>
          <p className="text-[10px] text-neutral-400 sm:text-xs">
            ساخته‌شده با React، TypeScript و Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
