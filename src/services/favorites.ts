// src/services/favorites.ts
import { favorites as demoFavorites } from "../data/favorites";

function storageKey(userId: string) {
  return `stayly-favorites:${userId}`;
}

function getFavoriteIds(userId: string): string[] {
  const raw = localStorage.getItem(storageKey(userId));
  if (raw) return JSON.parse(raw);
  const seeded = demoFavorites
    .filter((f) => f.userId === userId)
    .map((f) => f.hotelId);
  localStorage.setItem(storageKey(userId), JSON.stringify(seeded));
  return seeded;
}

export function getFavoriteHotelIds(userId: string): Promise<string[]> {
  return new Promise((resolve) =>
    setTimeout(() => resolve(getFavoriteIds(userId)), 200),
  );
}

export function toggleFavorite(
  userId: string,
  hotelId: string,
): Promise<string[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const ids = getFavoriteIds(userId);
      const next = ids.includes(hotelId)
        ? ids.filter((id) => id !== hotelId)
        : [...ids, hotelId];
      localStorage.setItem(storageKey(userId), JSON.stringify(next));
      resolve(next);
    }, 200);
  });
}
