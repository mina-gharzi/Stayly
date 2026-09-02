// src/config/pageTitles.ts
// قانون: تایتل همه‌ی صفحات در این فایل مرکزی نگهداری می‌شه تا تغییر در یک جا انجام بشه.
export const APP_NAME = "Stayly";

// تایتل مسیرهای ثابت
export const pageTitles: Record<string, string> = {
  "/": "خانه",
  "/hotels": "هتل‌ها",
  "/checkout": "تکمیل خرید",
  "/confirmation": "تأیید رزرو",
  "/login": "ورود",
  "/register": "ثبت‌نام",
  "/about": "درباره ما",
  "/contact": "تماس با ما",
  "/my-bookings": "رزروهای من",
  "/profile": "پروفایل",
  "/favorites": "علاقه‌مندی‌ها",
};

// تایتلِ پایه برای مسیرهای پویا (با پارامتر)
export const dynamicPageBaseTitles: Record<string, string> = {
  "/booking": "رزرو",
  "/hotels": "جزئیات هتل",
  "/confirmation": "تأیید رزرو",
  "/my-bookings": "جزئیات رزرو",
};

// تایتلِ پایه‌ی یک مسیر را برمی‌گرداند (بدون نام اپ)
export function getBaseTitleForPath(pathname: string): string | undefined {
  const dynamic = Object.entries(dynamicPageBaseTitles).find(([base]) =>
    pathname.startsWith(`${base}/`)
  );
  if (dynamic) return dynamic[1];
  return pageTitles[pathname];
}

// تایتل نهاییِ تب مرورگر: اگر تایتل داده شد «تایتل | Stayly» وگرنه فقط «Stayly»
export function buildTitle(title: string | undefined): string {
  return title ? `${title} | ${APP_NAME}` : APP_NAME;
}
