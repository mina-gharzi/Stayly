// src/components/layout/Navbar.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, User, Menu, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="text-xl font-bold text-primary-700">
          Stayly
        </Link>
        <div className="hidden items-center gap-4 md:flex">
          <Link to="/favorites" aria-label="علاقه‌مندی‌ها">
            <Heart className="h-5 w-5" aria-hidden />
          </Link>
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2"
              >
                <img
                  src={user.avatar}
                  alt={user.firstName}
                  className="h-8 w-8 rounded-full object-cover"
                />
              </button>
              {menuOpen && (
                <div className="absolute end-0 top-full z-10 mt-2 w-48 rounded-md border border-neutral-200 bg-white p-2 shadow-elevated">
                  <p className="px-2 py-1 text-sm font-medium text-neutral-900">
                    {user.firstName} {user.lastName}
                  </p>
                  <Link
                    to="/my-bookings"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-md px-2 py-1.5 text-sm hover:bg-neutral-50"
                  >
                    رزروهای من
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-md px-2 py-1.5 text-sm hover:bg-neutral-50"
                  >
                    پروفایل
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-start text-sm text-error-500 hover:bg-error-100"
                  >
                    <LogOut className="h-3.5 w-3.5" aria-hidden /> خروج
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" aria-label="حساب کاربری">
              <User className="h-5 w-5" aria-hidden />
            </Link>
          )}
        </div>
        <button className="md:hidden" aria-label="باز کردن منو">
          <Menu className="h-6 w-6" aria-hidden />
        </button>
      </nav>
    </header>
  );
}
