// src/pages/Booking/index.tsx
// قانون ۱۳: این صفحه قبلاً هم UI جزئیات اقامت، هم فرم اطلاعات مسافر، هم پیام‌های اعتبارسنجی
// رو با هم داشت. الان اون بخش‌ها به StayDetailsCard و GuestInfoFields منتقل شدن و این صفحه
// فقط queryها، state رزرو (draft) و ترکیب Componentها رو مدیریت می‌کنه.
import { useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClipboardList, User } from "lucide-react";
import { getHotelById } from "@/services/hotels";
import { getRoomById } from "@/services/rooms";
import { useBookingStore } from "@/store/bookingStore";
import { guestInfoSchema, type GuestInfoFormValues } from "@/schemas/guestInfo";
import {
  calculateNights,
  calculateSubtotal,
  calculateTaxes,
  calculateTotal,
} from "@/utils/pricing";
import {
  isValidDateRange,
  exceedsGuestCapacity,
  exceedsRoomAvailability,
  getGuestCapacity,
} from "@/utils/bookingRules";
import { Button } from "@/components/ui/Button";
import { StayDetailsCard } from "@/components/booking/StayDetailsCard";
import { GuestInfoFields } from "@/components/booking/GuestInfoFields";
import { BookingSummaryCard } from "@/components/booking/BookingSummaryCard";
import { FadeIn } from "@/components/common/FadeIn";
import { Skeleton } from "@/components/ui/Skeleton";

