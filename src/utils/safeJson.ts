// src/utils/safeJson.ts
// خواندن امن localStorage/JSON — در صورت خراب‌بودن داده، مقدار پیش‌فرض برمی‌گردد
// تا یک مقدار فاسد نتواند کل اپلیکیشن را از کار بیندازد.

export function safeJsonParse<T>(raw: string | null, fallback: T): T {
  if (raw === null || raw === undefined) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}