// src/hooks/usePageTitle.ts
import { useEffect } from "react";
import { buildTitle } from "@/config/pageTitles";

// تایتل تب مرورگر را به‌صورت «عنوان | Stayly» تنظیم می‌کند.
// برای صفحات پویا که نام هتل/رزرو دارند، تایتل را از داده بسازید.
// اگر تایتل خالی/تعریف‌نشده بود کاری نمی‌کند تا تایتلِ پایه‌ی PageTitleManager دست‌نخورده بماند
// (مثلاً در حالت loading که داده هنوز نیامده).
export function usePageTitle(title: string | undefined) {
  useEffect(() => {
    if (title) document.title = buildTitle(title);
  }, [title]);
}
