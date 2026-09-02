// src/components/booking/StayDetailsCard.tsx
// قانون ۱۳: این بخش (تاریخ سفر + تعداد مهمان/اتاق) قبلاً مستقیم داخل pages/Booking بود؛
// الان یک Component مستقل و قابل‌استفاده‌ی مجدده.
import { CalendarRange, Users } from "lucide-react";
import { GuestSelector, type GuestValue } from "@/components/ui/GuestSelector";
import { cn } from "@/utils/cn";

const pillInput =
  "h-12 w-full rounded-xl border bg-neutral-50/50 pr-11 pl-4 text-sm text-neutral-900 placeholder:text-neutral-400 transition-all duration-200 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10 border-neutral-200 hover:border-neutral-300";

interface StayDetailsCardProps {
  checkIn: string;
  checkOut: string;
  onCheckInChange: (value: string) => void;
  onCheckOutChange: (value: string) => void;
  guestValue: GuestValue;
  onGuestChange: (value: GuestValue) => void;
}

export function StayDetailsCard({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  guestValue,
  onGuestChange,
}: StayDetailsCardProps) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white shadow-card">
      <div className="flex items-center gap-3 border-b border-neutral-100 bg-neutral-50/50 px-5 py-4 sm:px-6">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50">
          <CalendarRange className="h-icon-sm w-icon-sm text-primary-600" aria-hidden />
        </div>
        <div>
          <h2 className="text-sm font-bold text-neutral-900 sm:text-base">جزئیات اقامت</h2>
          <p className="text-xs text-neutral-500">تاریخ سفر و تعداد مهمانان رو مشخص کن</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-5 sm:gap-5 sm:p-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-neutral-500">تاریخ ورود</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <CalendarRange className="h-4 w-4 text-neutral-400" aria-hidden />
              </div>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => onCheckInChange(e.target.value)}
                className={cn(pillInput, "ltr-content")}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-neutral-500">تاریخ خروج</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <CalendarRange className="h-4 w-4 text-neutral-400" aria-hidden />
              </div>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => onCheckOutChange(e.target.value)}
                className={cn(pillInput, "ltr-content")}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-neutral-400" aria-hidden />
            <span className="text-xs font-medium text-neutral-500">مهمانان و اتاق</span>
          </div>
          <GuestSelector value={guestValue} onChange={onGuestChange} />
        </div>
      </div>
    </div>
  );
}