function todayPlus(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function Booking() {
  const { hotelId } = useParams<{ hotelId: string }>();
  const [searchParams] = useSearchParams();
  const roomTypeId = searchParams.get("roomTypeId") ?? "";
  const navigate = useNavigate();
  const { draft, setDraft } = useBookingStore();

  const hotelQuery = useQuery({
    queryKey: ["hotel", hotelId],
    queryFn: () => getHotelById(hotelId!),
  });
  const roomQuery = useQuery({
    queryKey: ["room", roomTypeId],
    queryFn: () => getRoomById(roomTypeId),
  });

  useEffect(() => {
    if (
      hotelId &&
      roomTypeId &&
      (draft.hotelId !== hotelId || draft.roomTypeId !== roomTypeId)
    ) {
      setDraft({
        hotelId,
        roomTypeId,
        checkIn: draft.checkIn || todayPlus(7),
        checkOut: draft.checkOut || todayPlus(10),
      });
    }
  }, [hotelId, roomTypeId]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GuestInfoFormValues>({
    resolver: zodResolver(guestInfoSchema),
    defaultValues: draft.guestInfo ?? undefined,
  });

  /* ─── حالت لودینگ ─── */
  if (hotelQuery.isLoading || roomQuery.isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
        <div className="flex items-center gap-3">
          <Skeleton className="h-11 w-11 shrink-0 rounded-2xl sm:h-12 sm:w-12" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-40 rounded-lg" />
            <Skeleton className="h-3.5 w-56 rounded-lg" />
          </div>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="flex flex-col gap-6 lg:col-span-2">
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
          <Skeleton className="h-80 w-full rounded-2xl lg:col-span-1" />
        </div>
      </div>
    );
  }

  /* ─── حالت خطا ─── */
  if (hotelQuery.isError || roomQuery.isError) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-5 px-4 py-32 text-center">
        <p className="text-xl font-bold text-neutral-900">مشکلی در دریافت اطلاعات پیش آمد</p>
        <Button size="lg" onClick={() => window.location.reload()}>تلاش دوباره</Button>
      </div>
    );
  }

  const hotel = hotelQuery.data;
  const room = roomQuery.data;

  /* ─── حالت خالی ─── */
  if (!hotel || !room) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-5 px-4 py-32 text-center">
        <p className="text-xl font-bold text-neutral-900">
          اتاق یا هتل مورد نظر یافت نشد
        </p>
        <p className="text-neutral-600">
          لطفاً دوباره از صفحه جستجو اقدام کنید.
        </p>
        <Button size="lg" onClick={() => navigate("/hotels")}>
          بازگشت به جستجو
        </Button>
      </div>
    );
  }

  const nights = calculateNights(draft.checkIn, draft.checkOut);
  const subtotal = calculateSubtotal(room.pricePerNight, nights, draft.rooms);
  const taxAmount = calculateTaxes(subtotal);
  const total = calculateTotal(subtotal, taxAmount, 0);

  const capacity = getGuestCapacity(room.maxGuests, draft.rooms);
  const exceedsCapacity = exceedsGuestCapacity(draft.adults, draft.children, room.maxGuests, draft.rooms);
  const exceedsAvailability = exceedsRoomAvailability(draft.rooms, room.availableRooms);
  const validDates = isValidDateRange(draft.checkIn, draft.checkOut);
  const canSubmit = validDates && !exceedsCapacity && !exceedsAvailability;

  function onSubmit(values: GuestInfoFormValues) {
    setDraft({
      guestInfo: { ...values, specialRequests: values.specialRequests ?? "" },
    });
    navigate(`/checkout?hotelId=${encodeURIComponent(hotelId ?? "")}&roomTypeId=${encodeURIComponent(roomTypeId)}`);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      {/* ── هدر صفحه ── */}
      <FadeIn>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-50 sm:h-12 sm:w-12">
            <ClipboardList className="h-5 w-5 text-primary-600 sm:h-6 sm:w-6" aria-hidden />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">
              تکمیل اطلاعات رزرو
            </h1>
            <p className="text-sm text-neutral-500">
              اطلاعات اقامت و مسافر را تکمیل کنید تا به مرحله پرداخت برویم
            </p>
          </div>
        </div>
      </FadeIn>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        <FadeIn delay={100} className="flex flex-col gap-6 lg:col-span-2">
          <StayDetailsCard
            checkIn={draft.checkIn}
            checkOut={draft.checkOut}
            onCheckInChange={(checkIn) => setDraft({ checkIn })}
            onCheckOutChange={(checkOut) => setDraft({ checkOut })}
            guestValue={{ adults: draft.adults, children: draft.children, rooms: draft.rooms }}
            onGuestChange={(v) => setDraft(v)}
          />

          {/* ── اطلاعات مسافر ── */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-card"
          >
            <div className="flex items-center gap-3 border-b border-neutral-100 bg-neutral-50/50 px-5 py-4 sm:px-6">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50">
                <User className="h-icon-sm w-icon-sm text-primary-600" aria-hidden />
              </div>
              <div>
                <h2 className="text-sm font-bold text-neutral-900 sm:text-base">
                  اطلاعات مسافر
                </h2>
                <p className="text-xs text-neutral-500">
                  این اطلاعات روی فاکتور رزرو شما درج می‌شود
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 p-5 sm:p-6">
              <GuestInfoFields register={register} errors={errors} />

              <Button
                type="submit"
                size="lg"
                disabled={!canSubmit}
                className="mt-2 w-full rounded-xl"
              >
                ادامه به پرداخت
              </Button>
              {!validDates && (
                <p className="text-center text-sm text-error-500">
                  تاریخ خروج باید بعد از تاریخ ورود باشد.
                </p>
              )}
              {exceedsAvailability && (
                <p className="text-center text-sm text-error-500">
                  فقط {room.availableRooms} اتاق از این نوع موجود است — تعداد اتاق
                  درخواستی را کاهش دهید.
                </p>
              )}
              {exceedsCapacity && (
                <p className="text-center text-sm text-error-500">
                  ظرفیت این اتاق برای {capacity} مهمان است — تعداد مهمانان یا اتاق
                  را تنظیم کنید.
                </p>
              )}
            </div>
          </form>
        </FadeIn>

        {/* ── خلاصه رزرو ── */}
        <FadeIn delay={200} className="lg:col-span-1">
          <div className="sticky top-24">
            <BookingSummaryCard
              hotel={hotel}
              room={room}
              checkIn={draft.checkIn}
              checkOut={draft.checkOut}
              nights={nights}
              adults={draft.adults}
              children={draft.children}
              rooms={draft.rooms}
              subtotal={subtotal}
              taxAmount={taxAmount}
              discount={0}
              total={total}
            />
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
