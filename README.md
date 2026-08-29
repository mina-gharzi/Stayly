# Stayly

A modern multi-hotel booking platform built as a portfolio project — search, filter, book, and manage hotel stays across 5 destinations.

**Live Demo:** [add your Vercel URL here after deploying]

## Screenshots

> Add a few screenshots or a short GIF here once deployed (Home, Search Results, Hotel Details, Booking flow).

## Features

- Search hotels by destination with URL-persisted filters, sorting, and pagination
- Detailed hotel pages with image gallery, amenities, reviews, and location preview
- Multi-step booking flow (room selection → guest info → payment → confirmation) with draft state persisted across page refreshes
- Mock authentication (login/register) with protected routes
- User area: bookings with cancellation, favorites, and profile management
- Fully RTL, Persian-language UI
- Mock payment simulation with predictable success/failure test cases

## Tech Stack

- **React 19 + TypeScript** (strict mode) — component architecture and type safety
- **Vite** — build tooling
- **Tailwind CSS v4** — styling with CSS-first `@theme` design tokens
- **React Router** — routing and URL-synced state
- **TanStack Query** — server-state caching for all mock API calls
- **React Hook Form + Zod** — form handling and validation
- **Zustand** (with `persist` middleware) — booking draft (`sessionStorage`) and auth session (`localStorage`) only; all other state is local React state or URL state
- **Lucide React** — icons

## Architecture Decisions

**Why TypeScript?** Strict typing catches integration bugs early across a fairly large data model (hotels, rooms, bookings, users) and documents the shape of every service response.

**Why TanStack Query over plain `useEffect`?** Built-in loading/error states, caching, and refetching, without hand-rolling that logic for every page (search results, hotel details, bookings).

**Why a Service Layer (`src/services/`)?** Every service function returns a `Promise`, exactly like a real API call would. Components never import from `src/data/` directly. This means swapping the mock data layer for a real Supabase backend (Milestone B) won't require touching a single component.

**Why URL Search Params for filters/sort/page?** Search state survives a refresh and is shareable/bookmarkable — closer to how a real booking site behaves, and it avoids duplicating state in both a store and the URL.

**Availability model:** Milestone A uses a simple `totalRooms` / `availableRooms` count per room type rather than day-by-day inventory. A calendar-based inventory model is a Milestone B candidate if real availability logic becomes necessary.

**Price calculation:** Fully isolated from UI in `src/utils/pricing.ts` (`calculateNights`, `calculateSubtotal`, `calculateTaxes`, `calculateDiscount`, `calculateTotal`). The tax rate is a single named constant, not a magic number scattered through the codebase.

**Booking draft persistence:** The in-progress booking (selected room, guest info, dates) lives in a Zustand store with `persist` middleware backed by `sessionStorage`, so a refresh mid-flow doesn't lose the user's progress. It's cleared automatically after a successful booking or when the user leaves the flow.

**Mock payment:** `services/payment.ts` exposes a single `mockProcessPayment()` function with deterministic test cases (see below), isolated so it can be swapped for a real payment gateway later without touching the checkout UI.

**Protected routes:** A single `<ProtectedRoute>` wrapper checks the auth store and redirects to `/login?redirect=<path>` when there's no session, restoring the original destination after login.

## Project Structure

```
src/
├── components/    # ui/, layout/, hotel/, room/, review/, booking/, auth/
├── pages/         # one folder per route
├── hooks/         # useHotelSearch, useHotelDetails, useFavorites
├── services/      # mock "API" layer — every function returns a Promise
├── store/         # bookingStore, authStore, toastStore (Zustand)
├── schemas/       # Zod validation schemas
├── types/         # shared TypeScript interfaces/types
├── data/          # static mock dataset (cities, hotels, rooms, users, reviews...)
├── utils/         # pricing, currency formatting, cn helper, icon maps
└── styles/        # global.css with Tailwind v4 design tokens
```

## Getting Started

```bash
git clone <your-repo-url>
cd stayly
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Test Credentials

**Login** — any email from the seeded demo users (e.g. `elena.rossi@example.com`) with password:

```
123456
```

Or register a new account from `/register`.

**Mock Payment** (on the Checkout page):

| Card number starting with | Result |
|---|---|
| `4242` | Always succeeds |
| `0000` | Always fails |
| anything else | 90% success / 10% failure (simulated) |

## Scope Notes

The following are intentionally **out of scope** for this MVP (Milestone A) and are listed here as possible future improvements rather than half-built features: a real backend (Supabase — see Milestone B below), automated tests, a real payment gateway, user-submitted reviews, a hotel-owner dashboard, and day-by-day inventory management.

## Roadmap (Milestone B)

- [ ] Real backend with Supabase (auth, database, queries/mutations)
- [ ] Unit tests (Vitest) for business logic
- [ ] E2E tests (Playwright) for critical user flows
- [ ] Final accessibility, responsive, and performance polish

## License

This is a personal portfolio project and is not licensed for commercial reuse.
