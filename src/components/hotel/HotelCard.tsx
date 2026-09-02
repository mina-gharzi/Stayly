// src/components/hotel/HotelCard.tsx
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import type { Hotel } from "@/types";
import { getCityById } from "@/services/catalog";
import { Card } from "@/components/ui/Card";
import { formatToman } from "@/utils/currency";
import { FavoriteButton } from "./FavoriteButton";

const propertyTypeLabels: Record<Hotel["propertyType"], string> = {
  hotel: "هتل",
  resort: "استراحتگاه",
  apartment: "آپارتمان",
  villa: "ویلا",
  hostel: "هاستل",
  boutique: "بوتیک",
};

export function HotelCard({
  hotel,
  layout = "grid",
}: {
  hotel: Hotel;
  layout?: "grid" | "list";
}) {
  const city = getCityById(hotel.cityId);

  /* حالت افقی — برای صفحه نتایج */
  if (layout === "list") {
    return (
      <Link to={`/hotels/${hotel.id}`} className="group block h-full">
        <Card className="flex flex-col overflow-hidden transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-elevated sm:flex-row">
          {/* تصویر */}
          <div className="relative aspect-4/3 w-full shrink-0 overflow-hidden sm:aspect-auto sm:w-56">
            <img
              src={hotel.images[0]?.url}
              alt={hotel.images[0]?.alt ?? hotel.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <FavoriteButton
              hotelId={hotel.id}
              className="absolute top-3 inset-s-3"
            />
          </div>

          {/* اطلاعات */}
          <div className="flex flex-1 flex-col gap-1.5 p-5">
            <h3 className="line-clamp-1 text-base font-bold text-neutral-900 transition-colors duration-300 group-hover:text-primary-700">
              {hotel.name}
            </h3>
            <p className="text-sm text-neutral-500">
              {city?.name}, {city?.country}
            </p>
            <p className="text-xs text-neutral-500">
              {propertyTypeLabels[hotel.propertyType]}
            </p>
          </div>

          {/* قیمت + امتیاز — سمت چپ (انتهای RTL) */}
          <div className="flex items-center justify-between gap-4 border-t border-neutral-100 p-5 sm:w-52 sm:flex-col sm:items-end sm:justify-center sm:border-s sm:border-t-0">
            <div className="text-end">
              <span className="tabular-price text-lg font-bold text-neutral-900">
                {formatToman(hotel.pricePerNightFrom)}
              </span>
              <span className="block text-xs text-neutral-500">هر شب</span>
            </div>
            <span className="flex items-center gap-1 rounded-md bg-primary-50 px-2 py-1 text-xs font-semibold text-primary-700">
              <Star
                className="h-3 w-3 fill-primary-700 text-primary-700"
                aria-hidden
              />
              {hotel.guestRating.toFixed(1)}
            </span>
          </div>
        </Card>
      </Link>
    );
  }

  /* حالت گرید — صفحه home (همون قبلی) */
  return (
    <Link to={`/hotels/${hotel.id}`} className="group block h-full">
      <Card className="flex h-full flex-col overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-elevated">
        <div className="relative aspect-4/3 w-full overflow-hidden">
          <img
            src={hotel.images[0]?.url}
            alt={hotel.images[0]?.alt ?? hotel.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <FavoriteButton
            hotelId={hotel.id}
            className="absolute top-3 inset-s-3"
          />
        </div>
        <div className="flex flex-1 flex-col gap-1.5 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 text-sm font-semibold text-neutral-900">
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
          <p className="text-sm text-neutral-500">
            {city?.name}, {city?.country}
          </p>
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
