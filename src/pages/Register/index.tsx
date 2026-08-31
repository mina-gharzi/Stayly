// src/pages/Register/index.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  User,
  Phone,
} from "lucide-react";
import { mockRegister } from "@/services/auth";
import { useAuthStore } from "@/store/authStore";
import { registerSchema, type RegisterFormValues } from "@/schemas/auth";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

export function Register() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(values: RegisterFormValues) {
    setFormError(null);
    try {
      const { user, token } = await mockRegister(values);
      setSession(user, token);
      navigate("/");
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "ثبت‌نام ناموفق بود"
      );
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* ── سمت راست: بخش بصری ── */}
      <div className="relative hidden w-1/2 lg:flex lg:items-center lg:justify-center overflow-hidden bg-linear-to-br from-primary-700 via-primary-600 to-primary-900">
        {/* الگوهای دکوراتیو */}
        <div className="absolute inset-0 opacity-[0.07]">
          <div className="absolute top-20 right-20 h-72 w-72 rounded-full bg-white/30 blur-3xl" />
          <div className="absolute bottom-32 left-16 h-96 w-96 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/3 h-48 w-48 rounded-full bg-white/25 blur-2xl" />
        </div>

        {/* شبکه نقطه‌ای */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* شکل‌های شناور */}
        <div className="absolute top-16 left-12 h-16 w-16 rotate-45 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm animate-[float_6s_ease-in-out_infinite]" />
        <div className="absolute bottom-24 right-16 h-10 w-10 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm animate-[float_8s_ease-in-out_infinite_reverse]" />
        <div className="absolute top-1/3 right-8 h-6 w-6 rotate-12 rounded-sm border border-white/10 bg-white/5 backdrop-blur-sm animate-[float_5s_ease-in-out_infinite_1s]" />

        {/* محتوا */}
        <div className="relative z-10 mx-auto max-w-md px-8 text-center animate-[fadeSlideUp_0.8s_ease-out]">
          <h2 className="text-3xl font-bold text-white leading-snug">
            به جمع مسافرهای
            <br />
            Stayly خوش اومدید
          </h2>
          <p className="mt-4 text-base text-primary-100/70 leading-relaxed">
            با ثبت‌نام، تجربه سفری متفاوت و شخصی‌سازی شده منتظر شماست
          </p>

          {/* مزایا */}
          <div className="mt-10 space-y-3 text-right">
            <div className="flex items-center gap-3 rounded-xl bg-white/10 px-5 py-3.5 backdrop-blur-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
                <svg className="h-4.5 w-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm text-white/85">رزرو سریع و آسان اقامتگاه‌ها</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white/10 px-5 py-3.5 backdrop-blur-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
                <svg className="h-4.5 w-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm text-white/85">ذخیره اقامتگاه‌های مورد علاقه</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white/10 px-5 py-3.5 backdrop-blur-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
                <svg className="h-4.5 w-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm text-white/85">پیگیری راحت رزروها و سفرها</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── سمت چپ: فرم ثبت‌نام ── */}
      <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md animate-[fadeSlideUp_0.6s_ease-out]">
          {/* لوگو (موبایل) */}
          <div className="mb-8 text-center lg:hidden">
            <Link to="/" className="inline-flex items-center">
              <span className="font-display text-3xl font-extrabold tracking-tight text-primary-700">
                STAYLY
              </span>
            </Link>
          </div>

          {/* هدر */}
          <div className="mb-8 text-center">
            <h1 className="hidden text-2xl font-bold text-neutral-900 lg:block">
              ساخت حساب کاربری
            </h1>
            <p className="mt-2 text-sm text-neutral-400">
              اطلاعاتت رو وارد کن تا شروع کنیم
            </p>
          </div>

          {/* فرم */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            {formError && (
              <div className="flex items-center gap-3 rounded-xl border border-error-500/20 bg-error-100/50 p-3.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-error-500/10">
                  <Lock className="h-4 w-4 text-error-500" />
                </div>
                <p className="text-sm text-error-500">{formError}</p>
              </div>
            )}

            {/* نام و نام خانوادگی */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="firstName" className="text-sm font-medium text-neutral-800">
                  نام
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
                    <User className="h-[18px] w-[18px] text-neutral-400" />
                  </div>
                  <input
                    id="firstName"
                    type="text"
                    placeholder="علی"
                    aria-invalid={!!errors.firstName}
                    aria-describedby={errors.firstName ? "firstName-error" : undefined}
                    className={cn(
                      "h-12 w-full rounded-xl border bg-neutral-50/50 pr-11 pl-4 text-sm text-neutral-900 placeholder:text-neutral-400",
                      "transition-all duration-200",
                      "focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10",
                      errors.firstName
                        ? "border-error-500 focus:border-error-500 focus:ring-error-500/10"
                        : "border-neutral-200 hover:border-neutral-300"
                    )}
                    {...register("firstName")}
                  />
                </div>
                {errors.firstName && (
                  <p id="firstName-error" className="text-xs text-error-500">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="lastName" className="text-sm font-medium text-neutral-800">
                  نام خانوادگی
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
                    <User className="h-[18px] w-[18px] text-neutral-400" />
                  </div>
                  <input
                    id="lastName"
                    type="text"
                    placeholder="احمدی"
                    aria-invalid={!!errors.lastName}
                    aria-describedby={errors.lastName ? "lastName-error" : undefined}
                    className={cn(
                      "h-12 w-full rounded-xl border bg-neutral-50/50 pr-11 pl-4 text-sm text-neutral-900 placeholder:text-neutral-400",
                      "transition-all duration-200",
                      "focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10",
                      errors.lastName
                        ? "border-error-500 focus:border-error-500 focus:ring-error-500/10"
                        : "border-neutral-200 hover:border-neutral-300"
                    )}
                    {...register("lastName")}
                  />
                </div>
                {errors.lastName && (
                  <p id="lastName-error" className="text-xs text-error-500">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* فیلد ایمیل */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reg-email" className="text-sm font-medium text-neutral-800">
                ایمیل
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
                  <Mail className="h-[18px] w-[18px] text-neutral-400" />
                </div>
                <input
                  id="reg-email"
                  type="email"
                  dir="ltr"
                  placeholder="email@example.com"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "reg-email-error" : undefined}
                  className={cn(
                    "h-12 w-full rounded-xl border bg-neutral-50/50 pr-11 pl-4 text-sm text-neutral-900 placeholder:text-neutral-400",
                    "transition-all duration-200",
                    "focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10",
                    errors.email
                      ? "border-error-500 focus:border-error-500 focus:ring-error-500/10"
                      : "border-neutral-200 hover:border-neutral-300"
                  )}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p id="reg-email-error" className="text-xs text-error-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* فیلد تلفن */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="phone" className="text-sm font-medium text-neutral-800">
                شماره تلفن
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
                  <Phone className="h-[18px] w-[18px] text-neutral-400" />
                </div>
                <input
                  id="phone"
                  type="tel"
                  dir="ltr"
                  placeholder="+98 912 123 4567"
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                  className={cn(
                    "h-12 w-full rounded-xl border bg-neutral-50/50 pr-11 pl-4 text-sm text-neutral-900 placeholder:text-neutral-400",
                    "transition-all duration-200",
                    "focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10",
                    errors.phone
                      ? "border-error-500 focus:border-error-500 focus:ring-error-500/10"
                      : "border-neutral-200 hover:border-neutral-300"
                  )}
                  {...register("phone")}
                />
              </div>
              {errors.phone && (
                <p id="phone-error" className="text-xs text-error-500">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* فیلد رمز عبور */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reg-password" className="text-sm font-medium text-neutral-800">
                رمز عبور
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
                  <Lock className="h-[18px] w-[18px] text-neutral-400" />
                </div>
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  dir="ltr"
                  placeholder="••••••••"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "reg-password-error" : undefined}
                  className={cn(
                    "h-12 w-full rounded-xl border bg-neutral-50/50 pr-11 pl-12 text-sm text-neutral-900 placeholder:text-neutral-400",
                    "transition-all duration-200",
                    "focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10",
                    errors.password
                      ? "border-error-500 focus:border-error-500 focus:ring-error-500/10"
                      : "border-neutral-200 hover:border-neutral-300"
                  )}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400 hover:text-neutral-600 transition-colors"
                  aria-label={showPassword ? "مخفی کردن رمز" : "نمایش رمز"}
                >
                  {showPassword ? (
                    <EyeOff className="h-[18px] w-[18px]" />
                  ) : (
                    <Eye className="h-[18px] w-[18px]" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p id="reg-password-error" className="text-xs text-error-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* فیلد تکرار رمز عبور */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-neutral-800">
                تکرار رمز عبور
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
                  <Lock className="h-[18px] w-[18px] text-neutral-400" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  dir="ltr"
                  placeholder="••••••••"
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                  className={cn(
                    "h-12 w-full rounded-xl border bg-neutral-50/50 pr-11 pl-12 text-sm text-neutral-900 placeholder:text-neutral-400",
                    "transition-all duration-200",
                    "focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10",
                    errors.confirmPassword
                      ? "border-error-500 focus:border-error-500 focus:ring-error-500/10"
                      : "border-neutral-200 hover:border-neutral-300"
                  )}
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400 hover:text-neutral-600 transition-colors"
                  aria-label={showConfirmPassword ? "مخفی کردن رمز" : "نمایش رمز"}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-[18px] w-[18px]" />
                  ) : (
                    <Eye className="h-[18px] w-[18px]" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p id="confirmPassword-error" className="text-xs text-error-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* دکمه ثبت‌نام */}
            <Button
              type="submit"
              isLoading={isSubmitting}
              className="mt-2 h-12 rounded-xl text-sm font-semibold"
            >
              <span>ثبت‌نام</span>
              {!isSubmitting && <ArrowLeft className="h-4 w-4" />}
            </Button>
          </form>

          {/* جداکننده */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-neutral-200" />
            <span className="text-xs text-neutral-400">یا</span>
            <div className="h-px flex-1 bg-neutral-200" />
          </div>

          {/* ثبت‌نام با شبکه اجتماعی */}
          <div className="flex gap-3">
            <button
              type="button"
              className="flex h-12 flex-1 items-center justify-center gap-2.5 rounded-xl border border-neutral-200 bg-white text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-50 hover:border-neutral-300 active:scale-[0.98]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              گوگل
            </button>
            <button
              type="button"
              className="flex h-12 flex-1 items-center justify-center gap-2.5 rounded-xl border border-neutral-200 bg-white text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-50 hover:border-neutral-300 active:scale-[0.98]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              اپل
            </button>
          </div>

          {/* ورود */}
          <p className="mt-8 text-center text-sm text-neutral-400">
            قبلاً ثبت‌نام کرده‌اید؟{" "}
            <Link
              to="/login"
              className="font-semibold text-primary-600 transition-colors hover:text-primary-700"
            >
              وارد شوید
            </Link>
          </p>
        </div>
      </div>

      {/* کلید‌های انیمیشن */}
      <style>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(var(--tw-rotate, 0deg)); }
          50% { transform: translateY(-12px) rotate(var(--tw-rotate, 0deg)); }
        }
      `}</style>
    </div>
  );
}
