// src/components/booking/BookingSummaryCard.tsx
import type { Hotel, RoomType } from "@/types";
import { formatToman } from "@/utils/currency";
import {
  Users,
  Moon,
  CreditCard,
} from "lucide-react";

interface Props {
  hotel: Hotel;
  room: RoomType;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  subtotal: number;
  taxAmount: number;
  discount: number;
  total: number;
}

export function BookingSummaryCard({
  hotel,
  room,
  checkIn,
  checkOut,
  nights,
  adults,
  children,
  subtotal,
  taxAmount,
  discount,
  total,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-card">
      {/* هدر با تصویر */}
      <div className="relative">
        <img
          src={hotel.images[0]?.url}
          alt={hotel.name}
          className="h-36 w-full object-cover sm:h-40"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 right-3 left-3">
          <p className="font-display text-base font-bold text-white">
            {hotel.name}
          </p>
          <p className="text-sm text-white/80">{room.name}</p>
        </div>
      </div>

      {/* جزئیات اقامت */}
      <div className="flex flex-col gap-3 p-4">
        {/* تاریخ ورود/خروج */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-neutral-50 p-3 text-center">
            <p className="text-xs text-neutral-500">ورود</p>
            <p className="mt-0.5 ltr-content text-sm font-semibold text-neutral-900">
              {checkIn || "—"}
            </p>
          </div>
          <div className="rounded-xl bg-neutral-50 p-3 text-center">
            <p className="text-xs text-neutral-500">خروج</p>
            <p className="mt-0.5 ltr-content text-sm font-semibold text-neutral-900">
              {checkOut || "—"}
            </p>
          </div>
        </div>

        {/* اطلاعات سفر */}
        <div className="flex flex-col gap-2.5 border-t border-neutral-100 pt-3">
          <div className="flex items-center gap-2.5 text-sm">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-50">
              <Users className="h-3.5 w-3.5 text-primary-600" aria-hidden />
            </div>
            <span className="text-neutral-600">مهمانان</span>
            <span className="me-auto font-medium text-neutral-900">
              {adults} بزرگسال · {children} کودک
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-sm">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-50">
              <Moon className="h-3.5 w-3.5 text-primary-600" aria-hidden />
            </div>
            <span className="text-neutral-600">تعداد شب</span>
            <span className="me-auto tabular-nums font-medium text-neutral-900">
              {nights} شب
            </span>
          </div>
        </div>

        {/* خلاصه هزینه */}
        <div className="flex flex-col gap-2 border-t border-neutral-100 pt-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-500">جمع اجاره ({nights} شب)</span>
            <span className="tabular-price font-medium text-neutral-800">
              {formatToman(subtotal)}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-500">مالیات</span>
            <span className="tabular-price font-medium text-neutral-800">
              {formatToman(taxAmount)}
            </span>
          </div>

          {discount > 0 && (
            <div className="flex items-center justify-between text-sm text-success-500">
              <span>تخفیف</span>
              <span className="tabular-price">-{formatToman(discount)}</span>
            </div>
          )}

          {/* مبلغ نهایی */}
          <div className="mt-1 flex items-center justify-between rounded-xl bg-primary-50 p-3">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary-600" aria-hidden />
              <span className="text-sm font-bold text-primary-700">
                مبلغ نهایی
              </span>
            </div>
            <span className="tabular-price text-lg font-bold text-primary-700">
              {formatToman(total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
