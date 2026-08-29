// src/data/reviews.ts
import type { Review } from '@/types'

export const reviews: Review[] = [
  { id: 'rev-1', hotelId: 'baku-fairmont', userId: 'user-3', userName: 'Sophie Laurent', userAvatar: 'https://i.pravatar.cc/150?img=3', rating: 9.5, date: '2026-06-12', comment: 'چشم‌انداز خیره‌کننده برج‌های شعله و سرویس‌دهی بی‌نقص.' },
  { id: 'rev-2', hotelId: 'baku-fairmont', userId: 'user-4', userName: 'James Carter', userAvatar: 'https://i.pravatar.cc/150?img=4', rating: 9.0, date: '2026-05-20', comment: 'صبحانه متنوع و تخت‌های بسیار راحت.' },
  { id: 'rev-3', hotelId: 'baku-fairmont', userId: 'user-8', userName: 'Daniel Kim', userAvatar: 'https://i.pravatar.cc/150?img=8', rating: 8.8, date: '2026-04-02', comment: 'محوطه استخر آخر هفته‌ها کمی شلوغ بود، در غیر این صورت عالی.' },
  { id: 'rev-4', hotelId: 'baku-oldcity', userId: 'user-7', userName: 'Nigar Aliyeva', userAvatar: 'https://i.pravatar.cc/150?img=7', rating: 8.6, date: '2026-06-01', comment: 'موقعیت شهر قدیم را دوست داشتم، پیاده تا همه‌جا نزدیک بود.' },
  { id: 'rev-5', hotelId: 'baku-oldcity', userId: 'user-2', userName: 'Marco Bianchi', userAvatar: 'https://i.pravatar.cc/150?img=2', rating: 8.2, date: '2026-03-15', comment: 'اتاق‌های دلنشین اما دیوارها کمی نازک بودند.' },
  { id: 'rev-6', hotelId: 'istanbul-bosphorus', userId: 'user-5', userName: 'Aylin Demir', userAvatar: 'https://i.pravatar.cc/150?img=5', rating: 9.3, date: '2026-07-01', comment: 'تراس اسپا با چشم‌انداز بسفر فراموش‌نشدنی بود.' },
  { id: 'rev-7', hotelId: 'istanbul-bosphorus', userId: 'user-1', userName: 'Elena Rossi', userAvatar: 'https://i.pravatar.cc/150?img=1', rating: 9.1, date: '2026-06-18', comment: 'استراحتگاه عالی، کارکنان فراتر از انتظار عمل کردند.' },
  { id: 'rev-8', hotelId: 'istanbul-bosphorus', userId: 'user-6', userName: 'Rashid Al Farsi', userAvatar: 'https://i.pravatar.cc/150?img=6', rating: 8.4, date: '2026-05-05', comment: 'ملک زیبا، قیمت رستوران کمی بالا بود.' },
  { id: 'rev-9', hotelId: 'istanbul-sultans', userId: 'user-3', userName: 'Sophie Laurent', userAvatar: 'https://i.pravatar.cc/150?img=3', rating: 8.5, date: '2026-04-22', comment: 'چند قدمی مسجد آبی، فضایی تاریخی.' },
  { id: 'rev-10', hotelId: 'istanbul-sultans', userId: 'user-8', userName: 'Daniel Kim', userAvatar: 'https://i.pravatar.cc/150?img=8', rating: 7.9, date: '2026-02-14', comment: 'ارزش خوبی داشت، صبحانه می‌توانست متنوع‌تر باشد.' },
  { id: 'rev-11', hotelId: 'istanbul-apartments', userId: 'user-4', userName: 'James Carter', userAvatar: 'https://i.pravatar.cc/150?img=4', rating: 8.0, date: '2026-05-30', comment: 'برای اقامت یک‌هفته‌ای عالی بود، آشپزخانه مجهز.' },
  { id: 'rev-12', hotelId: 'dubai-marina', userId: 'user-6', userName: 'Rashid Al Farsi', userAvatar: 'https://i.pravatar.cc/150?img=6', rating: 9.6, date: '2026-07-10', comment: 'بهترین چشم‌انداز مارینا در دبی، تجربه ورود بی‌نقص.' },
  { id: 'rev-13', hotelId: 'dubai-marina', userId: 'user-7', userName: 'Nigar Aliyeva', userAvatar: 'https://i.pravatar.cc/150?img=7', rating: 9.4, date: '2026-06-25', comment: 'استخر روی پشت‌بام و چشم‌انداز خط آسمان ارزش هر ریالش را داشت.' },
  { id: 'rev-14', hotelId: 'dubai-marina', userId: 'user-2', userName: 'Marco Bianchi', userAvatar: 'https://i.pravatar.cc/150?img=2', rating: 9.0, date: '2026-05-08', comment: 'کارکنان بسیار حرفه‌ای، سرویس اتاق سریع.' },
  { id: 'rev-15', hotelId: 'dubai-desert', userId: 'user-1', userName: 'Elena Rossi', userAvatar: 'https://i.pravatar.cc/150?img=1', rating: 9.2, date: '2026-04-14', comment: 'شبی جادویی زیر ستاره‌ها در ویلای استخردار.' },
  { id: 'rev-16', hotelId: 'paris-marais', userId: 'user-5', userName: 'Aylin Demir', userAvatar: 'https://i.pravatar.cc/150?img=5', rating: 8.9, date: '2026-06-05', comment: 'موقعیت زیبا در لو مره، اتاق‌های دنج.' },
  { id: 'rev-17', hotelId: 'paris-marais', userId: 'user-8', userName: 'Daniel Kim', userAvatar: 'https://i.pravatar.cc/150?img=8', rating: 8.7, date: '2026-03-28', comment: 'پیاده تا همه‌جا نزدیک بود، شب‌ها آرام.' },
  { id: 'rev-18', hotelId: 'paris-leftbank', userId: 'user-3', userName: 'Sophie Laurent', userAvatar: 'https://i.pravatar.cc/150?img=3', rating: 8.3, date: '2026-05-16', comment: 'جذابیت کلاسیک پاریسی، هرچند آسانسور کمی کوچک بود.' },
  { id: 'rev-19', hotelId: 'rome-termini', userId: 'user-4', userName: 'James Carter', userAvatar: 'https://i.pravatar.cc/150?img=4', rating: 7.5, date: '2026-04-09', comment: 'برای مسافران کوله‌پشتی عالی، فضایی تمیز و دوستانه.' },
  { id: 'rev-20', hotelId: 'rome-trastevere', userId: 'user-7', userName: 'Nigar Aliyeva', userAvatar: 'https://i.pravatar.cc/150?img=7', rating: 8.7, date: '2026-06-30', comment: 'کوچه‌های سنگ‌فرش را دوست داشتم، صبحانه خوشمزه بود.' },
]