// src/utils/ratings.ts
// مقیاس امتیاز مهمان ۰ تا ۱۰ است؛ برچسب کیفیت در همه‌جا با همین آستانه‌ها محاسبه می‌شود.

export function ratingLabel(score: number): string {
  if (score >= 9) return "عالی";
  if (score >= 8) return "خیلی خوب";
  if (score >= 7) return "خوب";
  return "قابل قبول";
}