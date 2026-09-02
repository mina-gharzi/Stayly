// src/components/common/PageTitleManager.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getBaseTitleForPath, buildTitle } from "@/config/pageTitles";

// با هر تغییر مسیر، تایتلِ تب مرورگر را مطابق config تنظیم می‌کند.
// صفحاتی که تایتل پویا دارند (مثل نام هتل) می‌توانند با usePageTitle آن را override کنند.
export function PageTitleManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = buildTitle(getBaseTitleForPath(pathname));
  }, [pathname]);

  return null;
}
