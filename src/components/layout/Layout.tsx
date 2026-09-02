// src/components/layout/Layout.tsx
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Toaster } from "@/components/ui/Toaster";

// هر مسیری که تو این لیست باشه، Footer نشون داده نمی‌شه
const noFooterRoutes = ["/login", "/register"];

export function Layout() {
  const location = useLocation();
  const hideFooter = noFooterRoutes.includes(location.pathname);

  return (
    <div className="flex min-h-screen flex-col">
      {/* لینک پرش برای صفحه‌خوان‌ها / کاربران کیبورد */}
      <a
        href="#main-content"
        className="sr-only z-50 rounded-md bg-primary-700 px-4 py-2 text-sm font-medium text-white focus:not-sr-only focus:fixed focus:top-3 focus:right-3"
      >
        پرش به محتوای اصلی
      </a>
      <Navbar />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
      <Toaster />
    </div>
  );
}
