// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Layout } from '@/components/layout/Layout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Home } from '@/pages/Home'
import { Hotels } from '@/pages/Hotels'
import { HotelDetails } from '@/pages/HotelDetails'
import { Booking } from '@/pages/Booking'
import { Checkout } from '@/pages/Checkout'
import { Confirmation } from '@/pages/Confirmation'
import { Login } from '@/pages/Login'
import { Register } from '@/pages/Register'
import { MyBookings } from '@/pages/MyBookings'
import { BookingDetails } from '@/pages/BookingDetails'
import { Favorites } from '@/pages/Favorites'
import { Profile } from '@/pages/Profile'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/hotels/:hotelId" element={<HotelDetails />} />
            <Route path="/booking/:hotelId" element={<Booking />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/confirmation/:bookingId" element={<Confirmation />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route path="/my-bookings/:bookingId" element={<BookingDetails />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/favorites" element={<Favorites />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}