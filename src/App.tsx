// src/App.tsx
import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PageTitleManager } from "@/components/common/PageTitleManager";
import { Home } from "@/pages/Home";

const Hotels = lazy(() =>
  import("@/pages/Hotels").then((m) => ({ default: m.Hotels })),
);
const HotelDetails = lazy(() =>
  import("@/pages/HotelDetails").then((m) => ({ default: m.HotelDetails })),
);
const Booking = lazy(() =>
  import("@/pages/Booking").then((m) => ({ default: m.Booking })),
);
const Checkout = lazy(() =>
  import("@/pages/Checkout").then((m) => ({ default: m.Checkout })),
);
const Confirmation = lazy(() =>
  import("@/pages/Confirmation").then((m) => ({ default: m.Confirmation })),
);
const Login = lazy(() =>
  import("@/pages/Login").then((m) => ({ default: m.Login })),
);
const Register = lazy(() =>
  import("@/pages/Register").then((m) => ({ default: m.Register })),
);
const MyBookings = lazy(() =>
  import("@/pages/MyBookings").then((m) => ({ default: m.MyBookings })),
);
const BookingDetails = lazy(() =>
  import("@/pages/BookingDetails").then((m) => ({ default: m.BookingDetails })),
);
const Favorites = lazy(() =>
  import("@/pages/Favorites").then((m) => ({ default: m.Favorites })),
);
const Profile = lazy(() =>
  import("@/pages/Profile").then((m) => ({ default: m.Profile })),
);
const About = lazy(() =>
  import("@/pages/About").then((m) => ({ default: m.About })),
);
const Contact = lazy(() =>
  import("@/pages/Contact").then((m) => ({ default: m.Contact })),
);

const queryClient = new QueryClient();

function PageLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center text-sm text-neutral-500">
      در حال بارگذاری...
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <PageTitleManager />
        <Suspense fallback={<PageLoading />}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/hotels" element={<Hotels />} />
              <Route path="/hotels/:hotelId" element={<HotelDetails />} />
              <Route path="/booking/:hotelId" element={<Booking />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route
                path="/confirmation/:bookingId"
                element={<Confirmation />}
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/my-bookings" element={<MyBookings />} />
                <Route
                  path="/my-bookings/:bookingId"
                  element={<BookingDetails />}
                />
                <Route path="/profile" element={<Profile />} />
                <Route path="/favorites" element={<Favorites />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
