// src/pages/BookingDetails/index.tsx
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  User,
  Receipt,
  Hotel,
  RotateCcw,
  CheckCircle2,
  Clock3,
} from "lucide-react";
import {
  getBookingById,
  cancelBooking,
  BookingAccessError,
  BookingValidationError,
} from "@/services/bookings";
import { getCancellationByBookingId } from "@/services/cancellations";
import { hotels } from "@/data/hotels";
import { roomTypes } from "@/data/rooms";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { FadeIn } from "@/components/common/FadeIn";
import { formatToman } from "@/utils/currency";
import { useToastStore } from "@/store/toastStore";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/utils/cn";

const statusLabels: Record<
  string,
  {
    label: string;
    variant: "success" | "warning" | "error" | "neutral";
    bg: string;
  }
> = {
  pending: {
    label: "در انتظار پرداخت",
    variant: "warning",
    bg: "bg-warning-500",
  },
  confirmed: {
    label: "تأیید شده",
    variant: "success",
    bg: "bg-success-500",
  },
  completed: {
    label: "انجام‌شده",
    variant: "neutral",
    bg: "bg-neutral-400",
  },
  cancelled: {
    label: "لغو شده",
    variant: "error",
    bg: "bg-error-500",
  },
};

export function BookingDetails() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  const user = useAuthStore((s) => s.user);
  const [modalOpen, setModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // قانون ۸: فقط رزرو متعلق به کاربر لاگین‌شده باید برگردونده بشه — این صفحه زیر
  // ProtectedRoute هست، پس user باید موجود باشه، ولی برای اطمینان چک می‌کنیم
  const { data: booking, isLoading } = useQuery({
    queryKey: ["booking", bookingId, user?.id],
    queryFn: () => getBookingById(bookingId!, user!.id),
    enabled: !!bookingId && !!user,
  });

  // وضعیت واقعی استرداد وجه — از Data Layer، نه فقط پیام گذرا در UI (قانون ۷)
  const { data: cancellation } = useQuery({
    queryKey: ["cancellation", bookingId],
    queryFn: () => getCancellationByBookingId(bookingId!),
    enabled: !!bookingId && booking?.status === "cancelled",
    // تا وقتی استرداد تکمیل نشده، هر ۲ ثانیه یک‌بار وضعیتش رو دوباره می‌خونیم تا کاربر
    // آپدیت رو (بدون رفرش دستی صفحه) ببینه
    refetchInterval: (query) =>
      query.state.data?.refundStatus === "completed" ? false : 2000,
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <Skeleton className="h-64 w-full rounded-2xl" />
        <div className="mt-6 space-y-4">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-neutral-100">
          <Hotel className="h-8 w-8 text-neutral-400" />
        </div>
        <p className="mt-4 font-semibold text-neutral-800">رزرو یافت نشد</p>
        <p className="mt-1 text-sm text-neutral-400">
          رزرو مورد نظر وجود ندارد یا حذف شده است
        </p>
        <Link
          to="/my-bookings"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary-700 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-900"
        >
          <ArrowRight className="h-4 w-4" />
          بازگشت به رزروها
        </Link>
      </div>
    );
  }

  const hotel = hotels.find((h) => h.id === booking.hotelId);
  const room = roomTypes.find((r) => r.id === booking.roomTypeId);
  const status = statusLabels[booking.status];
  const canCancel =
    booking.status === "pending" || booking.status === "confirmed";

  async function handleConfirmCancel() {
    if (!user) return;
    setIsCancelling(true);
    try {
      await cancelBooking(booking!.id, user.id);
      await queryClient.invalidateQueries({ queryKey: ["booking", bookingId] });
      await queryClient.invalidateQueries({ queryKey: ["cancellation", bookingId] });
      await queryClient.invalidateQueries({ queryKey: ["bookings"] });
      setModalOpen(false);
      showToast("رزرو لغو شد و فرآیند استرداد وجه آغاز شد", "success");
    } catch (err) {
      const message =
        err instanceof BookingAccessError || err instanceof BookingValidationError
          ? err.message
          : "لغو رزرو با مشکل مواجه شد. لطفاً دوباره تلاش کنید.";
      showToast(message, "error");
    } finally {
      setIsCancelling(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {/* دکمه بازگشت */}
      <FadeIn>
        <button
          type="button"
          onClick={() => navigate("/my-bookings")}
          className="mb-6 flex items-center gap-1.5 text-sm font-medium text-neutral-500 transition-colors hover:text-primary-600"
        >
          <ArrowRight className="h-4 w-4" />
          بازگشت به رزروها
        </button>
      </FadeIn>

      {/* ── هدر ── */}
      <FadeIn delay={100}>
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-card">
        {/* تصویر هتل */}
        {hotel?.images[0] && (
          <div className="relative h-48 w-full overflow-hidden sm:h-56">
            <img
              src={hotel.images[0].url}
              alt={hotel.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

            {/* اطلاعات روی تصویر */}
            <div className="absolute bottom-0 right-0 left-0 p-5">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-white/60">
                    شماره رزرو
                  </p>
                  <p className="ltr-content mt-0.5 font-mono text-sm font-medium text-white/80">
                    {booking.id}
                  </p>
                  <h1 className="mt-1 text-2xl font-bold text-white">
                    {hotel?.name}
                  </h1>
                </div>
                <Badge
                  variant={status.variant}
                  className={cn(
                    "border-0 text-white",
                    status.bg
                  )}
                >
                  {status.label}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* بدون تصویر */}
        {!hotel?.images[0] && (
          <div className="border-b border-neutral-100 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs text-neutral-400">
                  {booking.id}
                </p>
                <h1 className="mt-1 text-2xl font-bold text-neutral-900">
                  {hotel?.name}
                </h1>
              </div>
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>
          </div>
        )}

        <div className="p-5">
          {/* ── جزئیات اقامت ── */}
          <Section title="اطلاعات اقامت" icon={<CalendarDays className="h-4 w-4" />}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <InfoBox label="اتاق" value={room?.name || "—"} />
              <InfoBox
                label="ورود"
                value={booking.checkIn}
                ltr
              />
              <InfoBox
                label="خروج"
                value={booking.checkOut}
                ltr
              />
              <InfoBox
                label="تعداد شب"
                value={`${booking.checkIn && booking.checkOut ? Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / 86400000) : "—"}`}
              />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <InfoBox
                label="مهمانان"
                value={`${booking.adults} بزرگسال${booking.children > 0 ? `، ${booking.children} کودک` : ""}`}
              />
              <InfoBox
                label="تعداد اتاق"
                value={`${booking.rooms}`}
              />
            </div>
          </Section>

          {/* ── اطلاعات مسافر ── */}
          <Section title="اطلاعات مسافر" icon={<User className="h-4 w-4" />}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <InfoBox
                label="نام کامل"
                value={`${booking.guestInfo.firstName} ${booking.guestInfo.lastName}`}
              />
              <InfoBox
                label="ایمیل"
                value={booking.guestInfo.email}
                ltr
              />
              <InfoBox
                label="تلفن"
                value={booking.guestInfo.phone}
                ltr
              />
            </div>
            {booking.guestInfo.specialRequests && (
              <div className="mt-3 rounded-xl bg-neutral-50 p-3.5">
                <p className="text-xs text-neutral-400">درخواست ویژه</p>
                <p className="mt-1 text-sm text-neutral-700">
                  {booking.guestInfo.specialRequests}
                </p>
              </div>
            )}
          </Section>

          {/* ── جزئیات پرداخت ── */}
          <Section title="جزئیات پرداخت" icon={<Receipt className="h-4 w-4" />}>
            <div className="rounded-xl border border-neutral-100 bg-neutral-50/50 p-4">
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-500">اجاره</span>
                  <span className="tabular-price font-medium text-neutral-800">
                    {formatToman(booking.priceBreakdown.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">مالیات و عوارض</span>
                  <span className="tabular-price font-medium text-neutral-800">
                    {formatToman(booking.priceBreakdown.taxAmount)}
                  </span>
                </div>
                {booking.priceBreakdown.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-success-500">تخفیف</span>
                    <span className="tabular-price font-medium text-success-500">
                      -{formatToman(booking.priceBreakdown.discount)}
                    </span>
                  </div>
                )}
                <div className="border-t border-neutral-200 pt-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-900">
                      مبلغ نهایی
                    </span>
                    <span className="tabular-price text-lg font-bold text-primary-700">
                      {formatToman(booking.priceBreakdown.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* ── وضعیت استرداد وجه — قانون ۷: داده‌ی واقعی، نه فقط پیام گذرا ── */}
          {booking.status === "cancelled" && (
            <Section title="وضعیت استرداد وجه" icon={<RotateCcw className="h-4 w-4" />}>
              {cancellation ? (
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-xl border p-4",
                    cancellation.refundStatus === "completed"
                      ? "border-success-200 bg-success-50"
                      : "border-warning-200 bg-warning-50"
                  )}
                >
                  {cancellation.refundStatus === "completed" ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-success-500" />
                  ) : (
                    <Clock3 className="h-5 w-5 shrink-0 animate-pulse text-warning-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-neutral-900">
                      {cancellation.refundStatus === "completed"
                        ? "استرداد وجه با موفقیت تکمیل شد"
                        : "استرداد وجه در حال پردازش است"}
                    </p>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      تاریخ لغو:{" "}
                      <span className="ltr-content">
                        {new Date(cancellation.cancelledAt).toLocaleString("fa-IR")}
                      </span>
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-neutral-500">در حال دریافت وضعیت استرداد...</p>
              )}
            </Section>
          )}

          {/* ── دکمه لغو ── */}
          {canCancel && (
            <div className="mt-5 border-t border-neutral-100 pt-5">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-error-200 bg-error-50 py-3 text-sm font-medium text-error-600 transition-all hover:bg-error-100 hover:border-error-300 active:scale-[0.99]"
              >
                <AlertTriangle className="h-4 w-4" />
                لغو رزرو
              </button>
            </div>
          )}
        </div>
        </div>
      </FadeIn>
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="لغو رزرو"
      >
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-warning-100">
            <AlertTriangle className="h-5 w-5 text-warning-500" />
          </div>
          <div>
            <p className="font-medium text-neutral-900">
              آیا از لغو این رزرو مطمئن هستید؟
            </p>
            <p className="mt-1 text-sm text-neutral-500">
              عملیات لغو غیرقابل بازگشت است و فرآیند استرداد وجه آغاز خواهد شد.
            </p>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setModalOpen(false)}
          >
            انصراف
          </Button>
          <Button
            className="flex-1 bg-error-500 hover:bg-error-600"
            onClick={handleConfirmCancel}
            isLoading={isCancelling}
          >
            بله، لغو کن
          </Button>
        </div>
      </Modal>
    </div>
  );
}

/* ── کمک‌کننده‌ها ── */

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5 border-b border-neutral-100 pb-5 last:mb-0 last:border-b-0 last:pb-0">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-neutral-800">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary-50 text-primary-600">
          {icon}
        </div>
        {title}
      </div>
      {children}
    </div>
  );
}

function InfoBox({
  label,
  value,
  ltr = false,
}: {
  label: string;
  value: string;
  ltr?: boolean;
}) {
  return (
    <div className="rounded-xl bg-neutral-50 px-3.5 py-2.5">
      <p className="text-[10px] uppercase tracking-wider text-neutral-400">
        {label}
      </p>
      <p
        className={cn(
          "mt-0.5 text-sm font-medium text-neutral-800",
          ltr && "ltr-content"
        )}
      >
        {value}
      </p>
    </div>
  );
}
