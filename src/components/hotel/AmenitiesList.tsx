// src/components/hotel/AmenitiesList.tsx
import { getAmenitiesByIds } from "@/services/catalog";
import { amenityIconMap } from "@/utils/amenityIcons";

export function AmenitiesList({ amenityIds }: { amenityIds: string[] }) {
  const items = getAmenitiesByIds(amenityIds);

  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((amenity) => {
        const Icon = amenityIconMap[amenity.icon];
        return (
          <div
            key={amenity.id}
            className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-neutral-50/50 px-3.5 py-2.5 transition-colors hover:border-primary-200 hover:bg-primary-50/50"
          >
            {Icon && (
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-100/80 text-primary-600">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
            )}
            <span className="text-sm font-medium text-neutral-700">
              {amenity.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
