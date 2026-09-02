// src/pages/HotelDetails/index.tsx
import { useParams, useNavigate } from "react-router-dom";
import { Star, MapPin, Clock, SearchX, BedDouble } from "lucide-react";
import { useHotelDetails } from "@/hooks/useHotelDetails";
import { getCityById } from "@/services/catalog";
import { ImageGallery } from "@/components/hotel/ImageGallery";
import { AmenitiesList } from "@/components/hotel/AmenitiesList";
import { LocationPreview } from "@/components/hotel/LocationPreview";
import { RoomCard } from "@/components/room/RoomCard";
import { ReviewsSection } from "@/components/review/ReviewsSection";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { FadeIn } from "@/components/common/FadeIn";
import { formatToman } from "@/utils/currency";
import { usePageTitle } from "@/hooks/usePageTitle";
import type { RoomType } from "@/types";

export function HotelDetails() {
  const { hotelId } = useParams<{ hotelId: string }>();
  const navigate = useNavigate();
  const { hotel, rooms, reviews, isLoading, isError, refetch } =
    useHotelDetails(hotelId!);

  usePageTitle(hotel?.name);

  function handleSelectRoom(room: RoomType) {
    navigate(`/booking/${hotelId}?roomTypeId=${room.id}`);
  }

  /* ─── Loading ─── */
  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <Skeleton className="h-[400px] lg:h-[500px] w-full rounded-2xl" />
        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="flex flex-col gap-8 lg:col-span-8">
            <div className="space-y-4">
              <Skeleton className="h-10 w-2/3 rounded-lg" />
              <Skeleton className="h-6 w-1/3 rounded-lg" />
            </div>
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
          <div className="lg:col-span-4">
            <Skeleton className="h-80 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  /* ─── Error ─── */
  if (isError) {
    return (
      <div className="mx-auto max-w-md px-4 py-20">
        <ErrorState
          description="متأسفانه در دریافت اطلاعات این هتل مشکلی به وجود آمده است."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  /* ─── Not Found ─── */
  if (!hotel) {
    return (
      <div className="mx-auto max-w-md px-4 py-20">
        <EmptyState
          icon={SearchX}
          title="هتل یافت نشد"
          description="هتل مورد نظر شما وجود ندارد."
          action={
            <Button size="lg" onClick={() => navigate("/hotels")}>
              بازگشت به جستجو
            </Button>
          }
        />
      </div>
    );
  }

  const city = getCityById(hotel.cityId);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <FadeIn>
        <ImageGallery images={hotel.images} />
      </FadeIn>

      <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* ══════ Main Content ══════ */}
        <div className="flex flex-col gap-10 lg:col-span-8">
          {/* Header */}
          <FadeIn delay={100}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
                    {hotel.name}
                  </h1>
                  <div className="flex items-center pt-1">
                    {Array.from({ length: hotel.starRating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-warning-400 text-warning-400"
                        aria-hidden
                      />
                    ))}
                  </div>
                </div>
                <p className="flex items-center gap-1.5 text-neutral-600">
                  <MapPin className="h-4 w-4 shrink-0" aria-hidden />
                  {city?.name}، {hotel.address}
                </p>
              </div>

              {/* امتیاز */}
              <div className="flex shrink-0 items-center gap-2.5">
                <span className="rounded-lg bg-primary-700 px-2.5 py-1.5 text-sm font-bold text-white tabular-nums">
                  {hotel.guestRating.toFixed(1)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-neutral-900">
                    {hotel.guestRating >= 4.5
                      ? "فوق‌العاده"
                      : hotel.guestRating >= 4.0
                        ? "بسیار خوب"
                        : "خوب"}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {hotel.reviewCount} نظر ثبت شده
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>

          <div className="h-px bg-neutral-200" />

          {/* Description */}
          <FadeIn delay={200}>
            <section>
              <h2 className="text-xl font-bold text-neutral-900">درباره هتل</h2>
              <p className="mt-4 text-neutral-700 leading-loose">
                {hotel.description}
              </p>
            </section>
          </FadeIn>

          {/* Amenities */}
          <FadeIn delay={250}>
            <section>
              <h2 className="text-xl font-bold text-neutral-900">امکانات</h2>
              <div className="mt-6">
                <AmenitiesList amenityIds={hotel.amenityIds} />
              </div>
            </section>
          </FadeIn>

          {/* Policies */}
          <FadeIn delay={300}>
            <section>
              <h2 className="text-xl font-bold text-neutral-900">قوانین هتل</h2>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex items-start gap-3 rounded-xl border border-neutral-200 p-4">
                  <Clock
                    className="h-5 w-5 shrink-0 text-neutral-500"
                    aria-hidden
                  />
                  <div>
                    <p className="text-sm text-neutral-500">ساعت ورود</p>
                    <p className="ltr-content mt-0.5 font-medium text-neutral-900">
                      {hotel.policy.checkInTime}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl border border-neutral-200 p-4">
                  <Clock
                    className="h-5 w-5 shrink-0 text-neutral-500"
                    aria-hidden
                  />
                  <div>
                    <p className="text-sm text-neutral-500">ساعت خروج</p>
                    <p className="ltr-content mt-0.5 font-medium text-neutral-900">
                      {hotel.policy.checkOutTime}
                    </p>
                  </div>
                </div>
                <div className="rounded-xl border border-neutral-200 p-4 sm:col-span-2 lg:col-span-3">
                  <p className="text-sm text-neutral-500">قوانین کنسلی</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-neutral-800">
                    {hotel.policy.cancellation}
                  </p>
                </div>
              </div>
            </section>
          </FadeIn>

          <div className="h-px bg-neutral-200" />

          {/* Rooms */}
          <FadeIn delay={350}>
            <section id="rooms-anchor" className="scroll-mt-24">
              <h2 className="text-xl font-bold text-neutral-900">
                اتاق‌های موجود
              </h2>
              {rooms.length > 0 ? (
                <div className="mt-6 flex flex-col gap-4">
                  {rooms.map((room) => (
                    <RoomCard
                      key={room.id}
                      room={room}
                      onSelect={handleSelectRoom}
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-6">
                  <EmptyState
                    icon={BedDouble}
                    title="اتاقی برای این هتل ثبت نشده است"
                    description="لطفاً بعداً دوباره مراجعه کنید."
                  />
                </div>
              )}
            </section>
          </FadeIn>

          {/* Reviews */}
          <FadeIn delay={400}>
            <section>
              <h2 className="text-xl font-bold text-neutral-900">
                نظرات کاربران
              </h2>
              <div className="mt-6">
                <ReviewsSection
                  reviews={reviews}
                  guestRating={hotel.guestRating}
                />
              </div>
            </section>
          </FadeIn>
        </div>

        {/* ══════ Sidebar ══════ */}
        <FadeIn delay={200} direction="left" className="lg:col-span-4">
          <div className="sticky top-24 flex flex-col gap-6">
            {/* Booking Card */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <p className="text-sm text-neutral-500">شروع قیمت از</p>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="tabular-price text-2xl font-bold text-neutral-900">
                  {formatToman(hotel.pricePerNightFrom)}
                </span>
                <span className="text-sm text-neutral-500">تومان</span>
              </div>
              <Button
                size="lg"
                className="mt-6 w-full font-medium"
                onClick={() =>
                  document
                    .getElementById("rooms-anchor")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                انتخاب اتاق
              </Button>
            </div>

            {/* Map Card */}
            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
              <div className="border-b border-neutral-100 p-4">
                <h3 className="font-medium text-neutral-900">
                  موقعیت روی نقشه
                </h3>
              </div>
              <div className="p-4">
                <LocationPreview
                  latitude={hotel.latitude}
                  longitude={hotel.longitude}
                  address={hotel.address}
                />
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
