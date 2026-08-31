// src/pages/Profile/index.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Globe,
  LogOut,
  Camera,
  Save,
  ChevronLeft,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { profileSchema, type ProfileFormValues } from "@/schemas/profile";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FadeIn } from "@/components/common/FadeIn";
import { useToastStore } from "@/store/toastStore";
import { cn } from "@/utils/cn";

export function Profile() {
  const { user, updateUser, logout } = useAuthStore();
  const showToast = useToastStore((s) => s.show);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      country: user?.country ?? "",
    },
  });

  async function onSubmit(values: ProfileFormValues) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    updateUser(values);
    showToast("پروفایل با موفقیت به‌روزرسانی شد", "success");
    setIsEditing(false);
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  if (!user) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <FadeIn>
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary-700 via-primary-600 to-primary-900 p-6 sm:p-8">
          <div className="absolute inset-0 opacity-deco-light">
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/30 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-white/20 blur-3xl" />
          </div>
          <div className="absolute inset-0 pattern-dots opacity-dot" />

          <div className="relative z-10 flex flex-col items-center gap-5 sm:flex-row sm:items-end">
            <div className="group relative shrink-0">
              <img
                src={user.avatar}
                alt={user.firstName}
                className="h-24 w-24 rounded-2xl border-4 border-white/20 object-cover shadow-elevated sm:h-28 sm:w-28"
              />
              <button
                type="button"
                className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="تغییر عکس پروفایل"
              >
                <Camera className="h-6 w-6 text-white" />
              </button>
            </div>

            <div className="flex-1 text-center sm:text-right">
              <h1 className="text-2xl font-bold text-white">
                {user.firstName} {user.lastName}
              </h1>
              <p className="mt-1 text-sm text-primary-100/70">{user.email}</p>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <Badge variant="primary" className="bg-white/15 text-white border-0">
                  {user.preferredCurrency}
                </Badge>
                <Badge variant="primary" className="bg-white/15 text-white border-0">
                  {user.preferredLanguage === "fa" ? "فارسی" : "English"}
                </Badge>
                {user.country && (
                  <Badge variant="primary" className="bg-white/15 text-white border-0">
                    {user.country}
                  </Badge>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20 active:scale-[0.98]"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">خروج از حساب</span>
            </button>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={100}>
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-neutral-900">اطلاعات شخصی</h2>
            {!isEditing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                ویرایش
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    reset();
                    setIsEditing(false);
                  }}
                >
                  انصراف
                </Button>
                <Button
                  size="sm"
                  isLoading={isSubmitting}
                  onClick={handleSubmit(onSubmit)}
                >
                  <Save className="h-4 w-4" />
                  ذخیره
                </Button>
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-5 space-y-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-card sm:p-6"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                    disabled={!isEditing}
                    aria-invalid={!!errors.firstName}
                    className={cn(
                      "h-12 w-full rounded-xl border bg-neutral-50/50 pr-11 pl-4 text-sm text-neutral-900 placeholder:text-neutral-400",
                      "transition-all duration-200",
                      isEditing
                        ? "focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10"
                        : "cursor-default border-transparent bg-neutral-100/60",
                      errors.firstName
                        ? "border-error-500 focus:border-error-500 focus:ring-error-500/10"
                        : "border-neutral-200 hover:border-neutral-300"
                    )}
                    {...register("firstName")}
                  />
                </div>
                {errors.firstName && (
                  <p className="text-xs text-error-500">{errors.firstName.message}</p>
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
                    disabled={!isEditing}
                    aria-invalid={!!errors.lastName}
                    className={cn(
                      "h-12 w-full rounded-xl border bg-neutral-50/50 pr-11 pl-4 text-sm text-neutral-900 placeholder:text-neutral-400",
                      "transition-all duration-200",
                      isEditing
                        ? "focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10"
                        : "cursor-default border-transparent bg-neutral-100/60",
                      errors.lastName
                        ? "border-error-500 focus:border-error-500 focus:ring-error-500/10"
                        : "border-neutral-200 hover:border-neutral-300"
                    )}
                    {...register("lastName")}
                  />
                </div>
                {errors.lastName && (
                  <p className="text-xs text-error-500">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="profile-email" className="text-sm font-medium text-neutral-800">
                ایمیل
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
                  <Mail className="h-[18px] w-[18px] text-neutral-400" />
                </div>
                <input
                  id="profile-email"
                  type="email"
                  dir="ltr"
                  disabled={!isEditing}
                  aria-invalid={!!errors.email}
                  className={cn(
                    "h-12 w-full rounded-xl border bg-neutral-50/50 pr-11 pl-4 text-sm text-neutral-900 placeholder:text-neutral-400",
                    "transition-all duration-200",
                    isEditing
                      ? "focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10"
                      : "cursor-default border-transparent bg-neutral-100/60",
                    errors.email
                      ? "border-error-500 focus:border-error-500 focus:ring-error-500/10"
                      : "border-neutral-200 hover:border-neutral-300"
                  )}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-error-500">{errors.email.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="profile-phone" className="text-sm font-medium text-neutral-800">
                شماره تلفن
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
                  <Phone className="h-[18px] w-[18px] text-neutral-400" />
                </div>
                <input
                  id="profile-phone"
                  type="tel"
                  dir="ltr"
                  disabled={!isEditing}
                  aria-invalid={!!errors.phone}
                  className={cn(
                    "h-12 w-full rounded-xl border bg-neutral-50/50 pr-11 pl-4 text-sm text-neutral-900 placeholder:text-neutral-400",
                    "transition-all duration-200",
                    isEditing
                      ? "focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10"
                      : "cursor-default border-transparent bg-neutral-100/60",
                    errors.phone
                      ? "border-error-500 focus:border-error-500 focus:ring-error-500/10"
                      : "border-neutral-200 hover:border-neutral-300"
                  )}
                  {...register("phone")}
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-error-500">{errors.phone.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="country" className="text-sm font-medium text-neutral-800">
                کشور
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
                  <Globe className="h-[18px] w-[18px] text-neutral-400" />
                </div>
                <input
                  id="country"
                  type="text"
                  disabled={!isEditing}
                  placeholder="ایران"
                  aria-invalid={!!errors.country}
                  className={cn(
                    "h-12 w-full rounded-xl border bg-neutral-50/50 pr-11 pl-4 text-sm text-neutral-900 placeholder:text-neutral-400",
                    "transition-all duration-200",
                    isEditing
                      ? "focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10"
                      : "cursor-default border-transparent bg-neutral-100/60",
                    errors.country
                      ? "border-error-500 focus:border-error-500 focus:ring-error-500/10"
                      : "border-neutral-200 hover:border-neutral-300"
                  )}
                  {...register("country")}
                />
              </div>
              {errors.country && (
                <p className="text-xs text-error-500">{errors.country.message}</p>
              )}
            </div>

            {isEditing && (
              <div className="pt-2 sm:hidden">
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="w-full h-12 rounded-xl"
                >
                  <Save className="h-4 w-4" />
                  ذخیره تغییرات
                </Button>
              </div>
            )}
          </form>
        </div>
      </FadeIn>

      <FadeIn delay={200}>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <a
            href="/my-bookings"
            className="group flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-5 shadow-card transition-all hover:shadow-elevated hover:border-primary-200"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50">
                <svg className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900">رزروهای من</p>
                <p className="text-xs text-neutral-400">مشاهده رزروها و سفرها</p>
              </div>
            </div>
            <ChevronLeft className="h-5 w-5 text-neutral-400 transition-transform group-hover:-translate-x-1 group-hover:text-primary-500" />
          </a>

          <a
            href="/favorites"
            className="group flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-5 shadow-card transition-all hover:shadow-elevated hover:border-primary-200"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-error-100/60">
                <svg className="h-5 w-5 text-error-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900">علاقه‌مندی‌ها</p>
                <p className="text-xs text-neutral-400">اقامتگاه‌های ذخیره شده</p>
              </div>
            </div>
            <ChevronLeft className="h-5 w-5 text-neutral-400 transition-transform group-hover:-translate-x-1 group-hover:text-primary-500" />
          </a>
        </div>
      </FadeIn>
    </div>
  );
}
