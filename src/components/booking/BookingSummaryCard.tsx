// src/components/booking/BookingSummaryCard.tsx
import type { Hotel, RoomType } from "@/types";
import { formatToman } from "@/utils/currency";

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
    <div className="rounded-lg border border-neutral-200 p-4">
      <div className="flex gap-3">
        <img
          src={hotel.images[0]?.url}
          alt={hotel.name}
          className="h-16 w-16 rounded-md object-cover"
        />
        <div>
          <p className="font-semibold text-neutral-900">{hotel.name}</p>
          <p className="text-sm text-neutral-600">{room.name}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-1 border-t border-neutral-100 pt-4 text-sm">
        <div className="flex justify-between">
          <span className="text-neutral-600">ورود</span>
          <span className="ltr-content font-medium text-neutral-900">
            {checkIn || "—"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-600">خروج</span>
          <span className="ltr-content font-medium text-neutral-900">
            {checkOut || "—"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-600">مهمانان</span>
          <span className="font-medium text-neutral-900">
            {adults} بزرگسال، {children} کودک
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-600">تعداد شب</span>
          <span className="tabular-nums font-medium text-neutral-900">
            {nights}
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-1 border-t border-neutral-100 pt-4 text-sm">
        <div className="flex justify-between">
          <span className="text-neutral-600">جمع اجاره ({nights} شب)</span>
          <span className="tabular-price text-neutral-900">
            {formatToman(subtotal)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-600">مالیات</span>
          <span className="tabular-price text-neutral-900">
            {formatToman(taxAmount)}
          </span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-success-500">
            <span>تخفیف</span>
            <span className="tabular-price">-{formatToman(discount)}</span>
          </div>
        )}
        <div className="mt-2 flex justify-between border-t border-neutral-100 pt-2 text-base font-bold text-neutral-900">
          <span>مبلغ نهایی</span>
          <span className="tabular-price">{formatToman(total)}</span>
        </div>
      </div>
    </div>
  );
}
