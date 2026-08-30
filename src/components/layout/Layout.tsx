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
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
      <Toaster />
    </div>
  );
}
