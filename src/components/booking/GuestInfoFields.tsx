// src/components/booking/GuestInfoFields.tsx
// قانون ۱۳: فیلدهای فرم «اطلاعات مسافر» که قبلاً مستقیم داخل pages/Booking بودن،
// به یک Component مستقل منتقل شدن تا اون صفحه کوچیک‌تر و تک‌مسئولیت‌تر بشه.
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { User, Mail, Phone, MessageSquare } from "lucide-react";
import type { GuestInfoFormValues } from "@/schemas/guestInfo";
import { cn } from "@/utils/cn";

const pillInput =
  "h-12 w-full rounded-xl border bg-neutral-50/50 pr-11 pl-4 text-sm text-neutral-900 placeholder:text-neutral-400 transition-all duration-200 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10 border-neutral-200 hover:border-neutral-300";

interface GuestInfoFieldsProps {
  register: UseFormRegister<GuestInfoFormValues>;
  errors: FieldErrors<GuestInfoFormValues>;
}

export function GuestInfoFields({ register, errors }: GuestInfoFieldsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="firstName" className="text-sm font-medium text-neutral-800">نام</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
              <User className="h-icon-sm w-icon-sm text-neutral-400" aria-hidden />
            </div>
            <input
              id="firstName"
              type="text"
              placeholder="نام"
              aria-invalid={!!errors.firstName}
              aria-describedby={errors.firstName ? "firstName-error" : undefined}
              className={cn(pillInput, errors.firstName && "border-error-500 focus:border-error-500 focus:ring-error-500/10")}
              {...register("firstName")}
            />
          </div>
          {errors.firstName && <p id="firstName-error" className="text-xs text-error-500">{errors.firstName.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="lastName" className="text-sm font-medium text-neutral-800">نام خانوادگی</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
              <User className="h-icon-sm w-icon-sm text-neutral-400" aria-hidden />
            </div>
            <input
              id="lastName"
              type="text"
              placeholder="نام خانوادگی"
              aria-invalid={!!errors.lastName}
              aria-describedby={errors.lastName ? "lastName-error" : undefined}
              className={cn(pillInput, errors.lastName && "border-error-500 focus:border-error-500 focus:ring-error-500/10")}
              {...register("lastName")}
            />
          </div>
          {errors.lastName && <p id="lastName-error" className="text-xs text-error-500">{errors.lastName.message}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-neutral-800">ایمیل</label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
            <Mail className="h-icon-sm w-icon-sm text-neutral-400" aria-hidden />
          </div>
          <input
            id="email"
            type="email"
            dir="ltr"
            placeholder="email@example.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={cn(pillInput, errors.email && "border-error-500 focus:border-error-500 focus:ring-error-500/10")}
            {...register("email")}
          />
        </div>
        {errors.email && <p id="email-error" className="text-xs text-error-500">{errors.email.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="phone" className="text-sm font-medium text-neutral-800">شماره تلفن</label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
            <Phone className="h-icon-sm w-icon-sm text-neutral-400" aria-hidden />
          </div>
          <input
            id="phone"
            type="text"
            dir="ltr"
            placeholder="09123456789"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            className={cn(pillInput, errors.phone && "border-error-500 focus:border-error-500 focus:ring-error-500/10")}
            {...register("phone")}
          />
        </div>
        {errors.phone && <p id="phone-error" className="text-xs text-error-500">{errors.phone.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="specialRequests" className="flex items-center gap-1.5 text-sm font-medium text-neutral-800">
          <MessageSquare className="h-3.5 w-3.5 text-neutral-400" aria-hidden />
          درخواست ویژه (اختیاری)
        </label>
        <textarea
          id="specialRequests"
          rows={3}
          placeholder="مثلاً اتاق طبقه بالا، تخت اضافه و..."
          className="w-full resize-none rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 transition-all duration-200 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10 hover:border-neutral-300"
          {...register("specialRequests")}
        />
      </div>
    </div>
  );
}
