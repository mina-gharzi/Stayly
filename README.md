# Stayly — Hotel Booking

A multi-hotel booking app with the full reservation flow: search and filter hotels, pick a room, enter guest details, pay, and manage bookings. Persian-first (RTL) interface.

**[Live demo](https://stayly-nu.vercel.app/)**

![Stayly screenshot](docs/screenshot.png)

> **This is a front-end project with a simulated backend.** There is no server or database. A typed service layer imitates an API (with network delay) and keeps data in `localStorage`. Payments are fake and no card data is stored.

**Built with:** React · TypeScript · React Router · TanStack Query · Zustand · React Hook Form · Zod · Tailwind CSS · Vitest · Playwright

## Try it

- **Demo login:** `elena.rossi@example.com` with password `123456`, or register a new account.
- **Test cards:** `4242 4242 4242 4242` always succeeds, a number starting with `0000` always fails. Any other number succeeds about 90% of the time. Use any future expiry and any 3-digit CVV.

## What it does

- **Search and browse:** destination, dates and guests; filters for price, star rating, guest rating, property type and amenities; sorting and pagination
- **Hotel pages:** image gallery, room types, amenities, reviews with rating distribution, location preview
- **Booking flow:** room and guest details, then checkout, then a confirmation page, with state kept if you go back and forth
- **Account:** register and log in, edit your profile, save favorites, view your bookings and booking details
- **Cancellation:** cancel a pending or confirmed booking; the room is released and a refund record is created

## Key engineering decisions

**Business rules live in services, not in components.** The UI can be bypassed by opening `/checkout` directly, so the booking service re-validates dates, room availability and guest capacity itself.

**The server side never trusts the client's price.** Checkout recalculates the total from the room price and the pricing rules and charges that amount, ignoring whatever the form sent.

**Users only see their own bookings.** Looking up or cancelling someone else's booking returns nothing or an access error, as a real API would.

**Pricing is a derived value.** It is computed from one source (`utils/pricing`) instead of being stored per step, so going back to change a room cannot leave stale totals.

**Payments keep only the last four digits.** The gateway simulation processes the card number and drops it; only the result and last four digits are saved.

**Corrupted storage cannot crash the app.** Reads from `localStorage` go through a safe parser with a fallback.

## Testing

| Layer | Tooling | What it covers |
| --- | --- | --- |
| Unit | Vitest | pricing, booking rules, hotel search/filter/sort/pagination, payments, the full checkout orchestration, id and storage safety |
| End-to-end | Playwright | login and registration, a successful booking, a failed payment, cancellation, favorites, responsive navigation |

```bash
npx vitest run
npx playwright test
```

## Getting started

Requirements: Node.js 20+.

```bash
git clone https://github.com/mina-gharzi/Stayly.git
cd Stayly
npm install
npm run dev
```

## Project structure

```
src/pages/       route-level screens (Home, Hotels, HotelDetails, Booking, Checkout, ...)
src/components/  UI grouped by feature (hotel, booking, review, ui, layout)
src/services/    mock API: hotels, rooms, bookings, payments, checkout, cancellations
src/utils/       pricing and booking rules (pure, unit-tested)
src/store/       Zustand stores: auth session, booking state, toasts
src/schemas/     Zod validation schemas
e2e/             Playwright tests
```

## License

MIT © Mina Gharzi