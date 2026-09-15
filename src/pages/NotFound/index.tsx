// src/pages/NotFound/index.tsx
import { Link } from "react-router-dom";
import { MapPinOff, ArrowLeft } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { FadeIn } from "@/components/common/FadeIn";

export function NotFound() {
  usePageTitle("صفحه پیدا نشد");

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <FadeIn>
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50">
          <MapPinOff className="h-8 w-8 text-primary-600" aria-hidden />
        </div>
        <h1 className="mt-6 font-display text-4xl font-extrabold text-neutral-900">
          404
        </h1>
        <p className="mt-3 text-xl font-bold text-neutral-900">
          صفحه‌ای که دنبالش بودید پیدا نشد
        </p>
        <p className="mt-2 text-sm leading-relaxed text-neutral-500">
          آدرس واردشده اشتباه است یا این صفحه دیگر وجود ندارد. به صفحه اصلی
          برگردید و دوباره جستجو کنید.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-bold text-white shadow-card transition hover:bg-primary-700 hover:shadow-elevated"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          بازگشت به خانه
        </Link>
      </FadeIn>
    </div>
  );
}