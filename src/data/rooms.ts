// src/data/rooms.ts
import type { RoomType } from '@/types'
import { roomImagePool, pickImages } from './images'

function roomImages(offset: number, count = 2) {
  return pickImages(roomImagePool, offset, count)
}

export const roomTypes: RoomType[] = [
  { id: 'baku-fairmont-deluxe', hotelId: 'baku-fairmont', name: 'Deluxe Room', description: 'اتاقی وسیع با چشم‌انداز شهر و تخت کینگ.', maxGuests: 2, bedType: 'King', bedCount: 1, size: 32, view: 'City View', pricePerNight: 180, amenityIds: ['wifi', 'ac', 'roomService'], images: roomImages(0), totalRooms: 20, availableRooms: 8 },
  { id: 'baku-fairmont-suite', hotelId: 'baku-fairmont', name: 'Flame Towers Suite', description: 'سوئیت اجرایی با چشم‌اندازی پانوراما به دریای خزر.', maxGuests: 3, bedType: 'King', bedCount: 1, size: 55, view: 'Sea View', pricePerNight: 320, amenityIds: ['wifi', 'ac', 'roomService', 'spa'], images: roomImages(2), totalRooms: 8, availableRooms: 3 },

  { id: 'baku-oldcity-standard', hotelId: 'baku-oldcity', name: 'Standard Room', description: 'اتاقی دنج با دیوارهای سنگی نمایان و چشم‌انداز شهر قدیم.', maxGuests: 2, bedType: 'Queen', bedCount: 1, size: 22, view: 'Old City View', pricePerNight: 95, amenityIds: ['wifi', 'ac'], images: roomImages(1), totalRooms: 12, availableRooms: 5 },
  { id: 'baku-oldcity-family', hotelId: 'baku-oldcity', name: 'Family Room', description: 'سوئیت دو اتاقه، مناسب خانواده‌ها.', maxGuests: 4, bedType: 'Queen + Twin', bedCount: 2, size: 38, view: 'Courtyard View', pricePerNight: 150, amenityIds: ['wifi', 'ac', 'breakfast'], images: roomImages(3), totalRooms: 6, availableRooms: 2 },

  { id: 'istanbul-bosphorus-deluxe', hotelId: 'istanbul-bosphorus', name: 'Deluxe Bosphorus View', description: 'اتاقی با بالکن رو به پل بسفر.', maxGuests: 2, bedType: 'King', bedCount: 1, size: 34, view: 'Bosphorus View', pricePerNight: 210, amenityIds: ['wifi', 'ac', 'roomService'], images: roomImages(0), totalRooms: 25, availableRooms: 10 },
  { id: 'istanbul-bosphorus-executive', hotelId: 'istanbul-bosphorus', name: 'Executive Room', description: 'فضایی بزرگ‌تر با دسترسی به لانژ.', maxGuests: 2, bedType: 'King', bedCount: 1, size: 42, view: 'Bosphorus View', pricePerNight: 280, amenityIds: ['wifi', 'ac', 'roomService', 'spa'], images: roomImages(4), totalRooms: 10, availableRooms: 4 },
  { id: 'istanbul-bosphorus-suite', hotelId: 'istanbul-bosphorus', name: 'Spa Suite', description: 'سوئیت با تراس اسپای اختصاصی.', maxGuests: 3, bedType: 'King', bedCount: 1, size: 60, view: 'Sea View', pricePerNight: 410, amenityIds: ['wifi', 'ac', 'roomService', 'spa', 'pool'], images: roomImages(1), totalRooms: 5, availableRooms: 2 },

  { id: 'istanbul-sultans-classic', hotelId: 'istanbul-sultans', name: 'Classic Room', description: 'دکوراسیون به سبک عثمانی، فاصله پیاده تا ایاصوفیه.', maxGuests: 2, bedType: 'Queen', bedCount: 1, size: 24, view: 'Street View', pricePerNight: 110, amenityIds: ['wifi', 'ac', 'breakfast'], images: roomImages(2), totalRooms: 14, availableRooms: 6 },
  { id: 'istanbul-sultans-deluxe', hotelId: 'istanbul-sultans', name: 'Deluxe Domed Room', description: 'اتاقی با سقف گنبدی و چشم‌انداز مسجد.', maxGuests: 2, bedType: 'King', bedCount: 1, size: 30, view: 'Mosque View', pricePerNight: 160, amenityIds: ['wifi', 'ac', 'breakfast', 'roomService'], images: roomImages(5), totalRooms: 8, availableRooms: 3 },

  { id: 'istanbul-apartments-studio', hotelId: 'istanbul-apartments', name: 'Studio Apartment', description: 'استودیویی کوچک با آشپزخانه مینیاتوری.', maxGuests: 2, bedType: 'Queen', bedCount: 1, size: 28, view: 'City View', pricePerNight: 70, amenityIds: ['wifi', 'ac', 'laundry'], images: roomImages(0), totalRooms: 10, availableRooms: 4 },
  { id: 'istanbul-apartments-1bed', hotelId: 'istanbul-apartments', name: 'One-Bedroom Apartment', description: 'اتاق‌خواب و نشیمن جدا، آشپزخانه کامل.', maxGuests: 4, bedType: 'Queen', bedCount: 1, size: 48, view: 'City View', pricePerNight: 105, amenityIds: ['wifi', 'ac', 'laundry', 'parking'], images: roomImages(3), totalRooms: 6, availableRooms: 2 },

  { id: 'dubai-marina-deluxe', hotelId: 'dubai-marina', name: 'Deluxe Marina View', description: 'پنجره‌های سراسری با چشم‌انداز مارینا.', maxGuests: 2, bedType: 'King', bedCount: 1, size: 36, view: 'Marina View', pricePerNight: 240, amenityIds: ['wifi', 'ac', 'roomService'], images: roomImages(1), totalRooms: 30, availableRooms: 12 },
  { id: 'dubai-marina-club', hotelId: 'dubai-marina', name: 'Club Room', description: 'دسترسی به لانژ اختصاصی و استخر روی پشت‌بام.', maxGuests: 2, bedType: 'King', bedCount: 1, size: 40, view: 'Marina View', pricePerNight: 340, amenityIds: ['wifi', 'ac', 'roomService', 'pool'], images: roomImages(4), totalRooms: 12, availableRooms: 5 },
  { id: 'dubai-marina-suite', hotelId: 'dubai-marina', name: 'Sky Suite', description: 'سوئیت طبقه بالا با چشم‌اندازی پانوراما به خط آسمان شهر.', maxGuests: 3, bedType: 'King', bedCount: 1, size: 70, view: 'Skyline View', pricePerNight: 520, amenityIds: ['wifi', 'ac', 'roomService', 'spa', 'pool'], images: roomImages(6), totalRooms: 4, availableRooms: 1 },

  { id: 'dubai-desert-tent', hotelId: 'dubai-desert', name: 'Luxury Desert Tent', description: 'چادری مجهز به تهویه مطبوع با تراس اختصاصی.', maxGuests: 2, bedType: 'King', bedCount: 1, size: 45, view: 'Desert View', pricePerNight: 260, amenityIds: ['wifi', 'ac'], images: roomImages(2), totalRooms: 16, availableRooms: 7 },
  { id: 'dubai-desert-pool-villa', hotelId: 'dubai-desert', name: 'Pool Villa', description: 'ویلای مستقل با استخر کوچک اختصاصی.', maxGuests: 4, bedType: 'King + Twin', bedCount: 2, size: 90, view: 'Desert View', pricePerNight: 480, amenityIds: ['wifi', 'ac', 'pool', 'roomService'], images: roomImages(5), totalRooms: 8, availableRooms: 3 },

  { id: 'paris-marais-classic', hotelId: 'paris-marais', name: 'Classic Room', description: 'جذابیت پاریسی با بالکن آهنی.', maxGuests: 2, bedType: 'Queen', bedCount: 1, size: 20, view: 'Street View', pricePerNight: 160, amenityIds: ['wifi', 'ac', 'breakfast'], images: roomImages(0), totalRooms: 14, availableRooms: 6 },
  { id: 'paris-marais-deluxe', hotelId: 'paris-marais', name: 'Deluxe Courtyard Room', description: 'اتاقی آرام رو به حیاط داخلی.', maxGuests: 2, bedType: 'King', bedCount: 1, size: 26, view: 'Courtyard View', pricePerNight: 210, amenityIds: ['wifi', 'ac', 'breakfast', 'roomService'], images: roomImages(3), totalRooms: 8, availableRooms: 3 },

  { id: 'paris-leftbank-studio', hotelId: 'paris-leftbank', name: 'Studio Apartment', description: 'استودیویی کوچک به سبک هوسمانی با سقف بلند.', maxGuests: 2, bedType: 'Queen', bedCount: 1, size: 26, view: 'Street View', pricePerNight: 130, amenityIds: ['wifi', 'ac'], images: roomImages(1), totalRooms: 9, availableRooms: 4 },
  { id: 'paris-leftbank-1bed', hotelId: 'paris-leftbank', name: 'One-Bedroom Apartment', description: 'آشپزخانه کامل و نشیمن جدا.', maxGuests: 4, bedType: 'Queen', bedCount: 1, size: 50, view: 'Courtyard View', pricePerNight: 190, amenityIds: ['wifi', 'ac', 'laundry'], images: roomImages(4), totalRooms: 5, availableRooms: 2 },

  { id: 'paris-montmartre-room', hotelId: 'paris-montmartre', name: 'Terrace Room', description: 'اتاقی با دسترسی به تراس مشترک روی پشت‌بام.', maxGuests: 2, bedType: 'Queen', bedCount: 1, size: 24, view: 'Rooftop View', pricePerNight: 220, amenityIds: ['wifi', 'ac'], images: roomImages(2), totalRooms: 6, availableRooms: 2 },
  { id: 'paris-montmartre-villa', hotelId: 'paris-montmartre', name: 'Entire Villa', description: 'کل ویلا، اختصاصی و خصوصی.', maxGuests: 6, bedType: 'King x2 + Twin', bedCount: 3, size: 140, view: 'City View', pricePerNight: 650, amenityIds: ['wifi', 'ac', 'parking', 'petFriendly'], images: roomImages(6), totalRooms: 1, availableRooms: 1 },

  { id: 'rome-termini-dorm', hotelId: 'rome-termini', name: 'Shared Dorm Bed', description: 'تخت در اتاق مشترک ۶ نفره.', maxGuests: 1, bedType: 'Bunk', bedCount: 1, size: 4, view: 'None', pricePerNight: 35, amenityIds: ['wifi', 'laundry'], images: roomImages(0), totalRooms: 30, availableRooms: 14 },
  { id: 'rome-termini-private', hotelId: 'rome-termini', name: 'Private Twin Room', description: 'اتاق خصوصی با حمام مشترک.', maxGuests: 2, bedType: 'Twin', bedCount: 2, size: 14, view: 'Street View', pricePerNight: 68, amenityIds: ['wifi', 'ac', 'laundry'], images: roomImages(3), totalRooms: 8, availableRooms: 3 },

  { id: 'rome-trastevere-classic', hotelId: 'rome-trastevere', name: 'Classic Room', description: 'دکوراسیونی گرم در ساختمانی بازسازی‌شده از قرن هجدهم.', maxGuests: 2, bedType: 'Queen', bedCount: 1, size: 22, view: 'Cobblestone View', pricePerNight: 105, amenityIds: ['wifi', 'ac', 'breakfast'], images: roomImages(1), totalRooms: 10, availableRooms: 4 },
  { id: 'rome-trastevere-superior', hotelId: 'rome-trastevere', name: 'Superior Room', description: 'اتاقی بزرگ‌تر با گوشه مطالعه کوچک.', maxGuests: 3, bedType: 'Queen + Sofa', bedCount: 1, size: 30, view: 'Courtyard View', pricePerNight: 140, amenityIds: ['wifi', 'ac', 'breakfast', 'roomService'], images: roomImages(4), totalRooms: 6, availableRooms: 2 },
]