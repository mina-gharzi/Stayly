// src/components/layout/Navbar.tsx
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Heart,
  Menu,
  X,
  LogOut,
  ChevronDown,
  BedDouble,
  Home,
  Info,
  Phone,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const navLinks = [
  { to: "/", label: "خانه", icon: Home },
  { to: "/hotels", label: "هتلها", icon: BedDouble },
  { to: "/about", label: "درباره ما", icon: Info },
  { to: "/contact", label: "تماس با ما", icon: Phone },
];

export function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false); // منوی کاربر
  const [mobileOpen, setMobileOpen] = useState(false); // دراور موبایل
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function handleLogout() {
    logout();
    setMenuOpen(false);
    setMobileOpen(false);
    navigate("/");
  }

  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-neutral-200/60 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          {/* لوگو */}
          <Link to="/" className="flex items-center gap-2.5">
            {/* مونوگرام */}
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-primary-500 to-primary-700 font-display text-lg font-bold text-white shadow-card">
              S
            </span>
            {/* اسم — Sora bold */}
            <span className="font-display text-2xl font-bold tracking-tight text-primary-600">
              Stay<span className="text-primary-600">ly</span>
            </span>
          </Link>

          {/* لینکهای دسکتاپ — آیکونی */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                aria-label={link.label}
                title={link.label}
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                  isActive(link.to)
                    ? "bg-primary-50 text-primary-700"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                }`}
              >
                <link.icon className="h-4.5 w-4.5" aria-hidden />
              </Link>
            ))}
          </nav>

          {/* اکشنها — دسکتاپ */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/favorites"
              aria-label="علاقهمندیها"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition-colors hover:border-primary-300 hover:text-primary-700"
            >
              <Heart className="h-4 w-4" aria-hidden />
            </Link>

            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  className="flex items-center gap-2 rounded-full border border-neutral-200 py-1 pe-2 ps-1 transition-colors hover:border-primary-300"
                >
                  <img
                    src={user.avatar}
                    alt={user.firstName}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-neutral-400 transition-transform duration-300 ${
                      menuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {menuOpen && (
                  <div className="absolute inset-e-0 top-full z-10 mt-2 w-52 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-elevated">
                    <div className="border-b border-neutral-100 px-4 py-3">
                      <p className="text-sm font-semibold text-neutral-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-neutral-500">حساب کاربری</p>
                    </div>
                    <div className="p-2">
                      <Link
                        to="/my-bookings"
                        onClick={() => setMenuOpen(false)}
                        className="block rounded-xl px-3 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-50"
                      >
                        رزروهای من
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setMenuOpen(false)}
                        className="block rounded-xl px-3 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-50"
                      >
                        پروفایل
                      </Link>
                    </div>
                    <div className="border-t border-neutral-100 p-2">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-1.5 rounded-xl px-3 py-2 text-start text-sm text-error-500 transition-colors hover:bg-error-100"
                      >
                        <LogOut className="h-3.5 w-3.5" aria-hidden />
                        خروج
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
              >
                ورود
              </Link>
            )}
          </div>

          {/* دکمه منو — موبایل */}
          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-700 transition-colors hover:border-primary-300 md:hidden"
            aria-label="باز کردن منو"
          >
            <Menu className="h-5 w-5" aria-hidden />
          </button>
        </nav>
      </header>

      {/* بکدراپ دراور */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-neutral-900/40 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* دراور موبایل — از راست به چپ */}
      <aside
        className={`fixed inset-y-0 inset-s-0 z-50 flex w-72 max-w-[85%] flex-col bg-white shadow-elevated transition-transform duration-300 ease-in-out md:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* هدر دراور */}
        <div className="flex h-16 items-center justify-between border-b border-neutral-100 px-4">
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2.5"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-primary-500 to-primary-700 text-white">
              <BedDouble className="h-4.5 w-4.5" aria-hidden />
            </span>
            <span className="text-xl font-extrabold tracking-tight text-neutral-900">
              Stay<span className="text-primary-600">ly</span>
            </span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-700 transition-colors hover:border-primary-300"
            aria-label="بستن منو"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        {/* محتوای دراور */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? "bg-primary-50 text-primary-700"
                    : "text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                <link.icon className="h-4.5 w-4.5" aria-hidden />
                {link.label}
              </Link>
            ))}
            <Link
              to="/favorites"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
            >
              <Heart className="h-4.5 w-4.5" aria-hidden />
              علاقهمندیها
            </Link>

            <div className="my-2 border-t border-neutral-100" />

            {user ? (
              <>
                <p className="px-3 pb-1 text-xs text-neutral-500">
                  {user.firstName} {user.lastName}
                </p>
                <Link
                  to="/my-bookings"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50"
                >
                  رزروهای من
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50"
                >
                  پروفایل
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-start text-sm text-error-500 hover:bg-error-100"
                >
                  <LogOut className="h-4 w-4" aria-hidden />
                  خروج
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="rounded-full bg-primary-600 px-5 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-primary-700"
              >
                ورود
              </Link>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
