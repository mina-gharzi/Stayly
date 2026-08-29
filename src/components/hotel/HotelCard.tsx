// src/components/hotel/HotelCard.tsx
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import type { Hotel } from "@/types";
import { cities } from "@/data/cities";
import { Card } from "@/components/ui/Card";
import { formatToman } from "@/utils/currency";
import { FavoriteButton } from "./FavoriteButton";

export function HotelCard({ hotel }: { hotel: Hotel }) {
  const city = cities.find((c) => c.id === hotel.cityId);

  return (
    <Link to={`/hotels/${hotel.id}`} className="group block h-full">
      <Card className="flex h-full flex-col overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-elevated">
        {/* تصویر */}
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

        {/* محتوا — مینیمال */}
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

          {/* قیمت — چسبیده به پایین */}
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
