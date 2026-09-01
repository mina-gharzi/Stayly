// src/pages/Booking/index.tsx
import { useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarRange,
  ClipboardList,
  User,
  Mail,
  Phone,
  MessageSquare,
  Users,
} from "lucide-react";
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
import { Button } from "@/components/ui/Button";
import { GuestSelector } from "@/components/ui/GuestSelector";
import { BookingSummaryCard } from "@/components/booking/BookingSummaryCard";
import { FadeIn } from "@/components/common/FadeIn";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/utils/cn";

function todayPlus(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/** استایل مشترک ورودی‌های شیشه‌ای */
const pillInput =
  "h-12 w-full rounded-xl border bg-neutral-50/50 pr-11 pl-4 text-sm text-neutral-900 placeholder:text-neutral-400 transition-all duration-200 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10 border-neutral-200 hover:border-neutral-300";

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

  const hotel = hotelQuery.data;
  const room = roomQuery.data;

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
  const subtotal = calculateSubtotal(room.pricePerNight, nights);
  const taxAmount = calculateTaxes(subtotal);
  const total = calculateTotal(subtotal, taxAmount, 0);
  const guestsCount = draft.adults + draft.children;
  const capacity = room.maxGuests * draft.rooms;
  const exceedsCapacity = guestsCount > capacity;
  const exceedsAvailability = draft.rooms > room.availableRooms;
  const canSubmit = nights > 0 && !exceedsCapacity && !exceedsAvailability;

  function onSubmit(values: GuestInfoFormValues) {
    setDraft({
      guestInfo: { ...values, specialRequests: values.specialRequests ?? "" },
    });
    navigate("/checkout");
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      {/* ── هدر صفحه ── */}
      <FadeIn>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-50 sm:h-12 sm:w-12">
            <ClipboardList
              className="h-5 w-5 text-primary-600 sm:h-6 sm:w-6"
              aria-hidden
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl">
              تکمیل اطلاعات رزرو
            </h1>
            <p className="text-sm text-neutral-500">
              اطلاعات اقامت و مسافر رو تکمیل کن تا بریم مرحله پرداخت
            </p>
          </div>
        </div>
      </FadeIn>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        <FadeIn delay={100} className="flex flex-col gap-6 lg:col-span-2">
          {/* ── جزئیات اقامت — بازطراحی شده ── */}
          <div className="rounded-2xl border border-neutral-200 bg-white shadow-card">
            <div className="flex items-center gap-3 border-b border-neutral-100 bg-neutral-50/50 px-5 py-4 sm:px-6">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50">
                <CalendarRange
                  className="h-icon-sm w-icon-sm text-primary-600"
                  aria-hidden
                />
              </div>
              <div>
                <h2 className="text-sm font-bold text-neutral-900 sm:text-base">
                  جزئیات اقامت
                </h2>
                <p className="text-xs text-neutral-500">
                  تاریخ سفر و تعداد مهمانان رو مشخص کن
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 p-5 sm:gap-5 sm:p-6">
              {/* ردیف تاریخ‌ها — ۲ ستونه */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-neutral-500">
                    تاریخ ورود
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <CalendarRange
                        className="h-4 w-4 text-neutral-400"
                        aria-hidden
                      />
                    </div>
                    <input
                      type="date"
                      value={draft.checkIn}
                      onChange={(e) => setDraft({ checkIn: e.target.value })}
                      className={cn(pillInput, "ltr-content")}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-neutral-500">
                    تاریخ خروج
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <CalendarRange
                        className="h-4 w-4 text-neutral-400"
                        aria-hidden
                      />
                    </div>
                    <input
                      type="date"
                      value={draft.checkOut}
                      onChange={(e) => setDraft({ checkOut: e.target.value })}
                      className={cn(pillInput, "ltr-content")}
                    />
                  </div>
                </div>
              </div>

              {/* ردیف مهمانان — تمام عرض */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-neutral-400" aria-hidden />
                  <span className="text-xs font-medium text-neutral-500">
                    مهمانان و اتاق
                  </span>
                </div>
                <GuestSelector
                  value={{
                    adults: draft.adults,
                    children: draft.children,
                    rooms: draft.rooms,
                  }}
                  onChange={(v) => setDraft(v)}
                />
              </div>
            </div>
          </div>

          {/* ── اطلاعات مسافر ── */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-card"
          >
            <div className="flex items-center gap-3 border-b border-neutral-100 bg-neutral-50/50 px-5 py-4 sm:px-6">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50">
                <User
                  className="h-icon-sm w-icon-sm text-primary-600"
                  aria-hidden
                />
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="firstName"
                    className="text-sm font-medium text-neutral-800"
                  >
                    نام
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
                      <User
                        className="h-icon-sm w-icon-sm text-neutral-400"
                        aria-hidden
                      />
                    </div>
                    <input
                      id="firstName"
                      type="text"
                      placeholder="نام"
                      aria-invalid={!!errors.firstName}
                      className={cn(
                        pillInput,
                        errors.firstName &&
                          "border-error-500 focus:border-error-500 focus:ring-error-500/10",
                      )}
                      {...register("firstName")}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-xs text-error-500">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="lastName"
                    className="text-sm font-medium text-neutral-800"
                  >
                    نام خانوادگی
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
                      <User
                        className="h-icon-sm w-icon-sm text-neutral-400"
                        aria-hidden
                      />
                    </div>
                    <input
                      id="lastName"
                      type="text"
                      placeholder="نام خانوادگی"
                      aria-invalid={!!errors.lastName}
                      className={cn(
                        pillInput,
                        errors.lastName &&
                          "border-error-500 focus:border-error-500 focus:ring-error-500/10",
                      )}
                      {...register("lastName")}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="text-xs text-error-500">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-neutral-800"
                >
                  ایمیل
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
                    <Mail
                      className="h-icon-sm w-icon-sm text-neutral-400"
                      aria-hidden
                    />
                  </div>
                  <input
                    id="email"
                    type="email"
                    dir="ltr"
                    placeholder="email@example.com"
                    aria-invalid={!!errors.email}
                    className={cn(
                      pillInput,
                      errors.email &&
                        "border-error-500 focus:border-error-500 focus:ring-error-500/10",
                    )}
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-error-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="phone"
                  className="text-sm font-medium text-neutral-800"
                >
                  شماره تلفن
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
                    <Phone
                      className="h-icon-sm w-icon-sm text-neutral-400"
                      aria-hidden
                    />
                  </div>
                  <input
                    id="phone"
                    type="text"
                    dir="ltr"
                    placeholder="09123456789"
                    aria-invalid={!!errors.phone}
                    className={cn(
                      pillInput,
                      errors.phone &&
                        "border-error-500 focus:border-error-500 focus:ring-error-500/10",
                    )}
                    {...register("phone")}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-error-500">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="specialRequests"
                  className="flex items-center gap-1.5 text-sm font-medium text-neutral-800"
                >
                  <MessageSquare
                    className="h-3.5 w-3.5 text-neutral-400"
                    aria-hidden
                  />
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

              <Button
                type="submit"
                size="lg"
                disabled={!canSubmit}
                className="mt-2 w-full rounded-xl"
              >
                ادامه به پرداخت
              </Button>
              {nights <= 0 && (
                <p className="text-center text-sm text-error-500">
                  تاریخ خروج باید بعد از تاریخ ورود باشد.
                </p>
              )}
              {exceedsAvailability && (
                <p className="text-center text-sm text-error-500">
                  فقط {room.availableRooms} اتاق از این نوع موجوده — تعداد اتاق
                  درخواستی رو کم کنید.
                </p>
              )}
              {exceedsCapacity && (
                <p className="text-center text-sm text-error-500">
                  ظرفیت این اتاق برای {capacity} مهمانه — تعداد مهمانان یا اتاق
                  رو تنظیم کنید.
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
