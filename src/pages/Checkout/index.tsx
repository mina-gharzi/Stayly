// src/pages/Checkout/index.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle } from "lucide-react";
import { getHotelById } from "@/services/hotels";
import { getRoomById } from "@/services/rooms";
import { mockProcessPayment } from "@/services/payment";
import { savePayment } from "@/services/payments";
import { createBooking } from "@/services/bookings";
import { useBookingStore } from "@/store/bookingStore";
import { useAuthStore } from "@/store/authStore";
import {
  calculateNights,
  calculateSubtotal,
  calculateTaxes,
  calculateTotal,
} from "@/utils/pricing";
import { formatToman } from "@/utils/currency";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { BookingSummaryCard } from "@/components/booking/BookingSummaryCard";
import { Skeleton } from "@/components/ui/Skeleton";

const paymentSchema = z.object({
  cardNumber: z.string().min(12, "شماره کارت معتبر نیست").max(19),
  cardHolder: z.string().min(1, "نام دارنده کارت الزامی است"),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "فرمت باید MM/YY باشد"),
  cvv: z.string().regex(/^\d{3,4}$/, "CVV معتبر نیست"),
});
type PaymentFormValues = z.infer<typeof paymentSchema>;

export function Checkout() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { draft, reset } = useBookingStore();
  const [paymentError, setPaymentError] = useState(false);

  const hotelQuery = useQuery({
    queryKey: ["hotel", draft.hotelId],
    queryFn: () => getHotelById(draft.hotelId!),
    enabled: !!draft.hotelId,
  });
  const roomQuery = useQuery({
    queryKey: ["room", draft.roomTypeId],
    queryFn: () => getRoomById(draft.roomTypeId!),
    enabled: !!draft.roomTypeId,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
  });

  if (!draft.hotelId || !draft.roomTypeId || !draft.guestInfo) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="font-medium text-neutral-900">اطلاعات رزرو ناقص است</p>
        <p className="mt-1 text-sm text-neutral-600">
          لطفاً از ابتدا یک اتاق انتخاب کنید.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate("/hotels")}
        >
          جستجوی هتل
        </Button>
      </div>
    );
  }

  if (hotelQuery.isLoading || roomQuery.isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  const hotel = hotelQuery.data;
  const room = roomQuery.data;
  if (!hotel || !room) return null;

  const nights = calculateNights(draft.checkIn, draft.checkOut);
  const subtotal = calculateSubtotal(room.pricePerNight, nights);
  const taxAmount = calculateTaxes(subtotal);
  const total = calculateTotal(subtotal, taxAmount, 0);

  async function onSubmit(values: PaymentFormValues) {
    setPaymentError(false);
    const result = await mockProcessPayment({ ...values, amount: total });
    const payment = await savePayment({
      bookingId: "",
      status: result.status,
      cardLast4: result.cardLast4,
      amount: total,
      processedAt: new Date().toISOString(),
    });

    if (result.status === "failed") {
      setPaymentError(true);
      return;
    }

    const booking = await createBooking({
      userId: user?.id ?? "guest",
      hotelId: draft.hotelId!,
      roomTypeId: draft.roomTypeId!,
      checkIn: draft.checkIn,
      checkOut: draft.checkOut,
      adults: draft.adults,
      children: draft.children,
      rooms: draft.rooms,
      guestInfo: draft.guestInfo!,
      priceBreakdown: {
        pricePerNight: room!.pricePerNight,
        nights,
        subtotal,
        taxRate: 0.1,
        taxAmount,
        discount: 0,
        total,
      },
      status: "confirmed",
      paymentId: payment.id,
    });

    reset();
    navigate(`/confirmation/${booking.id}`);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold text-neutral-900">پرداخت</h1>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 rounded-lg border border-neutral-200 p-4 lg:col-span-2"
        >
          <h2 className="font-semibold text-neutral-900">اطلاعات کارت</h2>

          {paymentError && (
            <div className="flex items-center gap-2 rounded-md bg-error-100 p-3 text-sm text-error-500">
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
              پرداخت ناموفق بود. لطفاً اطلاعات کارت را بررسی و دوباره تلاش کنید.
            </div>
          )}

          <Input
            label="شماره کارت"
            placeholder="4242 4242 4242 4242"
            className="ltr-content"
            {...register("cardNumber")}
            error={errors.cardNumber?.message}
          />
          <Input
            label="نام دارنده کارت"
            {...register("cardHolder")}
            error={errors.cardHolder?.message}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="تاریخ انقضا"
              placeholder="MM/YY"
              className="ltr-content"
              {...register("expiry")}
              error={errors.expiry?.message}
            />
            <Input
              label="CVV"
              className="ltr-content"
              {...register("cvv")}
              error={errors.cvv?.message}
            />
          </div>

          <p className="text-xs text-neutral-500">
            برای تست: کارت شروع‌شده با 4242 = موفق، شروع‌شده با 0000 = ناموفق.
          </p>

          <Button type="submit" isLoading={isSubmitting} className="mt-2">
            پرداخت {formatToman(total)}
          </Button>
        </form>

        <div className="lg:col-span-1">
          <div className="sticky top-20">
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
        </div>
      </div>
    </div>
  );
}
