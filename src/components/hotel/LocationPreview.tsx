// src/components/hotel/LocationPreview.tsx
import { MapPin } from "lucide-react";

export function LocationPreview({
  latitude,
  longitude,
  address,
}: {
  latitude: number;
  longitude: number;
  address: string;
}) {
  const delta = 0.01;
  const bbox = `${longitude - delta}%2C${latitude - delta}%2C${longitude + delta}%2C${latitude + delta}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&marker=${latitude}%2C${longitude}`;

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-xl">
        <iframe
          title="موقعیت مکانی هتل"
          src={src}
          className="ltr-content h-48 w-full border-0"
          loading="lazy"
        />
      </div>
      <div className="flex items-start gap-2 px-1">
        <MapPin
          className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400"
          aria-hidden
        />
        <p className="text-sm leading-relaxed text-neutral-600">{address}</p>
      </div>
    </div>
  );
}
