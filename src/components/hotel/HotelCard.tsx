// src/components/hotel/HotelCard.tsx
import { Link } from "react-router-dom";
import { Star, MapPin, Images, ArrowLeft } from "lucide-react";
import type { Hotel } from "@/types";
import { getCityById, getAmenitiesByIds } from "@/services/catalog";
import { Card } from "@/components/ui/Card";
import { formatToman } from "@/utils/currency";
import { amenityIconMap } from "@/utils/amenityIcons";
import { propertyTypeMeta } from "@/utils/propertyTypes";
import { FavoriteButton } from "./FavoriteButton";

function ratingLabel(score: number) {
  if (score >= 9) return "عالی";
  if (score >= 8) return "خیلی خوب";
  if (score >= 7) return "خوب";
  return "قابل قبول";
}

export function HotelCard({
  hotel,
  layout = "grid",
}: {
  hotel: Hotel;
  layout?: "grid" | "list";
}) {
  const city = getCityById(hotel.cityId);
  const typeMeta = propertyTypeMeta[hotel.propertyType];
  const TypeIcon = typeMeta.icon;
  const cityName = city ? `${city.name}, ${city.country}` : hotel.address;

  /* ─────────────────────────  حالت فهرست — صفحه نتایج  ───────────────────────── */
  if (layout === "list") {
    return (
      <Link to={`/hotels/${hotel.id}`} className="group block h-full">
        <Card className="flex h-full flex-col overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary-200 group-hover:shadow-elevated lg:flex-row">
          {/* ─── تصویر ─── */}
          <div className="relative aspect-4/3 w-full shrink-0 overflow-hidden lg:aspect-auto lg:w-72">
            <img
              src={hotel.images[0]?.url}
              alt={hotel.images[0]?.alt ?? hotel.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-neutral-900/40 via-transparent to-transparent lg:bg-none" />

            {/* دکمه علاقهمندی */}
            <FavoriteButton
              hotelId={hotel.id}
              className="absolute top-3 inset-s-3"
            />

            {/* برچسب نوع اقامتگاه */}
            <span className="absolute top-3 inset-e-3 flex items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
              <TypeIcon className="h-3 w-3" aria-hidden />
              {typeMeta.label}
            </span>

            {/* حباب امتیاز */}
            <span className="absolute bottom-3 inset-s-3 flex items-center gap-1.5 rounded-xl bg-primary-600 px-2.5 py-1.5 text-white shadow-card">
              <Star className="h-3.5 w-3.5 fill-white text-white" aria-hidden />
              <span className="text-sm font-bold tabular-nums">
                {hotel.guestRating.toFixed(1)}
              </span>
              <span className="text-[10px] font-medium text-white/80">
                {ratingLabel(hotel.guestRating)}
              </span>
            </span>

            {/* تعداد عکس */}
            <span className="absolute bottom-4 inset-e-3 hidden items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md lg:flex">
              <Images className="h-3 w-3" aria-hidden />
              {hotel.images.length} عکس
            </span>
          </div>

          {/* ─── محتوا ─── */}
          <div className="flex flex-1 flex-col gap-2.5 p-5 sm:p-6">
            {/* نام + ستارهها */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-bold text-neutral-900 transition-colors duration-300 group-hover:text-primary-700">
                {hotel.name}
              </h3>
              <span className="flex items-center gap-0.5" aria-label={`${hotel.starRating} ستاره`}>
                {Array.from({ length: hotel.starRating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5 fill-warning-500 text-warning-500"
                    aria-hidden
                  />
                ))}
              </span>
            </div>

            {/* موقعیت */}
            <p className="flex items-center gap-1.5 text-sm text-neutral-500">
              <MapPin className="h-4 w-4 text-neutral-400" aria-hidden />
              {cityName}
            </p>

            {/* توضیح */}
            <p className="line-clamp-2 text-sm leading-relaxed text-neutral-600">
              {hotel.description}
            </p>

            {/* امکانات کلیدی */}
            <div className="mt-1 flex flex-wrap gap-1.5">
              {getAmenitiesByIds(hotel.amenityIds)
                .slice(0, 4)
                .map((amenity) => {
                  const Icon = amenityIconMap[amenity.icon];
                  return (
                    <span
                      key={amenity.id}
                      className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-600"
                    >
                      {Icon && <Icon className="h-3 w-3 text-neutral-500" aria-hidden />}
                      {amenity.name}
                    </span>
                  );
                })}
            </div>

            {/* ─── قیمت + CTA ─── */}
            <div className="mt-auto flex flex-wrap items-end justify-between gap-3 border-t border-neutral-100 pt-4">
              <div>
                <p className="text-[11px] text-neutral-500">
                  شروع از {hotel.reviewCount.toLocaleString("fa-IR")} نظر
                </p>
                <p className="mt-0.5 text-xl font-bold text-neutral-900">
                  <span className="tabular-price">
                    {formatToman(hotel.pricePerNightFrom)}
                  </span>
                  <span className="text-xs font-medium text-neutral-500"> / شب</span>
                </p>
              </div>

              <span className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-5 py-2.5 text-sm font-bold text-white shadow-card transition-all duration-300 group-hover:bg-primary-700 group-hover:shadow-elevated">
                انتخاب اتاق
                <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
              </span>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  /* ─────────────────────────  حالت گرید — صفحه خانه / علاقهمندیها  ───────────────────────── */
  return (
    <Link to={`/hotels/${hotel.id}`} className="group block h-full">
      <Card className="flex h-full flex-col overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary-200 group-hover:shadow-elevated">
        <div className="relative aspect-4/3 w-full overflow-hidden">
          <img
            src={hotel.images[0]?.url}
            alt={hotel.images[0]?.alt ?? hotel.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-t from-neutral-900/30 via-transparent to-transparent" />
          <FavoriteButton
            hotelId={hotel.id}
            className="absolute top-3 inset-s-3"
          />
          {/* برچسب نوع اقامتگاه */}
          <span className="absolute top-3 inset-e-3 flex items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
            <TypeIcon className="h-3 w-3" aria-hidden />
            {typeMeta.label}
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-1.5 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 text-sm font-semibold text-neutral-900 transition-colors duration-300 group-hover:text-primary-700">
              {hotel.name}
            </h3>
            <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-neutral-600">
              <Star
                className="h-3.5 w-3.5 fill-primary-600 text-primary-600"
                aria-hidden
              />
              {hotel.guestRating.toFixed(1)}
            </span>
          </div>
          <p className="text-sm text-neutral-500">{cityName}</p>
          <p className="mt-auto pt-2 text-sm">
            <span className="tabular-price font-semibold text-neutral-900">
              {formatToman(hotel.pricePerNightFrom)}
            </span>
            <span className="text-neutral-500"> / شب</span>
          </p>
        </div>
      </Card>
    </Link>
  );
}