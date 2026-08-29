// src/pages/HotelDetails/index.tsx
import { useParams, useNavigate } from "react-router-dom";
import { Star, MapPin, Clock, AlertTriangle } from "lucide-react";
import { useHotelDetails } from "@/hooks/useHotelDetails";
import { cities } from "@/data/cities";
import { ImageGallery } from "@/components/hotel/ImageGallery";
import { AmenitiesList } from "@/components/hotel/AmenitiesList";
import { LocationPreview } from "@/components/hotel/LocationPreview";
import { RoomCard } from "@/components/room/RoomCard";
import { ReviewsSection } from "@/components/review/ReviewsSection";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { formatToman } from "@/utils/currency";
import type { RoomType } from "@/types";

export function HotelDetails() {
  const { hotelId } = useParams<{ hotelId: string }>();
  const navigate = useNavigate();
  const { hotel, rooms, reviews, isLoading, isError, refetch } =
    useHotelDetails(hotelId!);

  function handleSelectRoom(room: RoomType) {
    navigate(`/booking/${hotelId}?roomTypeId=${room.id}`);
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="mt-4 h-8 w-1/2" />
        <Skeleton className="mt-2 h-4 w-1/3" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-24 text-center">
        <AlertTriangle className="h-8 w-8 text-error-500" aria-hidden />
        <p className="font-medium text-neutral-900">مشکلی پیش آمد</p>
        <p className="text-sm text-neutral-600">
          بارگذاری اطلاعات هتل با خطا مواجه شد.
        </p>
        <Button variant="outline" onClick={() => refetch()}>
          تلاش مجدد
        </Button>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-24 text-center">
        <p className="font-medium text-neutral-900">هتل یافت نشد</p>
        <Button variant="outline" onClick={() => navigate("/hotels")}>
          بازگشت به جستجو
        </Button>
      </div>
    );
  }

  const city = cities.find((c) => c.id === hotel.cityId);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <ImageGallery images={hotel.images} />

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* ستون اصلی محتوا */}
        <div className="lg:col-span-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">
                {hotel.name}
              </h1>
              <p className="mt-1 flex items-center gap-1 text-sm text-neutral-600">
                <MapPin className="h-4 w-4" aria-hidden />
                {hotel.address}, {city?.name}
              </p>
              <div className="mt-1 flex items-center gap-1">
                {Array.from({ length: hotel.starRating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-warning-500 text-warning-500"
                    aria-hidden
                  />
                ))}
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-center rounded-md bg-primary-700 px-3 py-2 text-white">
              <span className="tabular-nums text-lg font-bold">
                {hotel.guestRating.toFixed(1)}
              </span>
              <span className="text-xs">{hotel.reviewCount} نظر</span>
            </div>
          </div>

          <p className="mt-6 leading-7 text-neutral-700">{hotel.description}</p>

          <div className="mt-8">
            <h2 className="mb-4 text-lg font-semibold text-neutral-900">
              امکانات
            </h2>
            <AmenitiesList amenityIds={hotel.amenityIds} />
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 rounded-lg border border-neutral-200 p-4 sm:w-fit sm:grid-cols-3">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-neutral-600" aria-hidden />
              <div>
                <p className="text-neutral-600">ورود</p>
                <p className="ltr-content font-medium text-neutral-900">
                  {hotel.policy.checkInTime}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-neutral-600" aria-hidden />
              <div>
                <p className="text-neutral-600">خروج</p>
                <p className="ltr-content font-medium text-neutral-900">
                  {hotel.policy.checkOutTime}
                </p>
              </div>
            </div>
            <div className="col-span-2 text-sm sm:col-span-1">
              <p className="text-neutral-600">قوانین لغو</p>
              <p className="font-medium text-neutral-900">
                {hotel.policy.cancellation}
              </p>
            </div>
          </div>

          <div id="rooms-anchor" className="mt-8">
            <h2 className="mb-4 text-lg font-semibold text-neutral-900">
              اتاق‌های موجود
            </h2>
            <div className="flex flex-col gap-4">
              {rooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  onSelect={handleSelectRoom}
                />
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="mb-4 text-lg font-semibold text-neutral-900">
              نظرات مهمانان
            </h2>
            <ReviewsSection reviews={reviews} guestRating={hotel.guestRating} />
          </div>
        </div>

        {/* ستون کناری (Sidebar): باکس قیمت + دکمه رزرو + نقشه */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 flex flex-col gap-4">
            <div className="rounded-lg border border-neutral-200 p-4">
              <p className="text-sm text-neutral-600">شروع قیمت از</p>
              <p className="tabular-price text-2xl font-bold text-neutral-900">
                {formatToman(hotel.pricePerNightFrom)}
              </p>
              <p className="text-xs text-neutral-600">هر شب</p>
              <Button
                className="mt-4 w-full"
                onClick={() =>
                  document
                    .getElementById("rooms-anchor")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                رزرو کنید
              </Button>
            </div>
            <LocationPreview
              latitude={hotel.latitude}
              longitude={hotel.longitude}
              address={hotel.address}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
